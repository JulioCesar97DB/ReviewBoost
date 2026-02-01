-- ============================================================
-- ReviewBoost Database Schema Migration
-- Version: 1.0.0
-- Description: Complete database schema for ReviewBoost platform
-- Date: 2026-01-31
-- ============================================================

-- Create private schema for security definer functions
-- This schema should NEVER be exposed via API
create schema if not exists private;

-- ============================================================
-- ENUM TYPES
-- ============================================================

-- Subscription plans for businesses
create type public.subscription_plan as enum (
  'free',
  'starter',
  'growth',
  'agency'
);

-- Review request channels
create type public.request_channel as enum (
  'email',
  'sms',
  'whatsapp'
);

-- Review request status
create type public.request_status as enum (
  'pending',
  'sent',
  'delivered',
  'opened',
  'clicked',
  'review_left',
  'failed',
  'bounced'
);

-- Review sentiment analysis
create type public.review_sentiment as enum (
  'positive',
  'neutral',
  'negative'
);

-- Template types
create type public.template_type as enum (
  'request',
  'response'
);

-- Supported languages
create type public.supported_language as enum (
  'en',
  'es'
);

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Update existing profiles table to add ReviewBoost specific fields
alter table public.profiles
  add column if not exists phone text,
  add column if not exists preferred_language public.supported_language default 'en',
  add column if not exists notifications_enabled boolean default true,
  add column if not exists email_notifications boolean default true,
  add column if not exists push_notifications boolean default true,
  add column if not exists timezone text default 'America/New_York';

-- Businesses table - core entity for business accounts
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  address text,
  city text,
  state text,
  zip_code text,
  country text default 'US',
  phone text,
  email text,
  website text,
  logo_url text,

  -- Google Business Profile integration
  google_place_id text unique,
  google_account_id text,
  google_access_token text,
  google_refresh_token text,
  google_token_expires_at timestamptz,
  google_connected_at timestamptz,

  -- Cached stats (updated via triggers/cron)
  avg_rating numeric(2,1) default 0 check (avg_rating >= 0 and avg_rating <= 5),
  total_reviews integer default 0 check (total_reviews >= 0),
  reviews_this_month integer default 0 check (reviews_this_month >= 0),
  response_rate numeric(5,2) default 0 check (response_rate >= 0 and response_rate <= 100),
  last_review_sync_at timestamptz,

  -- Subscription and limits
  subscription public.subscription_plan default 'free',
  subscription_started_at timestamptz,
  subscription_ends_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  requests_this_month integer default 0 check (requests_this_month >= 0),
  requests_limit integer default 10,

  -- Settings stored as JSONB for flexibility
  settings jsonb default '{
    "alert_on_new_review": true,
    "alert_on_negative_review": true,
    "negative_review_threshold": 3,
    "default_language": "en",
    "auto_respond": false,
    "business_hours": null,
    "review_link_type": "google"
  }'::jsonb,

  -- Metadata
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create index on user_id for fast lookups
create index idx_businesses_user_id on public.businesses(user_id);
create index idx_businesses_google_place_id on public.businesses(google_place_id) where google_place_id is not null;
create index idx_businesses_subscription on public.businesses(subscription);
create index idx_businesses_is_active on public.businesses(is_active) where is_active = true;

-- Reviews table - stores synced reviews from Google
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- Google review data
  google_review_id text unique,
  author_name text not null,
  author_photo_url text,
  profile_photo_url text,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text,
  original_text text, -- Store original if translated
  published_at timestamptz not null,

  -- Response data
  response_text text,
  response_at timestamptz,
  is_responded boolean default false,
  response_published_at timestamptz,

  -- AI analysis
  sentiment public.review_sentiment,
  sentiment_score numeric(4,3) check (sentiment_score >= -1 and sentiment_score <= 1),
  detected_language public.supported_language,
  key_topics text[],

  -- AI response suggestion
  ai_suggested_response text,
  ai_response_generated_at timestamptz,

  -- Tracking
  is_read boolean default false,
  is_flagged boolean default false,
  flag_reason text,
  notes text,

  -- Metadata
  synced_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for reviews
