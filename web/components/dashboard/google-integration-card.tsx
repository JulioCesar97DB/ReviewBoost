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
import { createClient } from "@/lib/supabase/client";
import {
	CheckCircle,
	ExternalLink,
	Loader2,
	RefreshCw,
	Unlink,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Business {
	id: string;
	name: string;
	google_place_id: string | null;
	google_connected_at: string | null;
	last_review_sync_at: string | null;
	total_reviews: number;
	avg_rating: number;
}

interface SyncStats {
	totalReviews: number;
	avgRating: number;
	reviewsThisMonth: number;
	responseRate: number;
}

export function GoogleIntegrationCard() {
	const [business, setBusiness] = useState<Business | null>(null);
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);
	const [syncResult, setSyncResult] = useState<{
		success: boolean;
		message: string;
		stats?: SyncStats;
	} | null>(null);

	const supabase = createClient();

	const fetchBusiness = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await supabase
				.from("businesses")
				.select(
					"id, name, google_place_id, google_connected_at, last_review_sync_at, total_reviews, avg_rating"
				)
				.eq("user_id", user.id)
				.single();

			setBusiness(data);
		} catch (err) {
			console.error("Error fetching business:", err);
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	useEffect(() => {
		fetchBusiness();
	}, [fetchBusiness]);

	const handleConnect = () => {
		if (!business) return;
		window.location.href = `/api/auth/google/connect?businessId=${business.id}`;
	};

	const handleDisconnect = async () => {
		if (!business) return;

		setDisconnecting(true);
		try {
			const response = await fetch("/api/auth/google/disconnect", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ businessId: business.id }),
			});

			if (response.ok) {
				setBusiness({
					...business,
					google_place_id: null,
					google_connected_at: null,
					last_review_sync_at: null,
				});
				setSyncResult(null);
			}
		} catch (error) {
			console.error("Error disconnecting:", error);
		} finally {
			setDisconnecting(false);
		}
	};

	const handleSync = async () => {
		if (!business) return;

		setSyncing(true);
		setSyncResult(null);

		try {
			const response = await fetch("/api/google/reviews/sync", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ businessId: business.id }),
			});

			const data = await response.json();

			if (response.ok) {
				setSyncResult({
					success: true,
					message: `Synced ${data.result.synced} reviews (${data.result.created} new, ${data.result.updated} updated)`,
					stats: data.stats,
				});
				setBusiness({
					...business,
					last_review_sync_at: new Date().toISOString(),
					total_reviews: data.stats.totalReviews,
					avg_rating: data.stats.avgRating,
				});
			} else {
				setSyncResult({
					success: false,
					message: data.error || "Failed to sync reviews",
				});
			}
		} catch {
			setSyncResult({
				success: false,
				message: "Network error. Please try again.",
			});
		} finally {
			setSyncing(false);
		}
	};

	const isConnected = business?.google_place_id && business?.google_connected_at;

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Never";
		return new Date(dateString).toLocaleString();
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	if (!business) {
		return (
			<Card>
				<CardContent className="py-8 text-center text-muted-foreground">
					No business found. Please create a business first.
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
							<svg
								className="h-6 w-6"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
						</div>
						<div>
							<CardTitle className="text-lg">Google Business Profile</CardTitle>
							<CardDescription>
								Sync and respond to your Google reviews
							</CardDescription>
						</div>
					</div>
					{isConnected ? (
						<Badge
							variant="secondary"
							className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
						>
							<CheckCircle className="mr-1 h-3 w-3" />
							Connected
						</Badge>
					) : (
						<Badge variant="secondary">Not Connected</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{isConnected ? (
					<>
						<div className="rounded-lg border bg-muted/50 p-4">
							<div className="grid gap-3 text-sm sm:grid-cols-2">
								<div>
									<span className="text-muted-foreground">Connected:</span>{" "}
									<span className="font-medium">
										{formatDate(business.google_connected_at)}
									</span>
								</div>
								<div>
									<span className="text-muted-foreground">Last Sync:</span>{" "}
									<span className="font-medium">
										{formatDate(business.last_review_sync_at)}
									</span>
								</div>
								<div>
									<span className="text-muted-foreground">Total Reviews:</span>{" "}
									<span className="font-medium">{business.total_reviews}</span>
								</div>
								<div>
									<span className="text-muted-foreground">Avg Rating:</span>{" "}
									<span className="font-medium">
										{business.avg_rating?.toFixed(1) || "N/A"} ⭐
									</span>
								</div>
							</div>
						</div>

						{syncResult && (
							<div
								className={`rounded-lg border p-3 text-sm ${syncResult.success
									? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
									: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
									}`}
							>
								{syncResult.message}
							</div>
						)}

						<div className="flex flex-wrap gap-2">
							<Button onClick={handleSync} disabled={syncing}>
								{syncing ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Syncing...
									</>
								) : (
									<>
										<RefreshCw className="mr-2 h-4 w-4" />
										Sync Reviews
									</>
								)}
							</Button>
							<Button variant="outline" asChild>
								<a
									href={`https://business.google.com/`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="mr-2 h-4 w-4" />
									Open Google Business
								</a>
							</Button>
							<Button
								variant="outline"
								onClick={handleDisconnect}
								disabled={disconnecting}
								className="text-destructive hover:bg-destructive/10"
							>
								{disconnecting ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Unlink className="mr-2 h-4 w-4" />
								)}
								Disconnect
							</Button>
						</div>
					</>
				) : (
					<>
						<p className="text-sm text-muted-foreground">
							Connect your Google Business Profile to automatically sync
							reviews, respond to customers, and track your reputation.
						</p>
						<Button onClick={handleConnect}>
							<svg
								className="mr-2 h-4 w-4"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Connect Google Business Profile
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}
