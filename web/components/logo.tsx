"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LogoProps {
	className?: string;
	showText?: boolean;
	size?: "sm" | "md" | "lg";
	asLink?: boolean;
}

const sizeClasses = {
	sm: { icon: "h-5 w-5", text: "text-lg" },
	md: { icon: "h-6 w-6", text: "text-xl" },
	lg: { icon: "h-8 w-8", text: "text-2xl" },
};

function LogoContent({ size = "md", showText = true }: Pick<LogoProps, "size" | "showText">) {
	const sizes = sizeClasses[size];

	return (
		<>
			<div className="relative flex items-center justify-center rounded-lg bg-primary p-1.5">
				<Star className={`${sizes.icon} fill-primary-foreground text-primary-foreground`} />
			</div>
			{showText && (
				<span className={`font-bold tracking-tight ${sizes.text}`}>
					Review<span className="text-primary">Boost</span>
				</span>
			)}
		</>
	);
}

export function Logo({ className = "", showText = true, size = "md", asLink = true }: LogoProps) {
	const pathname = usePathname();

	if (!asLink) {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<LogoContent size={size} showText={showText} />
			</div>
		);
	}

	const handleClick = (e: React.MouseEvent) => {
		if (pathname === "/") {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<Link href="/" onClick={handleClick} className={`flex items-center gap-2 ${className}`}>
			<LogoContent size={size} showText={showText} />
		</Link>
	);
}
