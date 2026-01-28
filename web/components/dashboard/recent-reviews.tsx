import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";

interface Review {
	id: string;
	author: string;
	rating: number;
	text: string;
	date: string;
	responded: boolean;
}

const recentReviews: Review[] = [
	{
		id: "1",
		author: "Maria Gonzalez",
		rating: 5,
		text: "Excellent service! The staff was very friendly and professional. I will definitely come back.",
		date: "2 hours ago",
		responded: false,
	},
	{
		id: "2",
		author: "Carlos Rodriguez",
		rating: 4,
		text: "Very good place, although the wait time was a bit long. The quality of service makes up for it.",
		date: "5 hours ago",
		responded: true,
	},
	{
		id: "3",
		author: "Ana Martinez",
		rating: 5,
		text: "Incredible experience! They exceeded all my expectations. 100% recommended.",
		date: "Yesterday",
		responded: true,
	},
	{
		id: "4",
		author: "Pedro Lopez",
		rating: 2,
		text: "I was not satisfied with the service. I expected much more for the price I paid.",
		date: "2 days ago",
		responded: false,
	},
];

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
						}`}
				/>
			))}
		</div>
	);
}

export function RecentReviews() {
	return (
		<Card className="col-span-full lg:col-span-2">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Recent reviews</CardTitle>
				<Button variant="outline" size="sm">
					View all
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{recentReviews.map((review) => (
					<div
						key={review.id}
						className="flex flex-col gap-3 rounded-lg border border-border p-4"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
									{review.author
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</div>
								<div>
									<div className="font-medium">{review.author}</div>
									<div className="flex items-center gap-2">
										<StarRating rating={review.rating} />
										<span className="text-xs text-muted-foreground">
											{review.date}
										</span>
									</div>
								</div>
							</div>
							{review.responded ? (
								<Badge variant="secondary" className="shrink-0">
									Responded
								</Badge>
							) : (
								<Badge
									variant={review.rating <= 2 ? "destructive" : "default"}
									className="shrink-0"
								>
									{review.rating <= 2 ? "Urgent" : "Pending"}
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground line-clamp-2">
							{review.text}
						</p>
						{!review.responded && (
							<Button size="sm" className="w-fit">
								<MessageSquare className="mr-2 h-4 w-4" />
								Respond with AI
							</Button>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
