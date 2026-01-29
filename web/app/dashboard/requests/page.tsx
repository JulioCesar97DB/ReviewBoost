"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	Eye,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Plus,
	RefreshCw,
	Search,
	Send,
	XCircle,
} from "lucide-react";
import { useState } from "react";

interface ReviewRequest {
	id: string;
	contactName: string;
	contactEmail: string;
	contactPhone?: string;
	channel: "email" | "sms" | "whatsapp";
	sentAt: string;
	status: "pending" | "opened" | "completed" | "expired";
}

const mockRequests: ReviewRequest[] = [
	{
		id: "1",
		contactName: "Alice Johnson",
		contactEmail: "alice@example.com",
		contactPhone: "+1 234 567 8901",
		channel: "email",
		sentAt: "2 hours ago",
		status: "pending",
	},
	{
		id: "2",
		contactName: "Bob Smith",
		contactEmail: "bob@example.com",
		contactPhone: "+1 234 567 8902",
		channel: "sms",
		sentAt: "5 hours ago",
		status: "opened",
	},
	{
		id: "3",
		contactName: "Carol Williams",
		contactEmail: "carol@example.com",
		channel: "email",
		sentAt: "1 day ago",
		status: "completed",
	},
	{
		id: "4",
		contactName: "Dan Brown",
		contactEmail: "dan@example.com",
		contactPhone: "+1 234 567 8904",
		channel: "whatsapp",
		sentAt: "3 days ago",
		status: "expired",
	},
	{
		id: "5",
		contactName: "Eva Martinez",
		contactEmail: "eva@example.com",
		channel: "email",
		sentAt: "4 hours ago",
		status: "pending",
	},
	{
		id: "6",
		contactName: "Frank Lee",
		contactEmail: "frank@example.com",
		contactPhone: "+1 234 567 8906",
		channel: "sms",
		sentAt: "6 hours ago",
		status: "opened",
	},
	{
		id: "7",
		contactName: "Grace Kim",
		contactEmail: "grace@example.com",
		channel: "email",
		sentAt: "2 days ago",
		status: "completed",
	},
];

type FilterType = "all" | "pending" | "opened" | "completed" | "expired";

function getStatusConfig(status: string) {
	switch (status) {
		case "pending":
			return {
				label: "Pending",
				icon: Clock,
				className:
					"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
			};
		case "opened":
			return {
				label: "Opened",
				icon: Eye,
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
			};
		case "completed":
			return {
				label: "Completed",
				icon: CheckCircle2,
				className:
					"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
			};
		case "expired":
			return {
				label: "Expired",
				icon: XCircle,
				className:
					"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
			};
		default:
			return {
				label: status,
				icon: Clock,
				className: "bg-gray-100 text-gray-700",
			};
	}
}

function getChannelConfig(channel: string) {
	switch (channel) {
		case "email":
			return { label: "Email", icon: Mail };
		case "sms":
			return { label: "SMS", icon: MessageSquare };
		case "whatsapp":
			return { label: "WhatsApp", icon: MessageSquare };
		default:
			return { label: channel, icon: Send };
	}
}

function RequestCard({ request }: { request: ReviewRequest }) {
	const statusConfig = getStatusConfig(request.status);
	const channelConfig = getChannelConfig(request.channel);
	const StatusIcon = statusConfig.icon;
	const ChannelIcon = channelConfig.icon;

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
							{request.contactName.charAt(0)}
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold">{request.contactName}</span>
								<Badge variant="outline" className="gap-1">
									<ChannelIcon className="h-3 w-3" />
									{channelConfig.label}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								{request.contactEmail}
							</p>
							{request.contactPhone && (
								<p className="text-sm text-muted-foreground">
									{request.contactPhone}
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="text-right">
							<Badge variant="secondary" className={statusConfig.className}>
								<StatusIcon className="mr-1 h-3 w-3" />
								{statusConfig.label}
							</Badge>
							<p className="mt-1 text-xs text-muted-foreground">
								{request.sentAt}
							</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>View details</DropdownMenuItem>
								<DropdownMenuItem>Resend request</DropdownMenuItem>
								<DropdownMenuItem className="text-destructive">
									Cancel request
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				{request.status === "pending" && (
					<div className="mt-4 flex gap-2">
						<Button size="sm" variant="outline">
							<RefreshCw className="mr-2 h-4 w-4" />
							Resend
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function RequestsPage() {
	const [filter, setFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredRequests = mockRequests.filter((request) => {
		const matchesFilter = filter === "all" || request.status === filter;

		const matchesSearch =
			request.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			request.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	const filters: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "All", count: mockRequests.length },
		{
			key: "pending",
			label: "Pending",
			count: mockRequests.filter((r) => r.status === "pending").length,
		},
		{
			key: "opened",
			label: "Opened",
			count: mockRequests.filter((r) => r.status === "opened").length,
		},
		{
			key: "completed",
			label: "Completed",
			count: mockRequests.filter((r) => r.status === "completed").length,
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Review Requests
					</h1>
					<p className="text-muted-foreground">
						Send and track review requests to your customers.
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New Request
				</Button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Send className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Sent</p>
								<p className="text-2xl font-bold">{mockRequests.length}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
								<Clock className="h-6 w-6 text-amber-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Pending</p>
								<p className="text-2xl font-bold">
									{mockRequests.filter((r) => r.status === "pending").length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
								<Eye className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Opened</p>
								<p className="text-2xl font-bold">
									{mockRequests.filter((r) => r.status === "opened").length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
								<CheckCircle2 className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Completed</p>
								<p className="text-2xl font-bold">
									{mockRequests.filter((r) => r.status === "completed").length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>All Requests</CardTitle>
							<CardDescription>
								{filteredRequests.length} requests found
							</CardDescription>
						</div>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search requests..."
								className="pl-9 sm:w-64"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-wrap gap-2">
						{filters.map((f) => (
							<Button
								key={f.key}
								variant={filter === f.key ? "default" : "outline"}
								size="sm"
								onClick={() => setFilter(f.key)}
							>
								{f.label}
								<Badge
									variant="secondary"
									className={cn(
										"ml-2",
										filter === f.key
											? "bg-primary-foreground/20 text-primary-foreground"
											: ""
									)}
								>
									{f.count}
								</Badge>
							</Button>
						))}
					</div>

					<div className="space-y-4">
						{filteredRequests.length > 0 ? (
							filteredRequests.map((request) => (
								<RequestCard key={request.id} request={request} />
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Send className="mb-4 h-12 w-12 text-muted-foreground" />
								<h3 className="text-lg font-semibold">No requests found</h3>
								<p className="text-muted-foreground">
									Try adjusting your search or filter criteria.
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
