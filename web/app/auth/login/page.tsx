import { AuthLayout } from "@/components/auth";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
	return (
		<AuthLayout
			title="Welcome back"
			description="Enter your credentials to access your account"
		>
			<LoginForm />
		</AuthLayout>
	);
}
