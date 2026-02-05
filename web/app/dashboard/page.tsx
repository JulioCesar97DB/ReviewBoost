import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const StatsCards = dynamic(
	() => import("@/components/dashboard/stats-cards").then((mod) => mod.StatsCards),
	{
		loading: () => <StatsCardsSkeleton />,
		ssr: true,
	}
);

const RecentReviews = dynamic(
	() => import("@/components/dashboard/recent-reviews").then((mod) => mod.RecentReviews),
	{
		loading: () => <RecentReviewsSkeleton />,
		ssr: true,
	}
);

const QuickActions = dynamic(
	() => import("@/components/dashboard/quick-actions").then((mod) => mod.QuickActions),
	{
		loading: () => <QuickActionsSkeleton />,
		ssr: true,
	}
);

const RatingDistribution = dynamic(
	() => import("@/components/dashboard/rating-distribution").then((mod) => mod.RatingDistribution),
	{
		loading: () => <RatingDistributionSkeleton />,
		ssr: true,
	}
);

function StatsCardsSkeleton() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{[...Array(4)].map((_, i) => (
				<div
					key={i}
					className="rounded-lg border border-border bg-card p-6"
				>
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-4" />
					</div>
					<Skeleton className="mt-3 h-8 w-16" />
					<Skeleton className="mt-2 h-3 w-32" />
				</div>
			))}
		</div>
	);
}

function RecentReviewsSkeleton() {
	return (
		<div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
			<Skeleton className="mb-4 h-6 w-32" />
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex gap-4">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function QuickActionsSkeleton() {
	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<Skeleton className="mb-4 h-6 w-28" />
			<div className="space-y-3">
				{[...Array(3)].map((_, i) => (
					<Skeleton key={i} className="h-10 w-full" />
				))}
			</div>
		</div>
	);
}

function RatingDistributionSkeleton() {
	return (
		<div className="rounded-lg border border-border bg-card p-6">
			<Skeleton className="mb-4 h-6 w-36" />
			<div className="space-y-3">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="flex items-center gap-3">
						<Skeleton className="h-4 w-8" />
						<Skeleton className="h-2 flex-1" />
						<Skeleton className="h-4 w-8" />
					</div>
				))}
			</div>
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
