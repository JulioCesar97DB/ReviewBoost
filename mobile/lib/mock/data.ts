import type { GoogleAccount, GoogleLocation, GoogleReview } from '../google/business-profile';

// ============================================================================
// BUSINESS DATA
// ============================================================================

export const MOCK_BUSINESS = {
	id: 'mock-business-123',
	name: 'CodeCraft Studio',
	google_place_id: 'ChIJmock123456789',
	google_account_id: 'accounts/mock-account-123',
	google_location_id: 'locations/mock-location-123',
	google_connected_at: new Date().toISOString(),
	google_review_url: 'https://search.google.com/local/writereview?placeid=ChIJmock123456789',
};

export const MOCK_ACCOUNT: GoogleAccount = {
	name: 'accounts/mock-account-123',
	accountName: 'CodeCraft Studio',
	type: 'PERSONAL',
	verificationState: 'VERIFIED',
	vettedState: 'VETTED',
};

export const MOCK_LOCATION: GoogleLocation = {
	name: 'accounts/mock-account-123/locations/mock-location-123',
	title: 'CodeCraft Studio',
	storefrontAddress: {
		addressLines: ['123 Developer Lane'],
		locality: 'San Francisco',
		administrativeArea: 'CA',
		postalCode: '94105',
		regionCode: 'US',
	},
	phoneNumbers: {
		primaryPhone: '+1 (555) 123-4567',
	},
	websiteUri: 'https://codecraft.studio',
	metadata: {
		placeId: 'ChIJmock123456789',
	},
};

// ============================================================================
// CONTACTS DATA
// ============================================================================

export interface MockContact {
	id: string;
	name: string;
	email: string;
	phone?: string;
	created_at: string;
	last_contacted_at?: string;
	review_count: number;
	tags?: string[];
}

export const MOCK_CONTACTS: MockContact[] = [
	{
		id: 'contact-1',
		name: 'Alice Johnson',
		email: 'alice.johnson@email.com',
		phone: '+1 (555) 234-5678',
		created_at: '2024-01-15T10:00:00Z',
		last_contacted_at: '2024-01-20T14:30:00Z',
		review_count: 2,
		tags: ['vip', 'repeat-customer'],
	},
	{
		id: 'contact-2',
		name: 'Bob Smith',
		email: 'bob.smith@company.com',
		phone: '+1 (555) 345-6789',
		created_at: '2024-01-10T09:00:00Z',
		last_contacted_at: '2024-01-18T11:00:00Z',
		review_count: 1,
	},
	{
		id: 'contact-3',
		name: 'Carol Williams',
		email: 'carol.w@gmail.com',
		created_at: '2024-01-08T16:00:00Z',
		review_count: 0,
	},
	{
		id: 'contact-4',
		name: 'Dan Brown',
		email: 'dan.brown@outlook.com',
		phone: '+1 (555) 456-7890',
		created_at: '2024-01-05T12:00:00Z',
		last_contacted_at: '2024-01-25T09:15:00Z',
		review_count: 3,
		tags: ['vip'],
	},
	{
		id: 'contact-5',
		name: 'Eva Martinez',
		email: 'eva.martinez@business.com',
		phone: '+1 (555) 567-8901',
		created_at: '2024-01-03T14:00:00Z',
		review_count: 1,
	},
	{
		id: 'contact-6',
		name: 'Frank Lee',
		email: 'frank.lee@email.com',
		created_at: '2024-01-02T10:00:00Z',
		last_contacted_at: '2024-01-22T16:45:00Z',
		review_count: 0,
	},
	{
		id: 'contact-7',
		name: 'Grace Kim',
		email: 'grace.kim@startup.io',
		phone: '+1 (555) 678-9012',
		created_at: '2024-01-01T08:00:00Z',
		review_count: 2,
		tags: ['repeat-customer'],
	},
];

// ============================================================================
// REVIEW REQUESTS DATA
// ============================================================================

