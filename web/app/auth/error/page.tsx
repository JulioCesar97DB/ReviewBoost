import { AuthLayout } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
	return (
		<AuthLayout
			title="Something went wrong"
			description="There was a problem with authentication"
		>
			<div className="space-y-6 text-center">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
					<AlertTriangle className="h-10 w-10 text-destructive" />
				</div>

				<div className="space-y-2">
					<p className="text-muted-foreground">
						We couldn&apos;t complete the authentication process. This may be due to an
						expired or invalid link.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<Button asChild className="w-full">
						<Link href="/auth/login">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to sign in
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full">
						<Link href="/auth/forgot-password">Reset password</Link>
					</Button>
				</div>
			</div>
		</AuthLayout>
	);
}
