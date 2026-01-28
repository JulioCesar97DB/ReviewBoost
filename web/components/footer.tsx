"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { CopyrightYear } from "./copyright-year";

const footerLinks = {
	product: [
		{ href: "features", label: "Features", isAnchor: true },
		{ href: "pricing", label: "Pricing", isAnchor: true },
		{ href: "faq", label: "FAQ", isAnchor: true },
	],
	company: [
		{ href: "/about", label: "About us", isAnchor: false },
		{ href: "/contact", label: "Contact", isAnchor: false },
		{ href: "/blog", label: "Blog", isAnchor: false },
	],
	legal: [
		{ href: "/privacy", label: "Privacy", isAnchor: false },
		{ href: "/terms", label: "Terms", isAnchor: false },
	],
};

export function Footer() {
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<footer className="border-t border-border bg-muted/30">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div className="col-span-2 md:col-span-1">
						<Logo />
						<p className="mt-4 text-sm text-muted-foreground">
							More 5-star reviews. Less effort. Your reputation on autopilot.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold">Product</h3>
						<ul className="mt-4 space-y-2">
							{footerLinks.product.map((link) => (
								<li key={link.href}>
									{link.isAnchor ? (
										<button
											onClick={() => scrollToSection(link.href)}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</button>
									) : (
										<Link
											href={link.href}
											className="text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold">Company</h3>
						<ul className="mt-4 space-y-2">
							{footerLinks.company.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold">Legal</h3>
						<ul className="mt-4 space-y-2">
							{footerLinks.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-border pt-8">
					<p className="text-center text-sm text-muted-foreground">
						© <CopyrightYear /> ReviewBoost. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
