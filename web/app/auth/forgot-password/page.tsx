import { AuthLayout } from "@/components/auth";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
	return (
		<AuthLayout
			title="Reset your password"
			description="We'll send you a link to reset your password"
		>
			<ForgotPasswordForm />
		</AuthLayout>
	);
}