create index idx_reviews_business_id on public.reviews(business_id);
create index idx_reviews_published_at on public.reviews(business_id, published_at desc);
create index idx_reviews_rating on public.reviews(business_id, rating);
create index idx_reviews_not_responded on public.reviews(business_id) where is_responded = false;
create index idx_reviews_sentiment on public.reviews(business_id, sentiment);
create index idx_reviews_google_review_id on public.reviews(google_review_id) where google_review_id is not null;

-- Contacts table - customer contact list
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- Contact info
  name text not null,
  email text,
  phone text,

  -- Organization
  tags text[] default '{}',
  notes text,
  source text, -- 'manual', 'csv_import', 'phone_sync', 'api'

  -- Review tracking
  review_request_count integer default 0 check (review_request_count >= 0),
  last_request_at timestamptz,
  has_left_review boolean default false,
  review_left_at timestamptz,

  -- Preferences
  opted_out boolean default false,
  opted_out_at timestamptz,
  preferred_channel public.request_channel default 'email',
  preferred_language public.supported_language default 'en',

  -- Metadata
  external_id text, -- For syncing with external systems
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Ensure at least email or phone is provided
  constraint contacts_email_or_phone check (email is not null or phone is not null),
  -- Unique constraint per business
  constraint contacts_unique_email unique (business_id, email),
  constraint contacts_unique_phone unique (business_id, phone)
);

-- Indexes for contacts
create index idx_contacts_business_id on public.contacts(business_id);
create index idx_contacts_email on public.contacts(business_id, email) where email is not null;
create index idx_contacts_phone on public.contacts(business_id, phone) where phone is not null;
create index idx_contacts_tags on public.contacts using gin(tags);
create index idx_contacts_has_left_review on public.contacts(business_id, has_left_review);

-- Review Requests table - tracks all review request sends
create table public.review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,

  -- Recipient info (denormalized for historical record)
  recipient_name text not null,
  recipient_email text,
  recipient_phone text,

  -- Request details
  channel public.request_channel not null,
  template_id uuid, -- Will reference templates table
  message_content text not null,
  subject text, -- For email only

  -- Review link
  review_url text not null,
  short_url text, -- Shortened trackable URL

  -- Scheduling
  scheduled_for timestamptz,
  is_scheduled boolean default false,

  -- Status tracking
  status public.request_status default 'pending',
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  review_left_at timestamptz,

  -- Error tracking
  error_message text,
  retry_count integer default 0,
  last_retry_at timestamptz,

  -- External service IDs
  twilio_message_sid text,
  resend_message_id text,

  -- Metadata
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for review_requests
create index idx_review_requests_business_id on public.review_requests(business_id);
create index idx_review_requests_contact_id on public.review_requests(contact_id) where contact_id is not null;
create index idx_review_requests_status on public.review_requests(business_id, status);
create index idx_review_requests_sent_at on public.review_requests(business_id, sent_at desc) where sent_at is not null;
create index idx_review_requests_scheduled on public.review_requests(scheduled_for) where is_scheduled = true and status = 'pending';
create index idx_review_requests_channel on public.review_requests(business_id, channel);

-- Templates table - message templates for requests and responses
create table public.templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- Template info
  name text not null,
  type public.template_type not null,
  channel public.request_channel, -- null for response templates
  language public.supported_language default 'en',

  -- Content
  subject text, -- For email templates
  content text not null,

  -- Variables available: {customer_name}, {business_name}, {review_link}, {short_link}

  -- Settings
  is_default boolean default false,
  is_active boolean default true,

  -- Usage tracking
  usage_count integer default 0 check (usage_count >= 0),
  last_used_at timestamptz,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for templates
