import { DashboardShell } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

async function AuthCheck({ children }: { children: React.ReactNode }) {
	await connection();
	const supabase = await createClient();
	const { data } = await supabase.auth.getUser();

	if (!data?.user) {
		redirect("/auth/login");
	}

	return <>{children}</>;
}

function DashboardSkeleton() {
	return (
		<div className="flex min-h-screen">
			<div className="hidden w-64 border-r border-border bg-card lg:block" />
			<div className="flex-1">
				<div className="h-16 border-b border-border" />
				<div className="p-6">
					<div className="h-8 w-48 animate-pulse rounded bg-muted" />
				</div>
			</div>
		</div>
	);
}

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<AuthCheck>
				<DashboardShell>{children}</DashboardShell>
			</AuthCheck>
		</Suspense>
	);
}