export interface MockReviewRequest {
	id: string;
	contact_id: string;
	contact_name: string;
	contact_email: string;
	status: 'pending' | 'sent' | 'opened' | 'clicked' | 'reviewed' | 'expired';
	channel: 'email' | 'sms' | 'whatsapp';
	sent_at: string;
	opened_at?: string;
	clicked_at?: string;
	reviewed_at?: string;
	message?: string;
}

export const MOCK_REVIEW_REQUESTS: MockReviewRequest[] = [
	{
		id: 'request-1',
		contact_id: 'contact-1',
		contact_name: 'Alice Johnson',
		contact_email: 'alice.johnson@email.com',
		status: 'reviewed',
		channel: 'email',
		sent_at: '2024-01-20T14:30:00Z',
		opened_at: '2024-01-20T15:00:00Z',
		clicked_at: '2024-01-20T15:05:00Z',
		reviewed_at: '2024-01-20T15:10:00Z',
	},
	{
		id: 'request-2',
		contact_id: 'contact-2',
		contact_name: 'Bob Smith',
		contact_email: 'bob.smith@company.com',
		status: 'clicked',
		channel: 'email',
		sent_at: '2024-01-18T11:00:00Z',
		opened_at: '2024-01-18T14:00:00Z',
		clicked_at: '2024-01-18T14:30:00Z',
	},
	{
		id: 'request-3',
		contact_id: 'contact-3',
		contact_name: 'Carol Williams',
		contact_email: 'carol.w@gmail.com',
		status: 'opened',
		channel: 'email',
		sent_at: '2024-01-25T10:00:00Z',
		opened_at: '2024-01-25T12:00:00Z',
	},
	{
		id: 'request-4',
		contact_id: 'contact-4',
		contact_name: 'Dan Brown',
		contact_email: 'dan.brown@outlook.com',
		status: 'sent',
		channel: 'sms',
		sent_at: '2024-01-25T09:15:00Z',
	},
	{
		id: 'request-5',
		contact_id: 'contact-6',
		contact_name: 'Frank Lee',
		contact_email: 'frank.lee@email.com',
		status: 'expired',
		channel: 'email',
		sent_at: '2024-01-10T16:45:00Z',
		opened_at: '2024-01-10T18:00:00Z',
	},
	{
		id: 'request-6',
		contact_id: 'contact-5',
		contact_name: 'Eva Martinez',
		contact_email: 'eva.martinez@business.com',
		status: 'pending',
		channel: 'email',
		sent_at: '2024-01-26T08:00:00Z',
	},
];

// ============================================================================
// QR CODES DATA
// ============================================================================

export interface MockQRCode {
	id: string;
	name: string;
	url: string;
	scans: number;
	created_at: string;
	last_scanned_at?: string;
	style: {
		foreground: string;
		background: string;
		logo?: boolean;
	};
}

export const MOCK_QR_CODES: MockQRCode[] = [
	{
		id: 'qr-1',
		name: 'Front Desk QR',
		url: 'https://search.google.com/local/writereview?placeid=ChIJmock123456789',
		scans: 47,
		created_at: '2024-01-05T10:00:00Z',
		last_scanned_at: '2024-01-26T09:30:00Z',
		style: { foreground: '#000000', background: '#FFFFFF', logo: true },
	},
	{
		id: 'qr-2',
		name: 'Business Card QR',
		url: 'https://search.google.com/local/writereview?placeid=ChIJmock123456789',
		scans: 23,
		created_at: '2024-01-10T14:00:00Z',
		last_scanned_at: '2024-01-25T16:00:00Z',
		style: { foreground: '#F97316', background: '#FFFFFF', logo: true },
	},
	{
		id: 'qr-3',
		name: 'Receipt QR',
		url: 'https://search.google.com/local/writereview?placeid=ChIJmock123456789',
		scans: 12,
		created_at: '2024-01-15T09:00:00Z',
		style: { foreground: '#000000', background: '#FFFFFF', logo: false },
	},
];