create index idx_templates_business_id on public.templates(business_id);
create index idx_templates_type on public.templates(business_id, type);
create index idx_templates_default on public.templates(business_id, type, is_default) where is_default = true;

-- QR Codes table - generated QR codes for physical display
create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- QR Code info
  name text not null,
  description text,

  -- Target URL
  review_url text not null,
  short_url text unique,

  -- Generated QR image
  qr_image_url text,
  qr_svg text, -- Store SVG for on-demand rendering

  -- Styling options
  style jsonb default '{
    "size": 300,
    "color": "#000000",
    "backgroundColor": "#ffffff",
    "logo": null
  }'::jsonb,

  -- Tracking
  scan_count integer default 0 check (scan_count >= 0),
  last_scanned_at timestamptz,

  -- Settings
  is_active boolean default true,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for qr_codes
create index idx_qr_codes_business_id on public.qr_codes(business_id);
create index idx_qr_codes_short_url on public.qr_codes(short_url) where short_url is not null;

-- Notifications table - in-app notifications for users
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,

  -- Notification content
  type text not null, -- 'new_review', 'negative_review', 'review_response', 'request_completed', etc.
  title text not null,
  message text not null,

  -- Related entities
  review_id uuid references public.reviews(id) on delete set null,
  request_id uuid references public.review_requests(id) on delete set null,

  -- Action
  action_url text,
  action_label text,

  -- Status
  is_read boolean default false,
  read_at timestamptz,

  -- Delivery tracking
  email_sent boolean default false,
  email_sent_at timestamptz,
  push_sent boolean default false,
  push_sent_at timestamptz,

  -- Metadata
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes for notifications
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;
create index idx_notifications_created_at on public.notifications(user_id, created_at desc);

-- Analytics Events table - for tracking and metrics
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- Event info
  event_type text not null, -- 'review_received', 'request_sent', 'request_clicked', 'review_response_published', etc.
  event_date date not null default current_date,

  -- Metrics (aggregated by day)
  count integer default 1,

  -- Dimensions
  channel public.request_channel,
  rating integer check (rating >= 1 and rating <= 5),
  sentiment public.review_sentiment,

  -- Metadata
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes for analytics_events
create index idx_analytics_events_business_date on public.analytics_events(business_id, event_date desc);
create index idx_analytics_events_type on public.analytics_events(business_id, event_type, event_date desc);

-- Unique constraint for daily aggregation
create unique index idx_analytics_events_unique_daily
  on public.analytics_events(business_id, event_type, event_date, channel, rating, sentiment)
  where channel is not null or rating is not null or sentiment is not null;

-- API Keys table - for external integrations
create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,

  -- Key info
  name text not null,
  key_hash text not null unique, -- Store hashed version only
  key_prefix text not null, -- Store first 8 chars for identification

  -- Permissions
  permissions text[] default '{"read"}'::text[],

  -- Rate limiting
  rate_limit integer default 1000, -- requests per hour

  -- Tracking
  last_used_at timestamptz,
  usage_count integer default 0,

  -- Status
  is_active boolean default true,
  expires_at timestamptz,
  revoked_at timestamptz,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for api_keys
create index idx_api_keys_business_id on public.api_keys(business_id);
create index idx_api_keys_key_hash on public.api_keys(key_hash) where is_active = true;

-- Audit Log table - for tracking important changes
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,

  -- Action info
  action text not null, -- 'create', 'update', 'delete', 'login', 'settings_change', etc.
  entity_type text not null, -- 'business', 'review', 'contact', 'template', etc.
  entity_id uuid,

  -- Changes
  old_values jsonb,
  new_values jsonb,

  -- Context
  ip_address inet,
  user_agent text,

  -- Metadata
  created_at timestamptz default now()
);

-- Indexes for audit_logs
create index idx_audit_logs_user_id on public.audit_logs(user_id) where user_id is not null;
create index idx_audit_logs_business_id on public.audit_logs(business_id) where business_id is not null;
create index idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);

