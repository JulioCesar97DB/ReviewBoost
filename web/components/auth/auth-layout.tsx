import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Star } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			<div className="hidden lg:block">
				<div className="relative flex h-full flex-col bg-primary p-10">
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />

					<Link href="/" className="relative z-10">
						<div className="flex items-center gap-2">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
								<Star className="h-6 w-6 fill-white text-white" />
							</div>
							<span className="text-2xl font-bold text-white">ReviewBoost</span>
						</div>
					</Link>

					<div className="relative z-10 mt-auto">
						<blockquote className="space-y-4">
							<p className="text-xl text-white/90">
								&ldquo;We went from 15 to 89 reviews in just 3 months. The SMS request feature
								is incredible.&rdquo;
							</p>
							<footer className="flex items-center gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-medium text-white">
									MG
								</div>
								<div>
									<div className="font-medium text-white">Maria Garcia</div>
									<div className="text-sm text-white/70">Owner of La Tradición Restaurant</div>
								</div>
							</footer>
						</blockquote>

						<div className="mt-8 flex gap-1">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between p-4 lg:p-6">
					<Link href="/" className="lg:hidden">
						<Logo size="sm" asLink={false} />
					</Link>
					<div className="ml-auto">
						<ThemeSwitcher />
					</div>
				</div>

				<div className="flex flex-1 items-center justify-center p-4 sm:p-8">
					<div className="w-full max-w-md space-y-6">
						<div className="space-y-2 text-center">
							<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
							<p className="text-muted-foreground">{description}</p>
						</div>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
