"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Download, Loader2, Palette, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";

interface QRCodeGeneratorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

interface Business {
	id: string;
	name: string;
	google_place_id: string | null;
}

const DEFAULT_COLORS = [
	{ fg: "#000000", bg: "#ffffff", name: "Classic" },
	{ fg: "#f97316", bg: "#fff7ed", name: "Orange" },
	{ fg: "#1e40af", bg: "#eff6ff", name: "Blue" },
	{ fg: "#15803d", bg: "#f0fdf4", name: "Green" },
	{ fg: "#7c3aed", bg: "#faf5ff", name: "Purple" },
	{ fg: "#dc2626", bg: "#fef2f2", name: "Red" },
];

export function QRCodeGenerator({
	open,
	onOpenChange,
	onSuccess,
}: QRCodeGeneratorProps) {
	const [business, setBusiness] = useState<Business | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedColor, setSelectedColor] = useState(0);
	const [size, setSize] = useState(256);
	const qrRef = useRef<HTMLDivElement>(null);

	const supabase = createClient();

	const fetchBusiness = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await supabase
				.from("businesses")
				.select("id, name, google_place_id")
				.eq("user_id", user.id)
				.single();

			if (data) {
				setBusiness(data);
				setName(`${data.name} QR Code`);
			}
		} catch (error) {
			console.error("Error fetching business:", error);
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	useEffect(() => {
		if (open) {
			fetchBusiness();
		}
	}, [open, fetchBusiness]);

	const reviewUrl = business?.google_place_id
		? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
		: null;

	const handleDownloadPNG = () => {
		const svg = qrRef.current?.querySelector("svg");
		if (!svg) return;

		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		canvas.width = size;
		canvas.height = size;

		img.onload = () => {
			ctx?.drawImage(img, 0, 0);
			const pngUrl = canvas.toDataURL("image/png");
			const downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = `${name.replace(/\s+/g, "-").toLowerCase()}.png`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		};

		img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
	};

	const handleDownloadSVG = () => {
		const svg = qrRef.current?.querySelector("svg");
		if (!svg) return;

		const svgData = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([svgData], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = `${name.replace(/\s+/g, "-").toLowerCase()}.svg`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		URL.revokeObjectURL(url);
	};

	const handleSave = async () => {
		if (!business || !reviewUrl) return;

		setSaving(true);
		try {
			const svg = qrRef.current?.querySelector("svg");
			const svgData = svg
				? new XMLSerializer().serializeToString(svg)
				: null;

			const { error } = await supabase.from("qr_codes").insert({
				business_id: business.id,
				name,
				description: description || null,
				review_url: reviewUrl,
				qr_svg: svgData,
				style: {
					size,
					color: DEFAULT_COLORS[selectedColor].fg,
					backgroundColor: DEFAULT_COLORS[selectedColor].bg,
				},
			});

			if (error) throw error;

			onOpenChange(false);
			onSuccess?.();
		} catch (error) {
			console.error("Error saving QR code:", error);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-md">
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (!business?.google_place_id) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Google Business Required</DialogTitle>
						<DialogDescription>
							You need to connect your Google Business Profile before generating
							a QR code for reviews.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<QrCode className="h-5 w-5" />
						Generate QR Code
					</DialogTitle>
					<DialogDescription>
						Create a QR code that links directly to your Google review page.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="flex justify-center">
						<div
							ref={qrRef}
							className="rounded-lg p-4"
							style={{ backgroundColor: DEFAULT_COLORS[selectedColor].bg }}
						>
							<QRCodeSVG
								value={reviewUrl ?? ""}
								size={size}
								fgColor={DEFAULT_COLORS[selectedColor].fg}
								bgColor={DEFAULT_COLORS[selectedColor].bg}
								level="H"
								includeMargin={false}
							/>
						</div>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="qr-name">Name</Label>
							<Input
								id="qr-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="My QR Code"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="qr-description">Description (optional)</Label>
							<Input
								id="qr-description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Front counter display"
							/>
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Palette className="h-4 w-4" />
								Color Theme
							</Label>
							<div className="flex flex-wrap gap-2">
								{DEFAULT_COLORS.map((color, index) => (
									<button
										key={color.name}
										type="button"
										onClick={() => setSelectedColor(index)}
										className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${selectedColor === index
											? "border-primary ring-2 ring-primary ring-offset-2"
											: "border-transparent hover:border-muted-foreground/30"
											}`}
										style={{ backgroundColor: color.bg }}
										title={color.name}
									>
										<div
											className="h-4 w-4 rounded-full"
											style={{ backgroundColor: color.fg }}
										/>
									</button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Size: {size}px</Label>
							<input
								type="range"
								min="128"
								max="512"
								step="32"
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								className="w-full"
							/>
						</div>
					</div>
				</div>

				<DialogFooter className="flex-col gap-2 sm:flex-row">
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleDownloadSVG}>
							<Download className="mr-2 h-4 w-4" />
							SVG
						</Button>
						<Button variant="outline" onClick={handleDownloadPNG}>
							<Download className="mr-2 h-4 w-4" />
							PNG
						</Button>
					</div>
					<Button onClick={handleSave} disabled={saving || !name}>
						{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save QR Code
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