-- ============================================================
-- SUBSCRIPTION PLAN LIMITS TABLE
-- ============================================================

create table public.subscription_limits (
  plan public.subscription_plan primary key,
  name text not null,
  price_monthly integer not null, -- in cents
  requests_per_month integer not null,
  max_locations integer default 1,
  max_templates integer default 3,
  max_contacts integer default 100,
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default plan limits
insert into public.subscription_limits (plan, name, price_monthly, requests_per_month, max_locations, max_templates, max_contacts, features) values
  ('free', 'Free', 0, 10, 1, 3, 100, '{"qr_code": true, "review_link": true, "email_alerts": true, "ai_responses": false, "sms": false, "whatsapp": false, "analytics": false}'::jsonb),
  ('starter', 'Starter', 1900, 100, 1, 10, 500, '{"qr_code": true, "review_link": true, "email_alerts": true, "ai_responses": true, "sms": true, "whatsapp": false, "analytics": true}'::jsonb),
  ('growth', 'Growth', 3900, 300, 3, 25, 2000, '{"qr_code": true, "review_link": true, "email_alerts": true, "ai_responses": true, "sms": true, "whatsapp": true, "analytics": true, "bulk_send": true, "priority_support": true}'::jsonb),
  ('agency', 'Agency', 9900, -1, 10, -1, -1, '{"qr_code": true, "review_link": true, "email_alerts": true, "ai_responses": true, "sms": true, "whatsapp": true, "analytics": true, "bulk_send": true, "priority_support": true, "white_label": true, "api_access": true}'::jsonb);

-- ============================================================
-- HELPER FUNCTIONS (in private schema for security)
-- ============================================================

-- Function to get current user's ID from JWT
create or replace function private.get_current_user_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;

-- Function to check if user owns a business
create or replace function private.user_owns_business(business_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.businesses
    where id = business_uuid
      and user_id = private.get_current_user_id()
  )
$$;

-- Function to get user's businesses
create or replace function private.get_user_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id
  from public.businesses
  where user_id = private.get_current_user_id()
$$;

-- Function to check subscription feature access
create or replace function private.business_has_feature(business_uuid uuid, feature_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select sl.features ->> feature_name = 'true'
      from public.businesses b
      join public.subscription_limits sl on sl.plan = b.subscription
      where b.id = business_uuid
    ),
    false
  )
$$;

-- Function to check if business can send more requests
create or replace function private.business_can_send_request(business_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.businesses b
    join public.subscription_limits sl on sl.plan = b.subscription
    where b.id = business_uuid
      and (sl.requests_per_month = -1 or b.requests_this_month < sl.requests_per_month)
  )
$$;

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers to all relevant tables
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_businesses_updated_at
  before update on public.businesses
  for each row
  execute function public.handle_updated_at();

create trigger handle_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();

create trigger handle_contacts_updated_at
  before update on public.contacts
  for each row
  execute function public.handle_updated_at();

create trigger handle_review_requests_updated_at
  before update on public.review_requests
  for each row
  execute function public.handle_updated_at();

create trigger handle_templates_updated_at
  before update on public.templates
  for each row
  execute function public.handle_updated_at();

create trigger handle_qr_codes_updated_at
  before update on public.qr_codes
  for each row
  execute function public.handle_updated_at();

create trigger handle_api_keys_updated_at
  before update on public.api_keys
  for each row
  execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
alter table public.businesses enable row level security;
alter table public.reviews enable row level security;
alter table public.contacts enable row level security;
alter table public.review_requests enable row level security;
alter table public.templates enable row level security;
alter table public.qr_codes enable row level security;
alter table public.notifications enable row level security;
alter table public.analytics_events enable row level security;
alter table public.api_keys enable row level security;
alter table public.audit_logs enable row level security;
alter table public.subscription_limits enable row level security;

