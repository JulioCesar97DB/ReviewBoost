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
	Filter,
	MessageSquare,
	MoreHorizontal,
	Search,
	Star,
} from "lucide-react";
import { useState } from "react";

interface Review {
	id: string;
	author: string;
	rating: number;
	text: string;
	platform: "google" | "yelp" | "facebook";
	date: string;
	responded: boolean;
}

const mockReviews: Review[] = [
	{
		id: "1",
		author: "John Davidson",
		rating: 5,
		text: "Excellent service! The team was professional and went above and beyond. Highly recommended for anyone looking for quality work.",
		platform: "google",
		date: "2 hours ago",
		responded: true,
	},
	{
		id: "2",
		author: "Sarah Mitchell",
		rating: 4,
		text: "Great experience overall. The staff was friendly and helpful. Will definitely come back.",
		platform: "yelp",
		date: "5 hours ago",
		responded: false,
	},
	{
		id: "3",
		author: "Mike Roberts",
		rating: 5,
		text: "Best in town! Professional team and excellent results. Could not be happier with the outcome.",
		platform: "google",
		date: "1 day ago",
		responded: true,
	},
	{
		id: "4",
		author: "Emily Chen",
		rating: 3,
		text: "Decent service but room for improvement. The wait time was longer than expected.",
		platform: "facebook",
		date: "2 days ago",
		responded: false,
	},
	{
		id: "5",
		author: "David Wilson",
		rating: 5,
		text: "Outstanding! Exceeded all my expectations. Will recommend to friends and family.",
		platform: "google",
		date: "3 days ago",
		responded: true,
	},
	{
		id: "6",
		author: "Lisa Thompson",
		rating: 2,
		text: "Not satisfied with the service. Expected better quality for the price paid.",
		platform: "google",
		date: "4 days ago",
		responded: false,
	},
	{
		id: "7",
		author: "James Brown",
		rating: 5,
		text: "Amazing experience from start to finish. The attention to detail was impressive.",
		platform: "yelp",
		date: "5 days ago",
		responded: true,
	},
];

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

function getPlatformColor(platform: string) {
	switch (platform) {
		case "google":
			return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
		case "yelp":
			return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
		case "facebook":
			return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
		default:
			return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
	}
}

function ReviewCard({ review }: { review: Review }) {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
							{review.author.charAt(0)}
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-semibold">{review.author}</span>
								<Badge
									variant="secondary"
									className={cn("capitalize", getPlatformColor(review.platform))}
								>
									{review.platform}
								</Badge>
							</div>
							<div className="flex items-center gap-3">
								<StarRating rating={review.rating} />
								<span className="text-sm text-muted-foreground">
									{review.date}
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{review.responded ? (
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
								<DropdownMenuItem>View on {review.platform}</DropdownMenuItem>
								<DropdownMenuItem>Copy link</DropdownMenuItem>
								<DropdownMenuItem>Report</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<p className="mt-4 text-sm leading-relaxed text-foreground">
					{review.text}
				</p>
				{!review.responded && (
					<div className="mt-4 flex gap-2">
						<Button size="sm">
							<MessageSquare className="mr-2 h-4 w-4" />
							Respond
						</Button>
						<Button size="sm" variant="outline">
							AI Suggestion
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default function ReviewsPage() {
	const [filter, setFilter] = useState<FilterType>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredReviews = mockReviews.filter((review) => {
		const matchesFilter =
			filter === "all" ||
			(filter === "responded" && review.responded) ||
			(filter === "pending" && !review.responded);

		const matchesSearch =
			review.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			review.text.toLowerCase().includes(searchQuery.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	const filters: { key: FilterType; label: string; count: number }[] = [
		{ key: "all", label: "All Reviews", count: mockReviews.length },
		{
			key: "pending",
			label: "Pending",
			count: mockReviews.filter((r) => !r.responded).length,
		},
		{
			key: "responded",
			label: "Responded",
			count: mockReviews.filter((r) => r.responded).length,
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
						{filteredReviews.length > 0 ? (
							filteredReviews.map((review) => (
								<ReviewCard key={review.id} review={review} />
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
		</div>
	);
}