// ============================================================================
// NOTIFICATIONS DATA
// ============================================================================

export interface MockNotification {
	id: string;
	type: 'new_review' | 'review_request_opened' | 'review_request_clicked' | 'negative_review' | 'weekly_summary';
	title: string;
	message: string;
	read: boolean;
	created_at: string;
	data?: Record<string, unknown>;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
	{
		id: 'notif-1',
		type: 'new_review',
		title: 'New 5-star review!',
		message: 'Sarah Mitchell left a 5-star review on Google.',
		read: false,
		created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		data: { reviewId: 'review-0', rating: 5 },
	},
	{
		id: 'notif-2',
		type: 'review_request_clicked',
		title: 'Review link clicked',
		message: 'Bob Smith clicked your review request link.',
		read: false,
		created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		data: { requestId: 'request-2' },
	},
	{
		id: 'notif-3',
		type: 'negative_review',
		title: '⚠️ Negative review received',
		message: 'A 2-star review needs your attention.',
		read: true,
		created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		data: { reviewId: 'review-5', rating: 2 },
	},
	{
		id: 'notif-4',
		type: 'weekly_summary',
		title: 'Weekly Summary',
		message: 'You received 8 new reviews this week. Average rating: 4.6 ⭐',
		read: true,
		created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
	},
];

// ============================================================================
// AI RESPONSE TEMPLATES
// ============================================================================

export const AI_RESPONSE_TEMPLATES = {
	positive: [
		"Thank you so much for your wonderful feedback, {name}! We're thrilled to hear about your positive experience with our team. Your kind words mean the world to us, and we look forward to working with you again!",
		"We truly appreciate you taking the time to share your experience, {name}! It's clients like you who make our work so rewarding. Thank you for your trust in CodeCraft Studio!",
		"What a fantastic review, {name}! We're so glad we could exceed your expectations. Your satisfaction is our top priority, and we can't wait to collaborate with you on future projects!",
	],
	neutral: [
		"Thank you for your feedback, {name}. We appreciate you sharing your experience with us. We're always looking to improve, and your input helps us do just that. Please don't hesitate to reach out if there's anything we can do better.",
		"We appreciate your honest review, {name}. While we're glad the end result met your needs, we acknowledge there's room for improvement in our process. We're committed to doing better and hope to earn a higher rating next time.",
	],
	negative: [
		"Thank you for bringing this to our attention, {name}. We sincerely apologize for falling short of your expectations. Your feedback is valuable, and we'd love the opportunity to make things right. Please contact us directly at support@codecraft.studio so we can address your concerns.",
		"We're truly sorry to hear about your experience, {name}. This isn't the standard we hold ourselves to. We take your feedback seriously and would appreciate the chance to discuss this further. Please reach out to us directly so we can resolve this issue.",
	],
};

// ============================================================================
// REVIEWS DATA
// ============================================================================

const reviewerNames = [
	'Sarah Mitchell',
	'John Davidson',
	'Emily Chen',
	'Michael Roberts',
	'Jessica Williams',
	'David Thompson',
	'Amanda Garcia',
	'Christopher Lee',
	'Rachel Brown',
	'Daniel Martinez',
	'Laura Johnson',
	'James Wilson',
	'Michelle Anderson',
	'Robert Taylor',
	'Jennifer Moore',
];

const positiveComments = [
	'Excellent work on our website! The team was professional and delivered exactly what we needed. Highly recommended!',
	'Outstanding service! They transformed our outdated site into a modern, responsive masterpiece. Very happy with the results.',
	'Best web development agency we\'ve worked with. Clear communication, on-time delivery, and beautiful design.',
	'They built our e-commerce platform from scratch and it\'s been running flawlessly. Great attention to detail!',
	'Fantastic experience working with CodeCraft Studio. They understood our vision and executed it perfectly.',
	'Professional team that goes above and beyond. Our new app has received amazing feedback from users.',
	'Quick turnaround and excellent quality. Will definitely use them for future projects.',
	'They made the entire process so easy. From design to deployment, everything was handled professionally.',
	'Our website traffic increased by 200% after the redesign. Couldn\'t be happier!',
	'The team is incredibly talented and responsive. They fixed issues immediately and added great suggestions.',
];

