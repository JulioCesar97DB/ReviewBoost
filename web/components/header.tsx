"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

const navLinks = [
	{ href: "features", label: "Features" },
	{ href: "pricing", label: "Pricing" },
	{ href: "faq", label: "FAQ" },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		setMobileMenuOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Logo />

				<nav className="hidden items-center gap-8 md:flex">
					{navLinks.map((link) => (
						<button
							key={link.href}
							onClick={() => scrollToSection(link.href)}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.label}
						</button>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<ThemeSwitcher />
					<Button variant="ghost" asChild>
						<Link href="/auth/login">Sign in</Link>
					</Button>
					<Button asChild>
						<Link href="/auth/sign-up">Start free</Link>
					</Button>
				</div>

				<div className="flex items-center gap-2 md:hidden">
					<ThemeSwitcher />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="border-t border-border/40 bg-background md:hidden">
					<div className="space-y-1 px-4 py-4">
						{navLinks.map((link) => (
							<button
								key={link.href}
								onClick={() => scrollToSection(link.href)}
								className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							>
								{link.label}
							</button>
						))}
						<div className="mt-4 flex flex-col gap-2 pt-4">
							<Button variant="outline" asChild className="w-full">
								<Link href="/auth/login">Sign in</Link>
							</Button>
							<Button asChild className="w-full">
								<Link href="/auth/sign-up">Start free</Link>
							</Button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
