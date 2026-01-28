"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { DashboardHeader } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardShellProps {
	children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background">
			<div className="hidden lg:block">
				<Sidebar
					collapsed={sidebarCollapsed}
					onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				/>
			</div>

			{mobileSidebarOpen && (
				<>
					<div
						className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
						onClick={() => setMobileSidebarOpen(false)}
					/>
					<div className="lg:hidden">
						<Sidebar
							collapsed={false}
							onToggle={() => setMobileSidebarOpen(false)}
						/>
					</div>
				</>
			)}

			<div
				className={cn(
					"flex flex-col transition-all duration-300",
					sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
				)}
			>
				<DashboardHeader onMenuClick={() => setMobileSidebarOpen(true)} />
				<main className="flex-1 p-4 sm:p-6">{children}</main>
			</div>
		</div>
	);
}
