"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { UserNav } from "./user-nav";

interface DashboardHeaderProps {
	onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
	return (
		<header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-lg sm:px-6">
			<Button
				variant="ghost"
				size="icon"
				className="lg:hidden"
				onClick={onMenuClick}
			>
				<Menu className="h-5 w-5" />
			</Button>

			<div className="hidden flex-1 md:block">
				<div className="relative max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search reviews, contacts..."
						className="pl-9"
					/>
				</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
				</Button>
				<ThemeSwitcher />
				<UserNav />
			</div>
		</header>
	);
}
