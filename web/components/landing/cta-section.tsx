import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
	return (
		<section className="border-t border-border bg-muted/30">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-16 sm:py-24">
					<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
					<div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

					<div className="relative mx-auto max-w-2xl text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-primary-foreground">
							<Star className="h-4 w-4 fill-current" />
							14 days free, no card required
						</div>

						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Ready to get more 5-star reviews?
						</h2>

						<p className="mt-4 text-lg text-primary-foreground/80">
							Join hundreds of businesses already improving their online reputation with
							ReviewBoost.
						</p>

						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								variant="secondary"
								asChild
								className="w-full sm:w-auto"
							>
								<Link href="/auth/sign-up">
									Start free now
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="ghost"
								asChild
								className="w-full text-primary-foreground hover:bg-white/10 hover:text-primary-foreground sm:w-auto"
							>
								<Link href="#demo">Watch demo first</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
