"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/update-password`,
			});
			if (error) throw error;
			setIsSubmitted(true);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="space-y-6 text-center">
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<Mail className="h-8 w-8 text-primary" />
				</div>
				<div className="space-y-2">
					<h2 className="text-xl font-semibold">Check your email</h2>
					<p className="text-muted-foreground">
						We&apos;ve sent a recovery link to <strong>{email}</strong>
					</p>
				</div>
				<p className="text-sm text-muted-foreground">
					Didn&apos;t receive the email?{" "}
					<button
						onClick={() => setIsSubmitted(false)}
						className="font-medium text-primary hover:underline"
					>
						Try again
					</button>
				</p>
				<Button variant="outline" asChild className="w-full">
					<Link href="/auth/login">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to sign in
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
				/>
			</div>

			{error && (
				<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
					{error}
				</div>
			)}

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Sending...
					</>
				) : (
					"Send recovery link"
				)}
			</Button>

			<Button variant="outline" asChild className="w-full">
				<Link href="/auth/login">
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to sign in
				</Link>
			</Button>
		</form>
	);
}
