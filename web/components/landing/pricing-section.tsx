import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
	{
		name: "Free",
		price: "$0",
		description: "Perfect to get started",
		features: [
			"10 requests/month",
			"QR Code for your location",
			"Personalized link",
			"Basic monitoring",
			"Email alerts",
		],
		cta: "Start free",
		popular: false,
	},
	{
		name: "Starter",
		price: "$19",
		period: "/month",
		description: "For growing businesses",
		features: [
			"100 requests/month",
			"Everything in Free, plus:",
			"SMS sending",
			"AI responses",
			"Unlimited templates",
			"Basic analytics",
			"Email support",
		],
		cta: "Start free trial",
		popular: true,
	},
	{
		name: "Growth",
		price: "$39",
		period: "/month",
		description: "For established businesses",
		features: [
			"300 requests/month",
			"Everything in Starter, plus:",
			"Up to 3 locations",
			"Bulk send (up to 50)",
			"Advanced analytics",
			"Priority support",
			"Data export",
		],
		cta: "Start free trial",
		popular: false,
	},
];

export function PricingSection() {
	return (
		<section id="pricing" className="py-20 sm:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Simple, transparent pricing
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						No surprises. No contracts. Cancel anytime.
					</p>
				</div>

				<div className="mt-16 grid gap-8 lg:grid-cols-3">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative rounded-2xl border ${plan.popular
									? "border-primary bg-card shadow-xl shadow-primary/10"
									: "border-border bg-card"
								} p-8`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
									Most popular
								</div>
							)}

							<div className="text-center">
								<h3 className="text-xl font-semibold">{plan.name}</h3>
								<p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
								<div className="mt-4">
									<span className="text-4xl font-bold">{plan.price}</span>
									{plan.period && (
										<span className="text-muted-foreground">{plan.period}</span>
									)}
								</div>
							</div>

							<ul className="mt-8 space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-3">
										<Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
										<span className="text-sm text-muted-foreground">{feature}</span>
									</li>
								))}
							</ul>

							<Button
								className="mt-8 w-full"
								variant={plan.popular ? "default" : "outline"}
								asChild
							>
								<Link href="/auth/sign-up">{plan.cta}</Link>
							</Button>
						</div>
					))}
				</div>

				<p className="mt-12 text-center text-sm text-muted-foreground">
					Have multiple locations?{" "}
					<Link href="/contact" className="font-medium text-primary hover:underline">
						Contact us for an Agency plan
					</Link>
				</p>
			</div>
		</section>
	);
}
