"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global error:", error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
					<div className="flex flex-col items-center gap-6 text-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
							<AlertCircle className="h-10 w-10 text-destructive" />
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-foreground">
								Something went wrong!
							</h1>
							<p className="max-w-md text-muted-foreground">
								An unexpected error occurred. Please try again or contact
								support if the problem persists.
							</p>
							{error.digest && (
								<p className="text-xs text-muted-foreground">
									Error ID: {error.digest}
								</p>
							)}
						</div>
						<div className="flex gap-4">
							<Button onClick={() => reset()} variant="default">
								<RefreshCw className="mr-2 h-4 w-4" />
								Try again
							</Button>
							<Button
								onClick={() => (window.location.href = "/")}
								variant="outline"
							>
								Go home
							</Button>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
