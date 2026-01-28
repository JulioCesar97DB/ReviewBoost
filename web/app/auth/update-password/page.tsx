import { AuthLayout } from "@/components/auth";
import { UpdatePasswordForm } from "@/components/update-password-form";

export default function UpdatePasswordPage() {
	return (
		<AuthLayout
			title="New password"
			description="Enter your new password for your account"
		>
			<UpdatePasswordForm />
		</AuthLayout>
	);
}
