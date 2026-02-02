"use client";

import { GoogleIntegrationCard } from "@/components/dashboard/google-integration-card";
import { ThemeSelector } from "@/components/theme-selector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	Bell,
	Building2,
	CreditCard,
	Key,
	Link2,
	LogOut,
	Shield,
	User,
} from "lucide-react";
import { useState } from "react";

type SettingsTab =
	| "profile"
	| "business"
	| "notifications"
	| "integrations"
	| "billing"
	| "security";

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
	{ key: "profile", label: "Profile", icon: User },
	{ key: "business", label: "Business", icon: Building2 },
	{ key: "notifications", label: "Notifications", icon: Bell },
	{ key: "integrations", label: "Integrations", icon: Link2 },
	{ key: "billing", label: "Billing", icon: CreditCard },
	{ key: "security", label: "Security", icon: Shield },
];

function ProfileSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your personal information and profile picture.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center gap-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src="" />
							<AvatarFallback className="text-2xl">JD</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<Button variant="outline" size="sm">
								Change Photo
							</Button>
							<p className="text-xs text-muted-foreground">
								JPG, PNG or GIF. Max 2MB.
							</p>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input id="firstName" defaultValue="John" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input id="lastName" defaultValue="Doe" />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" defaultValue="john@example.com" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
					</div>

					<Button>Save Changes</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
					<CardDescription>
						Customize how ReviewBoost looks for you.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ThemeSelector />
				</CardContent>
			</Card>
		</div>
	);
}

function BusinessSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Business Information</CardTitle>
					<CardDescription>
						Update your business details and contact information.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="businessName">Business Name</Label>
						<Input id="businessName" defaultValue="Acme Restaurant" />
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Input
							id="address"
							defaultValue="123 Main St, Miami, FL 33101"
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="businessPhone">Phone</Label>
							<Input id="businessPhone" defaultValue="+1 305 555 0100" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="website">Website</Label>
							<Input id="website" defaultValue="https://acme.com" />
						</div>
					</div>

					<Button>Save Changes</Button>
				</CardContent>
			</Card>
		</div>
	);
}

function NotificationSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Email Notifications</CardTitle>
					<CardDescription>
						Choose what emails you want to receive.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[
						{
							title: "New Reviews",
							description: "Get notified when you receive a new review",
							enabled: true,
						},
						{
							title: "Negative Reviews",
							description:
								"Urgent alerts for 1-2 star reviews",
							enabled: true,
						},
						{
							title: "Weekly Summary",
							description: "Receive a weekly report of your reviews",
							enabled: false,
						},
						{
							title: "Request Updates",
							description:
								"Get notified when a review request is opened or completed",
							enabled: true,
						},
					].map((item) => (
						<div
							key={item.title}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div>
								<p className="font-medium">{item.title}</p>
								<p className="text-sm text-muted-foreground">
									{item.description}
								</p>
							</div>
							<Button
								variant={item.enabled ? "default" : "outline"}
								size="sm"
							>
								{item.enabled ? "Enabled" : "Disabled"}
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

function IntegrationSettings() {
	const upcomingIntegrations = [
		{
			name: "Yelp",
			description: "Sync reviews from Yelp",
			icon: "🔴",
		},
		{
			name: "Facebook",
			description: "Sync reviews from Facebook",
			icon: "🔵",
		},
		{
			name: "Twilio",
			description: "Send SMS review requests",
			icon: "📱",
		},
	];

	return (
		<div className="space-y-6">
			<GoogleIntegrationCard />

			<Card>
				<CardHeader>
					<CardTitle>Coming Soon</CardTitle>
					<CardDescription>
						These integrations will be available in future updates.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{upcomingIntegrations.map((integration) => (
						<div
							key={integration.name}
							className="flex items-center justify-between rounded-lg border p-4 opacity-60"
						>
							<div className="flex items-center gap-4">
								<span className="text-2xl">{integration.icon}</span>
								<div>
									<p className="font-medium">{integration.name}</p>
									<p className="text-sm text-muted-foreground">
										{integration.description}
									</p>
								</div>
							</div>
							<Badge variant="outline">Coming Soon</Badge>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

function BillingSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Current Plan</CardTitle>
					<CardDescription>
						Manage your subscription and billing information.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-6">
						<div>
							<div className="flex items-center gap-2">
								<h3 className="text-xl font-bold">Starter Plan</h3>
								<Badge>Current</Badge>
							</div>
							<p className="mt-1 text-muted-foreground">
								100 review requests per month
							</p>
							<p className="mt-2 text-2xl font-bold">
								$19<span className="text-sm font-normal">/month</span>
							</p>
						</div>
						<Button variant="outline">Change Plan</Button>
					</div>

					<div className="mt-6 space-y-4">
						<h4 className="font-semibold">Usage This Month</h4>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Review Requests</span>
								<span>45 / 100</span>
							</div>
							<div className="h-2 rounded-full bg-secondary">
								<div
									className="h-2 rounded-full bg-primary"
									style={{ width: "45%" }}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Payment Method</CardTitle>
					<CardDescription>Update your payment information.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between rounded-lg border p-4">
						<div className="flex items-center gap-4">
							<div className="flex h-10 w-16 items-center justify-center rounded bg-slate-800 text-xs font-bold text-white">
								VISA
							</div>
							<div>
								<p className="font-medium">•••• •••• •••• 4242</p>
								<p className="text-sm text-muted-foreground">Expires 12/26</p>
							</div>
						</div>
						<Button variant="outline" size="sm">
							Update
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function SecuritySettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>
						Change your password to keep your account secure.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="currentPassword">Current Password</Label>
						<Input id="currentPassword" type="password" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="newPassword">New Password</Label>
						<Input id="newPassword" type="password" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm New Password</Label>
						<Input id="confirmPassword" type="password" />
					</div>
					<Button>Update Password</Button>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Two-Factor Authentication</CardTitle>
					<CardDescription>
						Add an extra layer of security to your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
								<Key className="h-6 w-6" />
							</div>
							<div>
								<p className="font-medium">Authenticator App</p>
								<p className="text-sm text-muted-foreground">
									Not configured
								</p>
							</div>
						</div>
						<Button variant="outline">Set Up</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">Danger Zone</CardTitle>
					<CardDescription>
						Irreversible actions for your account.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
						<div>
							<p className="font-medium">Sign out of all devices</p>
							<p className="text-sm text-muted-foreground">
								This will sign you out everywhere.
							</p>
						</div>
						<Button variant="outline" size="sm">
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out All
						</Button>
					</div>
					<div className="flex items-center justify-between rounded-lg border border-destructive/30 p-4">
						<div>
							<p className="font-medium text-destructive">Delete Account</p>
							<p className="text-sm text-muted-foreground">
								Permanently delete your account and all data.
							</p>
						</div>
						<Button variant="destructive" size="sm">
							Delete Account
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

	const renderContent = () => {
		switch (activeTab) {
			case "profile":
				return <ProfileSettings />;
			case "business":
				return <BusinessSettings />;
			case "notifications":
				return <NotificationSettings />;
			case "integrations":
				return <IntegrationSettings />;
			case "billing":
				return <BillingSettings />;
			case "security":
				return <SecuritySettings />;
			default:
				return <ProfileSettings />;
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
					Settings
				</h1>
				<p className="text-muted-foreground">
					Manage your account and application preferences.
				</p>
			</div>

			<div className="flex flex-col gap-6 lg:flex-row">
				<Card className="h-fit lg:w-64">
					<CardContent className="p-2">
						<nav className="space-y-1">
							{tabs.map((tab) => (
								<button
									key={tab.key}
									type="button"
									onClick={() => setActiveTab(tab.key)}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										activeTab === tab.key
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-accent hover:text-foreground"
									)}
								>
									<tab.icon className="h-4 w-4" />
									{tab.label}
								</button>
							))}
						</nav>
					</CardContent>
				</Card>

				<div className="flex-1">{renderContent()}</div>
			</div>
		</div>
	);
}
