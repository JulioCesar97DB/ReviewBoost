import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="space-y-6">
			{/* Page header skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* Stats cards skeleton */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="rounded-lg border border-border bg-card p-6 shadow-sm"
					>
						<div className="flex items-center justify-between">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4 rounded" />
						</div>
						<div className="mt-3 space-y-2">
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-3 w-32" />
						</div>
					</div>
				))}
			</div>

			{/* Main content area skeleton */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Recent reviews skeleton */}
				<div className="rounded-lg border border-border bg-card p-6 shadow-sm lg:col-span-2">
					<Skeleton className="mb-4 h-6 w-32" />
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex gap-4">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-4 w-20" />
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Sidebar skeleton */}
				<div className="space-y-6">
					{/* Quick actions skeleton */}
					<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
						<Skeleton className="mb-4 h-6 w-28" />
						<div className="space-y-3">
							{[...Array(3)].map((_, i) => (
								<Skeleton key={i} className="h-10 w-full rounded-md" />
							))}
						</div>
					</div>

					{/* Rating distribution skeleton */}
					<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
						<Skeleton className="mb-4 h-6 w-36" />
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-center gap-3">
									<Skeleton className="h-4 w-8" />
									<Skeleton className="h-2 flex-1 rounded-full" />
									<Skeleton className="h-4 w-8" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
