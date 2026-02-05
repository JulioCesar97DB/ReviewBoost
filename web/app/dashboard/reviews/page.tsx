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
import { Textarea } from "@/components/ui/textarea";
import { isMockMode } from "@/lib/config";
import type { GoogleReview } from "@/lib/google/business-profile";
import { MockAIResponseService, MockReviewsService } from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
	CheckCircle2,
	Clock,
	Filter,
	Loader2,
	MessageSquare,
	MoreHorizontal,
	Search,
	Sparkles,
	Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type FilterType = "all" | "responded" | "pending";

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={cn(
						"h-4 w-4",
						star <= rating
							? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
							: "text-muted-foreground"
					)}
				/>
			))}
		</div>
	);
}

function getNumericRating(rating: GoogleReview["starRating"]): number {
	const map: Record<string, number> = {
		ONE: 1,
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
	};
	return map[rating] || 0;
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
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	} else {
		const months = Math.floor(diffDays / 30);
		return `${months} month${months > 1 ? "s" : ""} ago`;
	}
}

interface ReviewCardProps {
	review: GoogleReview;
	onRespond: (review: GoogleReview) => void;
}

function ReviewCard({ review, onRespond }: ReviewCardProps) {
	const rating = getNumericRating(review.starRating);
	const hasResponse = !!review.reviewReply;

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						{review.reviewer.profilePhotoUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={review.reviewer.profilePhotoUrl}
								alt={review.reviewer.displayName}
								className="h-12 w-12 rounded-full object-cover"
							/>
						) : (
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
								{review.reviewer.displayName.charAt(0)}
							</div>
						)}
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold">
									{review.reviewer.displayName}
								</span>
								<Badge
									variant="secondary"
									className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
								>
									Google
								</Badge>
							</div>
							<div className="flex items-center gap-3">
								<StarRating rating={rating} />
								<span className="text-sm text-muted-foreground">
									{formatRelativeTime(review.createTime)}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{hasResponse ? (
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
							>
								<CheckCircle2 className="mr-1 h-3 w-3" />
								Responded
							</Badge>
						) : (
							<Badge
								variant="secondary"
								className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
							>
								<Clock className="mr-1 h-3 w-3" />
								Pending
							</Badge>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>View on Google</DropdownMenuItem>
								<DropdownMenuItem>Copy link</DropdownMenuItem>
								<DropdownMenuItem>Report</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<p className="mt-4 text-sm leading-relaxed text-foreground">
					{review.comment}
				</p>
				{hasResponse && review.reviewReply && (
					<div className="mt-4 rounded-lg border bg-muted/50 p-4">
						<p className="text-xs font-medium text-muted-foreground mb-2">
							Your response:
						</p>
						<p className="text-sm">{review.reviewReply.comment}</p>
					</div>
				)}
				{!hasResponse && (
					<div className="mt-4 flex gap-2">
						<Button size="sm" onClick={() => onRespond(review)}>
							<MessageSquare className="mr-2 h-4 w-4" />
							Respond
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => onRespond(review)}
						>
							<Sparkles className="mr-2 h-4 w-4" />
							AI Suggestion
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface ResponseDialogProps {
	review: GoogleReview | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (reviewId: string, response: string) => Promise<void>;
}

function ResponseDialog({
	review,
	open,
	onOpenChange,
	onSubmit,
}: ResponseDialogProps) {
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [generatingAI, setGeneratingAI] = useState(false);

	const handleGenerateAI = async () => {
		if (!review) return;
		setGeneratingAI(true);
		try {
			if (isMockMode()) {
				const suggestion = await MockAIResponseService.generateResponse(review);
				setResponse(suggestion);
			}
		} finally {
			setGeneratingAI(false);
		}
	};

	const handleSubmit = async () => {
		if (!review || !response.trim()) return;
		setLoading(true);
		try {
			await onSubmit(review.reviewId, response);
			setResponse("");
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!open) {
			setResponse("");
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Respond to Review</DialogTitle>
					<DialogDescription>
						Write a response to {review?.reviewer.displayName}&apos;s review.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					{review && (
						<div className="rounded-lg border bg-muted/50 p-4">
							<div className="flex items-center gap-2 mb-2">
								<StarRating rating={getNumericRating(review.starRating)} />
								<span className="text-sm font-medium">
									{review.reviewer.displayName}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">{review.comment}</p>
						</div>
					)}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-sm font-medium">Your Response</label>
							<Button
								variant="outline"
								size="sm"
								onClick={handleGenerateAI}
								disabled={generatingAI}
							>
								{generatingAI ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Sparkles className="mr-2 h-4 w-4" />
								)}
								Generate with AI
							</Button>
						</div>
						<Textarea
							value={response}
							onChange={(e) => setResponse(e.target.value)}
							placeholder="Write your response here..."
							rows={5}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading || !response.trim()}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Post Response
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<GoogleReview[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(
		null
	);
	const [responseDialogOpen, setResponseDialogOpen] = useState(false);

	const fetchReviews = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const data = await MockReviewsService.getAll();
				setReviews(data);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	const handleRespond = (review: GoogleReview) => {
		setSelectedReview(review);
		setResponseDialogOpen(true);
	};

	const handleSubmitResponse = async (reviewId: string, response: string) => {
		if (isMockMode()) {
			const updatedReview = await MockReviewsService.replyToReview(
				reviewId,
				response
			);
			setReviews((prev) =>
				prev.map((r) => (r.reviewId === reviewId ? updatedReview : r))
			);
		}
	};

	const filteredReviews = reviews.filter((review) => {
		const hasResponse = !!review.reviewReply;
		const matchesFilter =
			filter === "all" ||
			(filter === "responded" && hasResponse) ||
			(filter === "pending" && !hasResponse);

		const matchesSearch =
			review.reviewer.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			review.comment?.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	const filters: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "All Reviews", count: reviews.length },
		{
			key: "pending",
			label: "Pending",
			count: reviews.filter((r) => !r.reviewReply).length,
		},
		{
			key: "responded",
			label: "Responded",
			count: reviews.filter((r) => r.reviewReply).length,
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Reviews
					</h1>
					<p className="text-muted-foreground">
						Manage and respond to your customer reviews.
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>All Reviews</CardTitle>
							<CardDescription>
								{filteredReviews.length} reviews found
							</CardDescription>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search reviews..."
									className="pl-9 sm:w-64"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<Filter className="mr-2 h-4 w-4" />
										Filter
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>5 Stars</DropdownMenuItem>
									<DropdownMenuItem>4 Stars</DropdownMenuItem>
									<DropdownMenuItem>3 Stars</DropdownMenuItem>
									<DropdownMenuItem>2 Stars</DropdownMenuItem>
									<DropdownMenuItem>1 Star</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex gap-2">
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
						) : filteredReviews.length > 0 ? (
							filteredReviews.map((review) => (
								<ReviewCard
									key={review.reviewId}
									review={review}
									onRespond={handleRespond}
								/>
							))
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Star className="mb-4 h-12 w-12 text-muted-foreground" />
								<h3 className="text-lg font-semibold">No reviews found</h3>
								<p className="text-muted-foreground">
									Try adjusting your search or filter criteria.
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<ResponseDialog
				review={selectedReview}
				open={responseDialogOpen}
				onOpenChange={setResponseDialogOpen}
				onSubmit={handleSubmitResponse}
			/>
		</div>
	);
}
