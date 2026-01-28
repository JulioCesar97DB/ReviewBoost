import { Star } from "lucide-react";

const testimonials = [
	{
		content:
			"We went from 15 to 89 reviews in just 3 months. The SMS request feature is incredible, customers respond much more.",
		author: "Maria Garcia",
		role: "Owner of La Tradición Restaurant",
		rating: 5,
		avatar: "MG",
	},
	{
		content:
			"The AI responses save me hours every week. They sound natural and professional, and I can edit them if I want.",
		author: "Carlos Rodriguez",
		role: "Owner of Classic Barbershop",
		rating: 5,
		avatar: "CR",
	},
	{
		content:
			"Finally a tool I can afford. Other options were ridiculously expensive. ReviewBoost does exactly what I need.",
		author: "Ana Martinez",
		role: "Dentist - Smile Clinic",
		rating: 5,
		avatar: "AM",
	},
];

export function TestimonialsSection() {
	return (
		<section className="border-t border-border bg-muted/30 py-20 sm:py-28">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						What our customers say
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Real businesses that have transformed their online reputation.
					</p>
				</div>

				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.author}
							className="rounded-2xl border border-border bg-card p-6"
						>
							<div className="flex gap-1">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
								))}
							</div>

							<blockquote className="mt-4 text-muted-foreground">
								&ldquo;{testimonial.content}&rdquo;
							</blockquote>

							<div className="mt-6 flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
									{testimonial.avatar}
								</div>
								<div>
									<div className="font-medium">{testimonial.author}</div>
									<div className="text-sm text-muted-foreground">{testimonial.role}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
