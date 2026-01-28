"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	BarChart3,
	ChevronLeft,
	ChevronRight,
	HelpCircle,
	LayoutDashboard,
	Send,
	Settings,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
}

const navItems = [
	{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
	{ href: "/dashboard/reviews", icon: Star, label: "Reviews" },
	{ href: "/dashboard/requests", icon: Send, label: "Requests" },
	{ href: "/dashboard/contacts", icon: Users, label: "Contacts" },
	{ href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

const bottomNavItems = [
	{ href: "/dashboard/settings", icon: Settings, label: "Settings" },
	{ href: "/help", icon: HelpCircle, label: "Help" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300",
				collapsed ? "w-16" : "w-64"
			)}
		>
			<div className="flex h-16 items-center justify-between border-b border-border px-4">
				{!collapsed && <Logo size="sm" />}
				{collapsed && <Logo size="sm" showText={false} />}
			</div>

			<nav className="flex-1 space-y-1 p-2">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
								collapsed && "justify-center"
							)}
							title={collapsed ? item.label : undefined}
						>
							<item.icon className="h-5 w-5 shrink-0" />
							{!collapsed && <span>{item.label}</span>}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-border p-2">
				{bottomNavItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground",
								collapsed && "justify-center"
							)}
							title={collapsed ? item.label : undefined}
						>
							<item.icon className="h-5 w-5 shrink-0" />
							{!collapsed && <span>{item.label}</span>}
						</Link>
					);
				})}

				<Button
					variant="ghost"
					size="sm"
					className={cn("mt-2 w-full", collapsed && "px-0")}
					onClick={onToggle}
				>
					{collapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Collapse
						</>
					)}
				</Button>
			</div>
		</aside>
	);
}
