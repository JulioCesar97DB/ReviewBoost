import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden">
			<div className="gradient-hero absolute inset-0 -z-10" />
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.12),transparent)]" />

			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
				<div className="mx-auto max-w-3xl text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
						<Zap className="h-4 w-4" />
						New: AI-powered responses included
					</div>

					<h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						Get more{" "}
						<span className="relative inline-block">
							<span className="relative z-10">5-star reviews</span>
							<span className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/20" />
						</span>{" "}
						for your business
					</h1>

					<p className="mt-6 text-lg text-muted-foreground sm:text-xl">
						Request reviews in 3 clicks, respond with AI, and monitor your reputation from one
						place. All for just <span className="font-semibold text-foreground">$19/month</span>.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild className="w-full sm:w-auto">
							<Link href="/auth/sign-up">
								Start free
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
							<Link href="#demo">Watch demo</Link>
						</Button>
					</div>

					<div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4 text-primary" />
							No credit card required
						</div>
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4 fill-primary text-primary" />
							14-day free trial
						</div>
						<div className="flex items-center gap-2">
							<Zap className="h-4 w-4 text-primary" />
							Setup in 5 minutes
						</div>
					</div>
				</div>

				<div className="mt-16 sm:mt-20">
					<div className="relative mx-auto max-w-5xl">
						<div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-2xl" />
						<div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
							<div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
								<div className="h-3 w-3 rounded-full bg-red-500" />
								<div className="h-3 w-3 rounded-full bg-yellow-500" />
								<div className="h-3 w-3 rounded-full bg-green-500" />
								<span className="ml-2 text-xs text-muted-foreground">ReviewBoost Dashboard</span>
							</div>
							<div className="aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted p-6 sm:p-8">
								<div className="grid h-full gap-4 sm:grid-cols-3">
									<div className="rounded-lg border border-border bg-card p-4 shadow-sm">
										<div className="text-sm text-muted-foreground">Current rating</div>
										<div className="mt-2 flex items-baseline gap-2">
											<span className="text-3xl font-bold">4.8</span>
											<div className="flex">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-4 w-4 ${i < 5 ? "fill-yellow-500 text-yellow-500" : "text-muted"}`}
													/>
												))}
											</div>
										</div>
										<div className="mt-1 text-xs text-green-600">+0.3 this month</div>
									</div>
									<div className="rounded-lg border border-border bg-card p-4 shadow-sm">
										<div className="text-sm text-muted-foreground">Reviews this month</div>
										<div className="mt-2 text-3xl font-bold">47</div>
										<div className="mt-1 text-xs text-green-600">+23% vs last month</div>
									</div>
									<div className="rounded-lg border border-border bg-card p-4 shadow-sm">
										<div className="text-sm text-muted-foreground">Response rate</div>
										<div className="mt-2 text-3xl font-bold">94%</div>
										<div className="mt-1 text-xs text-muted-foreground">Goal: 100%</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
