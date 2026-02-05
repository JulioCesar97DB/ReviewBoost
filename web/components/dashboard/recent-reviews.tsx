"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { starRatingToNumber } from "@/lib/google/business-profile";
import { MOCK_REVIEWS, type GoogleReview } from "@/lib/mock";
import { isMockMode } from "@/lib/services/google-business";
import { MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Review {
	id: string;
	author: string;
	avatarUrl?: string;
	rating: number;
	text: string;
	date: string;
	responded: boolean;
}

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffHours / 24);

	if (diffHours < 1) return "Just now";
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
	return date.toLocaleDateString();
}

function transformGoogleReview(review: GoogleReview): Review {
	return {
		id: review.reviewId,
		author: review.reviewer.displayName,
		avatarUrl: review.reviewer.profilePhotoUrl,
		rating: starRatingToNumber(review.starRating),
		text: review.comment || "",
		date: formatRelativeTime(review.createTime),
		responded: !!review.reviewReply,
	};
}

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
						}`}
				/>
			))}
		</div>
	);
}

export function RecentReviews() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadReviews = async () => {
			if (isMockMode()) {
				const recentMockReviews = MOCK_REVIEWS.slice(0, 4).map(transformGoogleReview);
				setReviews(recentMockReviews);
			}
			setLoading(false);
		};

		loadReviews();
	}, []);

	if (loading) {
		return (
			<Card className="col-span-full lg:col-span-2">
				<CardHeader>
					<div className="h-6 w-32 animate-pulse rounded bg-muted" />
				</CardHeader>
				<CardContent className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
					))}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="col-span-full lg:col-span-2">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Recent reviews</CardTitle>
				<Button variant="outline" size="sm" asChild>
					<Link href="/dashboard/reviews">View all</Link>
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{reviews.map((review) => (
					<div
						key={review.id}
						className="flex flex-col gap-3 rounded-lg border border-border p-4"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3">
								{review.avatarUrl ? (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img
										src={review.avatarUrl}
										alt={review.author}
										className="h-10 w-10 rounded-full object-cover"
									/>
								) : (
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
										{review.author
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</div>
								)}
								<div>
									<div className="font-medium">{review.author}</div>
									<div className="flex items-center gap-2">
										<StarRating rating={review.rating} />
										<span className="text-xs text-muted-foreground">
											{review.date}
										</span>
									</div>
								</div>
							</div>
							{review.responded ? (
								<Badge variant="secondary" className="shrink-0">
									Responded
								</Badge>
							) : (
								<Badge
									variant={review.rating <= 2 ? "destructive" : "default"}
									className="shrink-0"
								>
									{review.rating <= 2 ? "Urgent" : "Pending"}
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{review.text}
						</p>
						{!review.responded && (
							<Button size="sm" className="w-fit">
								<MessageSquare className="mr-2 h-4 w-4" />
								Respond with AI
							</Button>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
