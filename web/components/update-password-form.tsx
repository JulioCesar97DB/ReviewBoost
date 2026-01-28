"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			setIsLoading(false);
			return;
		}

		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			router.push("/dashboard");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="password">New password</Label>
				<Input
					id="password"
					type="password"
					placeholder="At least 8 characters"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					disabled={isLoading}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm password</Label>
				<Input
					id="confirmPassword"
					type="password"
					placeholder="Repeat your password"
					required
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
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
						Updating...
					</>
				) : (
					"Update password"
				)}
			</Button>
		</form>
	);
}
