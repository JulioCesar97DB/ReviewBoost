import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, QrCode, Send, Users } from "lucide-react";

const actions = [
	{
		icon: Send,
		label: "Send request",
		description: "SMS, Email or WhatsApp",
		variant: "default" as const,
	},
	{
		icon: QrCode,
		label: "Generate QR",
		description: "For your location",
		variant: "outline" as const,
	},
	{
		icon: LinkIcon,
		label: "Copy link",
		description: "Share your link",
		variant: "outline" as const,
	},
	{
		icon: Users,
		label: "Add contact",
		description: "New customer",
		variant: "outline" as const,
	},
];

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick actions</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-3 sm:grid-cols-2">
				{actions.map((action) => (
					<Button
						key={action.label}
						variant={action.variant}
						className="h-auto flex-col items-start gap-1 p-4"
					>
						<div className="flex items-center gap-2">
							<action.icon className="h-4 w-4" />
							<span className="font-medium">{action.label}</span>
						</div>
						<span className="text-xs font-normal text-muted-foreground">
							{action.description}
						</span>
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
