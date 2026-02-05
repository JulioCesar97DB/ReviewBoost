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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isMockMode } from "@/lib/config";
import {
	MockContactsService,
	MockReviewRequestsService,
	type MockContact,
	type MockReviewRequest,
} from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	Eye,
	Loader2,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Plus,
	RefreshCw,
	Search,
	Send,
	XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type FilterType = "all" | "pending" | "sent" | "opened" | "clicked" | "reviewed";

function getStatusConfig(status: string) {
	switch (status) {
		case "pending":
			return {
				label: "Pending",
				icon: Clock,
				className:
					"bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
			};
		case "sent":
			return {
				label: "Sent",
				icon: Send,
				className:
					"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
			};
		case "opened":
			return {
				label: "Opened",
				icon: Eye,
				className:
					"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
			};
		case "clicked":
			return {
				label: "Clicked",
				icon: MessageSquare,
				className:
					"bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
			};
		case "reviewed":
			return {
				label: "Reviewed",
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

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		if (diffHours === 0) {
			const diffMins = Math.floor(diffMs / (1000 * 60));
			return `${diffMins} minutes ago`;
		}
		return `${diffHours} hours ago`;
	} else if (diffDays === 1) {
		return "1 day ago";
	} else if (diffDays < 7) {
		return `${diffDays} days ago`;
	} else {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	}
}

interface RequestCardProps {
	request: MockReviewRequest;
	onResend: (id: string) => void;
	resending: boolean;
}

function RequestCard({ request, onResend, resending }: RequestCardProps) {
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
							{request.contact_name.charAt(0)}
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold">{request.contact_name}</span>
								<Badge variant="outline" className="gap-1">
									<ChannelIcon className="h-3 w-3" />
									{channelConfig.label}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								{request.contact_email}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="text-right">
							<Badge variant="secondary" className={statusConfig.className}>
								<StatusIcon className="mr-1 h-3 w-3" />
								{statusConfig.label}
							</Badge>
							<p className="mt-1 text-xs text-muted-foreground">
								{formatRelativeTime(request.sent_at)}
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
								<DropdownMenuItem onClick={() => onResend(request.id)}>
									Resend request
								</DropdownMenuItem>
								<DropdownMenuItem className="text-destructive">
									Cancel request
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				{(request.status === "pending" || request.status === "expired") && (
					<div className="mt-4 flex gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => onResend(request.id)}
							disabled={resending}
						>
							{resending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<RefreshCw className="mr-2 h-4 w-4" />
							)}
							Resend
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface NewRequestDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	contacts: MockContact[];
	onSubmit: (
		contactId: string,
		channel: "email" | "sms" | "whatsapp",
		message?: string
	) => Promise<void>;
}

function NewRequestDialog({
	open,
	onOpenChange,
	contacts,
	onSubmit,
}: NewRequestDialogProps) {
	const [contactId, setContactId] = useState("");
	const [channel, setChannel] = useState<"email" | "sms" | "whatsapp">("email");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!contactId) return;
		setLoading(true);
		try {
			await onSubmit(contactId, channel, message || undefined);
			setContactId("");
			setChannel("email");
			setMessage("");
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>New Review Request</DialogTitle>
					<DialogDescription>
						Send a review request to one of your contacts.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Contact</Label>
						<Select value={contactId} onValueChange={setContactId}>
							<SelectTrigger>
								<SelectValue placeholder="Select a contact" />
							</SelectTrigger>
							<SelectContent>
								{contacts.map((contact) => (
									<SelectItem key={contact.id} value={contact.id}>
										{contact.name} ({contact.email})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Channel</Label>
						<Select
							value={channel}
							onValueChange={(v) =>
								setChannel(v as "email" | "sms" | "whatsapp")
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="email">Email</SelectItem>
								<SelectItem value="sms">SMS</SelectItem>
								<SelectItem value="whatsapp">WhatsApp</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Custom Message (optional)</Label>
						<Textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Add a personal touch to your request..."
							rows={3}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading || !contactId}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Send Request
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function RequestsPage() {
	const [requests, setRequests] = useState<MockReviewRequest[]>([]);
	const [contacts, setContacts] = useState<MockContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [showNewDialog, setShowNewDialog] = useState(false);
	const [resendingId, setResendingId] = useState<string | null>(null);
	const [stats, setStats] = useState({
		total: 0,
		pending: 0,
		sent: 0,
		opened: 0,
		clicked: 0,
		reviewed: 0,
		conversionRate: 0,
	});

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const [requestsData, contactsData, statsData] = await Promise.all([
					MockReviewRequestsService.getAll(),
					MockContactsService.getAll(),
					MockReviewRequestsService.getStats(),
				]);
				setRequests(requestsData);
				setContacts(contactsData);
				setStats(statsData);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleResend = async (id: string) => {
		setResendingId(id);
		try {
			if (isMockMode()) {
				const updated = await MockReviewRequestsService.resend(id);
				setRequests((prev) =>
					prev.map((r) => (r.id === id ? updated : r))
				);
			}
		} finally {
			setResendingId(null);
		}
	};

	const handleNewRequest = async (
		contactId: string,
		channel: "email" | "sms" | "whatsapp",
		message?: string
	) => {
		if (isMockMode()) {
			const newRequest = await MockReviewRequestsService.send({
				contact_id: contactId,
				channel,
				message,
			});
			setRequests((prev) => [newRequest, ...prev]);
			const newStats = await MockReviewRequestsService.getStats();
			setStats(newStats);
		}
	};

	const filteredRequests = requests.filter((request) => {
		const matchesFilter = filter === "all" || request.status === filter;
		const matchesSearch =
			request.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			request.contact_email.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	const filters: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "All", count: requests.length },
		{
			key: "pending",
			label: "Pending",
			count: requests.filter((r) => r.status === "pending").length,
		},
		{
			key: "sent",
			label: "Sent",
			count: requests.filter((r) => r.status === "sent").length,
		},
		{
			key: "opened",
			label: "Opened",
			count: requests.filter((r) => r.status === "opened").length,
		},
		{
			key: "reviewed",
			label: "Reviewed",
			count: requests.filter((r) => r.status === "reviewed").length,
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
				<Button onClick={() => setShowNewDialog(true)}>
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
								<p className="text-2xl font-bold">{stats.total}</p>
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
								<p className="text-2xl font-bold">{stats.opened}</p>
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
								<p className="text-sm text-muted-foreground">Reviewed</p>
								<p className="text-2xl font-bold">{stats.reviewed}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
								<MessageSquare className="h-6 w-6 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Conversion</p>
								<p className="text-2xl font-bold">{stats.conversionRate}%</p>
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
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : filteredRequests.length > 0 ? (
							filteredRequests.map((request) => (
								<RequestCard
									key={request.id}
									request={request}
									onResend={handleResend}
									resending={resendingId === request.id}
								/>
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

			<NewRequestDialog
				open={showNewDialog}
				onOpenChange={setShowNewDialog}
				contacts={contacts}
				onSubmit={handleNewRequest}
			/>
		</div>
	);
}
