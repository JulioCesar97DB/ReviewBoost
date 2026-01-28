import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquare, Star, TrendingUp } from "lucide-react";

const stats = [
	{
		title: "Current rating",
		value: "4.8",
		change: "+0.3",
		changeType: "positive" as const,
		icon: Star,
		description: "on Google",
	},
	{
		title: "Reviews this month",
		value: "47",
		change: "+23%",
		changeType: "positive" as const,
		icon: MessageSquare,
		description: "vs last month",
	},
	{
		title: "Response rate",
		value: "94%",
		change: "+5%",
		changeType: "positive" as const,
		icon: CheckCircle,
		description: "responded",
	},
	{
		title: "Requests sent",
		value: "156",
		change: "+12%",
		changeType: "positive" as const,
		icon: TrendingUp,
		description: "this month",
	},
];

export function StatsCards() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							{stat.title}
						</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-baseline gap-2">
							<div className="text-2xl font-bold">{stat.value}</div>
							{stat.title === "Current rating" && (
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-3 w-3 ${i < Math.round(parseFloat(stat.value))
													? "fill-yellow-500 text-yellow-500"
													: "text-muted"
												}`}
										/>
									))}
								</div>
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							<span
								className={
									stat.changeType === "positive"
										? "text-green-600"
										: "text-red-600"
								}
							>
								{stat.change}
							</span>{" "}
							{stat.description}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
