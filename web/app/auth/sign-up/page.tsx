import { AuthLayout } from "@/components/auth";
import { SignUpForm } from "@/components/sign-up-form";

export default function SignUpPage() {
	return (
		<AuthLayout
			title="Create your free account"
			description="Start getting more 5-star reviews today"
		>
			<SignUpForm />
		</AuthLayout>
	);
}
