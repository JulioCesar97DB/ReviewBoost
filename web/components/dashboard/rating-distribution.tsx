import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const distribution = [
	{ rating: 5, count: 89, percentage: 65 },
	{ rating: 4, count: 32, percentage: 23 },
	{ rating: 3, count: 10, percentage: 7 },
	{ rating: 2, count: 4, percentage: 3 },
	{ rating: 1, count: 2, percentage: 2 },
];

export function RatingDistribution() {
	const total = distribution.reduce((acc, item) => acc + item.count, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rating distribution</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{distribution.map((item) => (
					<div key={item.rating} className="flex items-center gap-3">
						<div className="flex w-12 items-center gap-1">
							<span className="text-sm font-medium">{item.rating}</span>
							<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
						</div>
						<div className="flex-1">
							<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{ width: `${item.percentage}%` }}
								/>
							</div>
						</div>
						<div className="w-12 text-right text-sm text-muted-foreground">
							{item.count}
						</div>
					</div>
				))}
				<div className="mt-4 border-t border-border pt-4 text-center text-sm text-muted-foreground">
					Total: <span className="font-medium text-foreground">{total}</span>{" "}
					reviews
				</div>
			</CardContent>
		</Card>
	);
}