-- Subscription Limits: Read-only for all authenticated users
create policy "Subscription limits are viewable by authenticated users"
  on public.subscription_limits for select
  to authenticated
  using (true);

-- Profiles: Users can view and update their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Businesses: Full CRUD for owner
create policy "Users can view their own businesses"
  on public.businesses for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can create businesses"
  on public.businesses for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can update their own businesses"
  on public.businesses for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own businesses"
  on public.businesses for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Reviews: Access based on business ownership
create policy "Users can view reviews for their businesses"
  on public.reviews for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert reviews for their businesses"
  on public.reviews for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update reviews for their businesses"
  on public.reviews for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete reviews for their businesses"
  on public.reviews for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- Contacts: Access based on business ownership
create policy "Users can view contacts for their businesses"
  on public.contacts for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert contacts for their businesses"
  on public.contacts for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update contacts for their businesses"
  on public.contacts for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete contacts for their businesses"
  on public.contacts for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- Review Requests: Access based on business ownership
create policy "Users can view review requests for their businesses"
  on public.review_requests for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert review requests for their businesses"
  on public.review_requests for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update review requests for their businesses"
  on public.review_requests for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete review requests for their businesses"
  on public.review_requests for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- Templates: Access based on business ownership
create policy "Users can view templates for their businesses"
  on public.templates for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert templates for their businesses"
  on public.templates for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update templates for their businesses"
  on public.templates for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete templates for their businesses"
  on public.templates for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- QR Codes: Access based on business ownership
create policy "Users can view QR codes for their businesses"
  on public.qr_codes for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert QR codes for their businesses"
  on public.qr_codes for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update QR codes for their businesses"
  on public.qr_codes for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete QR codes for their businesses"
  on public.qr_codes for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- Notifications: Users can only access their own notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can update their own notifications"
  on public.notifications for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users can delete their own notifications"
  on public.notifications for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Analytics Events: Access based on business ownership
create policy "Users can view analytics for their businesses"
  on public.analytics_events for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- API Keys: Access based on business ownership
create policy "Users can view API keys for their businesses"
  on public.api_keys for select
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

create policy "Users can insert API keys for their businesses"
  on public.api_keys for insert
  to authenticated
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can update API keys for their businesses"
  on public.api_keys for update
  to authenticated
  using (business_id in (select private.get_user_business_ids()))
  with check (business_id in (select private.get_user_business_ids()));

create policy "Users can delete API keys for their businesses"
  on public.api_keys for delete
  to authenticated
  using (business_id in (select private.get_user_business_ids()));

-- Audit Logs: Users can view logs for their businesses (read-only)
create policy "Users can view audit logs for their businesses"
  on public.audit_logs for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or business_id in (select private.get_user_business_ids())
  );

-- ============================================================
-- PUBLIC FUNCTIONS (for API usage)
-- ============================================================

-- Function to create a new business (with validation)
create or replace function public.create_business(
  p_name text,
  p_slug text default null,
  p_address text default null,
  p_phone text default null,
  p_email text default null
)
returns public.businesses
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slug text;
  v_business public.businesses;
