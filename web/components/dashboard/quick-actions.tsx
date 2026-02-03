"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, QrCode, Send, Users } from "lucide-react";
import { useState } from "react";
import { QRCodeGenerator } from "./qr-code-generator";

interface ActionItem {
	icon: React.ElementType;
	label: string;
	description: string;
	variant: "default" | "outline";
	action?: string;
}

const actions: ActionItem[] = [
	{
		icon: Send,
		label: "Send request",
		description: "SMS, Email or WhatsApp",
		variant: "default",
		action: "send-request",
	},
	{
		icon: QrCode,
		label: "Generate QR",
		description: "For your location",
		variant: "outline",
		action: "generate-qr",
	},
	{
		icon: LinkIcon,
		label: "Copy link",
		description: "Share your link",
		variant: "outline",
		action: "copy-link",
	},
	{
		icon: Users,
		label: "Add contact",
		description: "New customer",
		variant: "outline",
		action: "add-contact",
	},
];

export function QuickActions() {
	const [showQRGenerator, setShowQRGenerator] = useState(false);

	const handleAction = (action: string | undefined) => {
		switch (action) {
			case "generate-qr":
				setShowQRGenerator(true);
				break;
			case "copy-link":
				// TODO: Implement copy review link
				break;
			case "send-request":
				// TODO: Implement send request
				break;
			case "add-contact":
				// TODO: Implement add contact
				break;
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Quick actions</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 sm:grid-cols-2">
					{actions.map((action) => (
						<Button
							key={action.label}
							variant={action.variant}
							className="h-auto flex-col items-start gap-1 p-4 overflow-hidden"
							onClick={() => handleAction(action.action)}
						>
							<div className="flex items-center gap-2 w-full min-w-0">
								<action.icon className="h-4 w-4 shrink-0" />
								<span className="font-medium truncate">{action.label}</span>
							</div>
							<span className="text-xs font-normal text-muted-foreground truncate w-full">
								{action.description}
							</span>
						</Button>
					))}
				</CardContent>
			</Card>

			<QRCodeGenerator
				open={showQRGenerator}
				onOpenChange={setShowQRGenerator}
			/>
		</>
	);
}
