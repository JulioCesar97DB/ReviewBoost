"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { User as UserType } from "@supabase/supabase-js";
import {
	CreditCard,
	HelpCircle,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getInitials(name?: string | null, email?: string | null): string {
	if (name) {
		const parts = name.trim().split(" ");
		if (parts.length >= 2) {
			return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
		}
		return name.charAt(0).toUpperCase();
	}
	if (email) {
		return email.charAt(0).toUpperCase();
	}
	return "U";
}

function getDisplayName(user: UserType | null): string {
	if (!user) return "User";

	const metadata = user.user_metadata;
	if (metadata?.full_name) return metadata.full_name;
	if (metadata?.name) return metadata.name;
	if (user.email) return user.email.split("@")[0];
	return "User";
}

export function UserNav() {
	const router = useRouter();
	const [user, setUser] = useState<UserType | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		const getUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUser(user);
			setIsLoading(false);
		};

		getUser();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null);
			}
		);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/");
	};

	const displayName = getDisplayName(user);
	const email = user?.email ?? "";
	const avatarUrl = user?.user_metadata?.avatar_url;
	const initials = getInitials(user?.user_metadata?.full_name, email);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-9 w-9 rounded-full p-0"
				>
					<Avatar className="h-9 w-9">
						<AvatarImage src={avatarUrl} alt={displayName} />
						<AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
							{isLoading ? "..." : initials}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{displayName}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings">
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings">
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Billing</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/help">
						<HelpCircle className="mr-2 h-4 w-4" />
						<span>Help & Support</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}
					className="text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