begin
  -- Generate slug if not provided
  v_slug := coalesce(p_slug, lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g')));

  -- Ensure slug uniqueness by appending random suffix if needed
  while exists (select 1 from public.businesses where slug = v_slug) loop
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
  end loop;

  insert into public.businesses (user_id, name, slug, address, phone, email)
  values ((select auth.uid()), p_name, v_slug, p_address, p_phone, p_email)
  returning * into v_business;

  return v_business;
end;
$$;

-- Function to increment request count (with limit check)
create or replace function public.increment_request_count(p_business_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_can_send boolean;
begin
  -- Check if user owns business
  if not private.user_owns_business(p_business_id) then
    raise exception 'Access denied';
  end if;

  -- Check if can send
  v_can_send := private.business_can_send_request(p_business_id);

  if v_can_send then
    update public.businesses
    set requests_this_month = requests_this_month + 1
    where id = p_business_id;
  end if;

  return v_can_send;
end;
$$;

-- Function to get business stats
create or replace function public.get_business_stats(p_business_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_stats jsonb;
begin
  -- Check if user owns business
  if not private.user_owns_business(p_business_id) then
    raise exception 'Access denied';
  end if;

  select jsonb_build_object(
    'total_reviews', b.total_reviews,
    'avg_rating', b.avg_rating,
    'reviews_this_month', b.reviews_this_month,
    'response_rate', b.response_rate,
    'requests_this_month', b.requests_this_month,
    'requests_limit', b.requests_limit,
    'subscription', b.subscription,
    'unread_reviews', (
      select count(*)
      from public.reviews r
      where r.business_id = p_business_id and r.is_read = false
    ),
    'pending_responses', (
      select count(*)
      from public.reviews r
      where r.business_id = p_business_id and r.is_responded = false
    ),
    'rating_distribution', (
      select jsonb_object_agg(rating::text, cnt)
      from (
        select rating, count(*) as cnt
        from public.reviews r
        where r.business_id = p_business_id
        group by rating
      ) rd
    )
  )
  into v_stats
  from public.businesses b
  where b.id = p_business_id;

  return coalesce(v_stats, '{}'::jsonb);
end;
$$;

-- Function to update business stats (called by triggers or cron)
create or replace function public.update_business_stats(p_business_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.businesses b
  set
    total_reviews = (
      select count(*) from public.reviews r where r.business_id = b.id
    ),
    avg_rating = (
      select round(avg(rating)::numeric, 1) from public.reviews r where r.business_id = b.id
    ),
    reviews_this_month = (
      select count(*) from public.reviews r
      where r.business_id = b.id
        and r.published_at >= date_trunc('month', now())
    ),
    response_rate = (
      select round(
        (count(*) filter (where is_responded))::numeric /
        nullif(count(*)::numeric, 0) * 100,
        2
      )
      from public.reviews r where r.business_id = b.id
    )
  where b.id = p_business_id;
end;
$$;

-- ============================================================
-- GRANTS
-- ============================================================

-- Grant usage on types to authenticated users
grant usage on schema public to authenticated;
grant usage on schema public to anon;

-- Grant execute on public functions
grant execute on function public.create_business to authenticated;
grant execute on function public.increment_request_count to authenticated;
grant execute on function public.get_business_stats to authenticated;
grant execute on function public.update_business_stats to authenticated;
grant execute on function public.handle_updated_at to authenticated;

-- ============================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================

comment on table public.businesses is 'Core business accounts for ReviewBoost users';
comment on table public.reviews is 'Reviews synced from Google Business Profile';
comment on table public.contacts is 'Customer contact list for sending review requests';
comment on table public.review_requests is 'Track all review request sends and their status';
comment on table public.templates is 'Message templates for review requests and responses';
comment on table public.qr_codes is 'Generated QR codes for physical display';
comment on table public.notifications is 'In-app notifications for users';
comment on table public.analytics_events is 'Aggregated analytics events for tracking';
comment on table public.api_keys is 'API keys for external integrations';
comment on table public.audit_logs is 'Audit trail for important changes';
comment on table public.subscription_limits is 'Plan limits and features configuration';

comment on function private.get_current_user_id is 'Get current user ID from JWT claims';
comment on function private.user_owns_business is 'Check if current user owns a specific business';
comment on function private.get_user_business_ids is 'Get all business IDs owned by current user';
comment on function private.business_has_feature is 'Check if business has access to a specific feature';
comment on function private.business_can_send_request is 'Check if business can send more review requests';
comment on function public.create_business is 'Create a new business with auto-generated slug';
comment on function public.increment_request_count is 'Increment request count with limit check';
comment on function public.get_business_stats is 'Get comprehensive stats for a business';
comment on function public.update_business_stats is 'Update cached stats for a business';
