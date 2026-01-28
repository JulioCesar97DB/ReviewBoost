"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		question: "How does ReviewBoost work?",
		answer:
			"You connect your Google Business Profile with a few clicks. Then you can send review requests to your customers via SMS, email, or WhatsApp. When reviews arrive, you'll see them in your dashboard and can respond with AI assistance.",
	},
	{
		question: "Is it compatible with my business?",
		answer:
			"ReviewBoost works with any business that has a Google Business Profile: restaurants, stores, medical offices, beauty salons, auto shops, and more. If you have a listing on Google Maps, it works for you.",
	},
	{
		question: "How long does it take to set up?",
		answer:
			"Less than 5 minutes. You just need to create an account, connect your Google Business Profile, and you're ready. You can start sending review requests immediately.",
	},
	{
		question: "Can I try it for free?",
		answer:
			"Yes, the Free plan is completely free and includes 10 requests per month, QR code, and basic monitoring. We also offer a 14-day free trial on paid plans with no credit card required.",
	},
	{
		question: "Do the AI responses sound natural?",
		answer:
			"Yes, our AI is trained to generate responses that sound human and professional. It detects the language and tone of the review to respond appropriately. You can always edit the response before publishing.",
	},
	{
		question: "What happens if I receive a negative review?",
		answer:
			"You'll receive an immediate alert via email and push notification. The AI will suggest an empathetic response that acknowledges the problem, apologizes appropriately, and offers a solution. Responding quickly and well to criticism can turn a dissatisfied customer into a promoter.",
	},
	{
		question: "Can I cancel anytime?",
		answer:
			"Yes, there are no contracts or commitments. You can cancel your subscription at any time from your dashboard. Your account will switch to the Free plan at the end of the billing period.",
	},
];

export function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section id="faq" className="py-20 sm:py-28">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Have questions? Here are the most common answers.
					</p>
				</div>

				<div className="mt-12 space-y-4">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="rounded-lg border border-border bg-card"
						>
							<button
								className="flex w-full items-center justify-between px-6 py-4 text-left"
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
							>
								<span className="font-medium">{faq.question}</span>
								<ChevronDown
									className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""
										}`}
								/>
							</button>
							{openIndex === index && (
								<div className="border-t border-border px-6 py-4">
									<p className="text-muted-foreground">{faq.answer}</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
