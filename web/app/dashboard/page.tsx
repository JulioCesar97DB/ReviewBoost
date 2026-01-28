import {
	QuickActions,
	RatingDistribution,
	RecentReviews,
	StatsCards,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";

function StatsCardsSkeleton() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{[...Array(4)].map((_, i) => (
				<div
					key={i}
					className="h-32 animate-pulse rounded-lg border border-border bg-card"
				/>
			))}
		</div>
	);
}

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Dashboard
					</h1>
					<p className="text-muted-foreground">
						Welcome back. Here&apos;s your reputation summary.
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New request
				</Button>
			</div>

			<Suspense fallback={<StatsCardsSkeleton />}>
				<StatsCards />
			</Suspense>

			<div className="grid gap-6 lg:grid-cols-3">
				<RecentReviews />
				<div className="space-y-6">
					<QuickActions />
					<RatingDistribution />
				</div>
			</div>
		</div>
	);
}