const neutralComments = [
	'Good work overall. The project took a bit longer than expected but the end result was satisfactory.',
	'Decent service. The website works well, though there were some communication delays during the project.',
	'They delivered what was promised. Nothing extraordinary but solid work.',
	'The site looks good. Had some minor issues that needed fixing after launch but they resolved them.',
];

const negativeComments = [
	'Project went over timeline. Final product is okay but expected better communication throughout.',
	'Had some misunderstandings about requirements. They fixed most issues but it took extra time.',
];

function getRandomDate(daysAgo: number): string {
	const date = new Date();
	date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
	return date.toISOString();
}

function getRandomRating(): GoogleReview['starRating'] {
	const weights = { FIVE: 50, FOUR: 30, THREE: 12, TWO: 5, ONE: 3 };
	const total = Object.values(weights).reduce((a, b) => a + b, 0);
	let random = Math.random() * total;

	for (const [rating, weight] of Object.entries(weights)) {
		random -= weight;
		if (random <= 0) {
			return rating as GoogleReview['starRating'];
		}
	}
	return 'FIVE';
}

function getCommentForRating(rating: GoogleReview['starRating']): string {
	if (rating === 'FIVE' || rating === 'FOUR') {
		return positiveComments[Math.floor(Math.random() * positiveComments.length)];
	} else if (rating === 'THREE') {
		return neutralComments[Math.floor(Math.random() * neutralComments.length)];
	} else {
		return negativeComments[Math.floor(Math.random() * negativeComments.length)];
	}
}

function generateMockReview(index: number): GoogleReview {
	const rating = getRandomRating();
	const hasReply = rating === 'FIVE' || rating === 'FOUR' ? Math.random() > 0.3 : Math.random() > 0.7;
	const createTime = getRandomDate(180);

	return {
		name: `accounts/mock-account-123/locations/mock-location-123/reviews/review-${index}`,
		reviewId: `review-${index}`,
		reviewer: {
			displayName: reviewerNames[index % reviewerNames.length],
			profilePhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerNames[index % reviewerNames.length])}&background=random`,
		},
		starRating: rating,
		comment: getCommentForRating(rating),
		createTime,
		updateTime: createTime,
		reviewReply: hasReply
			? {
				comment: 'Thank you so much for your wonderful feedback! We truly appreciate you taking the time to share your experience. Looking forward to working with you again!',
				updateTime: new Date(new Date(createTime).getTime() + 86400000).toISOString(),
			}
			: undefined,
	};
}

export const MOCK_REVIEWS: GoogleReview[] = Array.from({ length: 25 }, (_, i) =>
	generateMockReview(i)
).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

export function calculateMockStats() {
	const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
	let totalRating = 0;

	const ratingMap: Record<string, number> = {
		ONE: 1,
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
	};

	for (const review of MOCK_REVIEWS) {
		const numRating = ratingMap[review.starRating];
		ratingCounts[numRating as keyof typeof ratingCounts]++;
		totalRating += numRating;
	}

	const avgRating = totalRating / MOCK_REVIEWS.length;
	const respondedCount = MOCK_REVIEWS.filter((r) => r.reviewReply).length;

	return {
		totalReviews: MOCK_REVIEWS.length,
		averageRating: Math.round(avgRating * 10) / 10,
		ratingDistribution: ratingCounts,
		respondedCount,
		responseRate: Math.round((respondedCount / MOCK_REVIEWS.length) * 100),
	};
}

export const MOCK_STATS = calculateMockStats();
