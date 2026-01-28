import { AuthLayout } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
	return (
		<AuthLayout
			title="Check your email!"
			description="We've sent you a confirmation link"
		>
			<div className="space-y-6 text-center">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
					<Mail className="h-10 w-10 text-primary" />
				</div>

				<div className="space-y-2">
					<p className="text-muted-foreground">
						We&apos;ve sent a confirmation email to your inbox. Click the link to
						activate your account and start using ReviewBoost.
					</p>
				</div>

				<div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
					<p>
						<strong>Don&apos;t see the email?</strong> Check your spam or junk folder.
					</p>
				</div>

				<Button asChild className="w-full">
					<Link href="/auth/login">
						Go to sign in
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		</AuthLayout>
	);
}
