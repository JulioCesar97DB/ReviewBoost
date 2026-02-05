"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessStats } from "@/lib/services/google-business";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

interface DistributionItem {
	rating: number;
	count: number;
	percentage: number;
}

export function RatingDistribution() {
	const [distribution, setDistribution] = useState<DistributionItem[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadDistribution = () => {
			const stats = getBusinessStats();
			const totalReviews = stats.totalReviews;

			const dist: DistributionItem[] = [5, 4, 3, 2, 1].map((rating) => {
				const count = stats.ratingDistribution[rating] || 0;
				return {
					rating,
					count,
					percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
				};
			});

			setDistribution(dist);
			setTotal(totalReviews);
			setLoading(false);
		};

		loadDistribution();
	}, []);

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<div className="h-6 w-36 animate-pulse rounded bg-muted" />
				</CardHeader>
				<CardContent className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="h-4 w-12 animate-pulse rounded bg-muted" />
							<div className="h-2 flex-1 animate-pulse rounded bg-muted" />
							<div className="h-4 w-8 animate-pulse rounded bg-muted" />
						</div>
					))}
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rating distribution</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{distribution.map((item) => (
					<div key={item.rating} className="flex items-center gap-3">
						<div className="flex w-12 items-center gap-1">
							<span className="text-sm font-medium">{item.rating}</span>
							<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
						</div>
						<div className="flex-1">
							<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{ width: `${item.percentage}%` }}
								/>
							</div>
						</div>
						<div className="w-12 text-right text-sm text-muted-foreground">
							{item.count}
						</div>
					</div>
				))}
				<div className="mt-4 border-t border-border pt-4 text-center text-sm text-muted-foreground">
					Total: <span className="font-medium text-foreground">{total}</span>{" "}
					reviews
				</div>
			</CardContent>
		</Card>
	);
}
