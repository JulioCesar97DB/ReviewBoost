import {
	BarChart3,
	Bell,
	MessageSquare,
	QrCode,
	Smartphone,
	Sparkles,
	Star,
	Zap,
} from "lucide-react";

const features = [
	{
		icon: MessageSquare,
		title: "Request reviews easily",
		description:
			"Send requests via SMS, email, or WhatsApp in seconds. Customizable templates included.",
	},
	{
		icon: QrCode,
		title: "QR Code for your location",
		description:
			"Generate unique QR codes for your business. Print them and display in your store.",
	},
	{
		icon: Star,
		title: "Monitor all your reviews",
		description:
			"See all your Google reviews in one place. Filter, search, and organize easily.",
	},
	{
		icon: Sparkles,
		title: "AI-powered responses",
		description:
			"Generate professional, personalized responses with one click. The AI understands context.",
	},
	{
		icon: Bell,
		title: "Instant alerts",
		description:
			"Get immediate notifications when a new review arrives. Especially negative ones.",
	},
	{
		icon: BarChart3,
		title: "Detailed analytics",
		description:
			"Visualize trends, rating distribution, and key metrics of your reputation.",
	},
	{
		icon: Smartphone,
		title: "Mobile app",
		description:
			"Manage your reputation from anywhere with our iOS and Android app.",
	},
	{
		icon: Zap,
		title: "Setup in 5 minutes",
		description:
			"Connect your Google Business Profile and start getting more reviews today.",
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="border-t border-border bg-muted/30 py-20 sm:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Everything you need to shine on Google
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Simple and powerful tools to get more reviews and manage your reputation.
					</p>
				</div>

				<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
								<feature.icon className="h-6 w-6" />
							</div>
							<h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
							<p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
