"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusinessStats, isMockMode } from "@/lib/services/google-business";
import { CheckCircle, MessageSquare, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface StatData {
	title: string;
	value: string;
	change: string;
	changeType: "positive" | "negative";
	icon: typeof Star;
	description: string;
}

export function StatsCards() {
	const [stats, setStats] = useState<StatData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadStats = async () => {
			const businessStats = getBusinessStats();

			setStats([
				{
					title: "Current rating",
					value: businessStats.averageRating.toFixed(1),
					change: "+0.3",
					changeType: "positive",
					icon: Star,
					description: "on Google",
				},
				{
					title: "Total reviews",
					value: String(businessStats.totalReviews),
					change: "+23%",
					changeType: "positive",
					icon: MessageSquare,
					description: "all time",
				},
				{
					title: "Response rate",
					value: `${businessStats.responseRate}%`,
					change: "+5%",
					changeType: "positive",
					icon: CheckCircle,
					description: "responded",
				},
				{
					title: "Pending replies",
					value: String(businessStats.totalReviews - businessStats.respondedCount),
					change: "-12%",
					changeType: "positive",
					icon: TrendingUp,
					description: "need attention",
				},
			]);

			setLoading(false);
		};

		loadStats();
	}, []);

	if (loading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-2">
							<div className="h-4 w-24 animate-pulse rounded bg-muted" />
						</CardHeader>
						<CardContent>
							<div className="h-8 w-16 animate-pulse rounded bg-muted" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<>
			{isMockMode() && (
				<div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
					🔶 <strong>Demo Mode:</strong> Showing simulated data. Connect a real Google Business Profile for live data.
				</div>
			)}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								{stat.title}
							</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="flex items-baseline gap-2">
								<div className="text-2xl font-bold">{stat.value}</div>
								{stat.title === "Current rating" && (
									<div className="flex">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-3 w-3 ${i < Math.round(parseFloat(stat.value))
														? "fill-yellow-500 text-yellow-500"
														: "text-muted"
													}`}
											/>
										))}
									</div>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								<span
									className={
										stat.changeType === "positive"
											? "text-green-600"
											: "text-red-600"
									}
								>
									{stat.change}
								</span>{" "}
								{stat.description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
