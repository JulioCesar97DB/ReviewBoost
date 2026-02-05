"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="flex min-h-[80vh] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardContent className="flex flex-col items-center gap-6 pt-6 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<AlertCircle className="h-8 w-8 text-destructive" />
					</div>
					<div className="space-y-2">
						<h2 className="text-xl font-semibold text-foreground">
							Something went wrong
						</h2>
						<p className="text-sm text-muted-foreground">
							We encountered an error while loading this page. Please try again
							or return to the dashboard.
						</p>
						{error.digest && (
							<p className="text-xs text-muted-foreground">
								Error ID: {error.digest}
							</p>
						)}
					</div>
					<div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
						<Button onClick={() => reset()} className="w-full sm:w-auto">
							<RefreshCw className="mr-2 h-4 w-4" />
							Try again
						</Button>
						<Button variant="outline" className="w-full sm:w-auto" asChild>
							<Link href="/dashboard">
								<Home className="mr-2 h-4 w-4" />
								Back to Dashboard
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
