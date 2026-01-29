"use client";

import { cn } from "@/lib/utils";
import { Check, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
	{
		key: "light",
		label: "Light",
		icon: Sun,
		iconClass: "bg-amber-100",
		iconColor: "text-amber-600",
	},
	{
		key: "dark",
		label: "Dark",
		icon: Moon,
		iconClass: "bg-slate-800",
		iconColor: "text-slate-200",
	},
	{
		key: "system",
		label: "System",
		icon: Globe,
		iconClass: "bg-gradient-to-br from-amber-100 to-slate-800",
		iconColor: "text-white",
	},
];

export function ThemeSelector() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex gap-4">
				{themes.map((t) => (
					<div
						key={t.key}
						className="flex h-[116px] w-[88px] flex-col items-center gap-2 rounded-lg border-2 border-border p-4"
					>
						<div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-full",
								t.iconClass
							)}
						>
							<t.icon className={cn("h-6 w-6", t.iconColor)} />
						</div>
						<span className="text-sm font-medium">{t.label}</span>
						<div className="h-4 w-4" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="flex gap-4">
			{themes.map((t) => {
				const isSelected = theme === t.key;
				return (
					<button
						key={t.key}
						type="button"
						onClick={() => setTheme(t.key)}
						className={cn(
							"flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
							isSelected
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/50"
						)}
					>
						<div
							className={cn(
								"flex h-12 w-12 items-center justify-center rounded-full",
								t.iconClass
							)}
						>
							<t.icon className={cn("h-6 w-6", t.iconColor)} />
						</div>
						<span className="text-sm font-medium">{t.label}</span>
						<div className="h-4 w-4">
							{isSelected && <Check className="h-4 w-4 text-primary" />}
						</div>
					</button>
				);
			})}
		</div>
	);
}
