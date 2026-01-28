import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
	CtaSection,
	FaqSection,
	FeaturesSection,
	HeroSection,
	PricingSection,
	TestimonialsSection,
} from "@/components/landing";

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
				<TestimonialsSection />
				<PricingSection />
				<FaqSection />
				<CtaSection />
			</main>
			<Footer />
		</div>
	);
}
