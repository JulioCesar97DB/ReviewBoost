"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
	Download,
	ExternalLink,
	Loader2,
	Plus,
	QrCode,
	ScanLine,
	Trash2
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { QRCodeGenerator } from "./qr-code-generator";

interface QRCodeItem {
	id: string;
	name: string;
	description: string | null;
	review_url: string;
	qr_svg: string | null;
	scan_count: number;
	is_active: boolean;
	created_at: string;
	style: {
		size: number;
		color: string;
		backgroundColor: string;
	} | null;
}

export function QRCodeList() {
	const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [showGenerator, setShowGenerator] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const supabase = createClient();

	const fetchQRCodes = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data: business } = await supabase
				.from("businesses")
				.select("id")
				.eq("user_id", user.id)
				.single();

			if (!business) return;

			const { data } = await supabase
				.from("qr_codes")
				.select("*")
				.eq("business_id", business.id)
				.order("created_at", { ascending: false });

			if (data) {
				setQrCodes(data);
			}
		} catch (error) {
			console.error("Error fetching QR codes:", error);
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	useEffect(() => {
		fetchQRCodes();
	}, [fetchQRCodes]);

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this QR code?")) return;

		setDeletingId(id);
		try {
			const { error } = await supabase.from("qr_codes").delete().eq("id", id);
			if (error) throw error;
			setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
		} catch (error) {
			console.error("Error deleting QR code:", error);
		} finally {
			setDeletingId(null);
		}
	};

	const handleDownloadSVG = (qrCode: QRCodeItem) => {
		if (!qrCode.qr_svg) return;

		const blob = new Blob([qrCode.qr_svg], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement("a");
		downloadLink.href = url;
		downloadLink.download = `${qrCode.name.replace(/\s+/g, "-").toLowerCase()}.svg`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		URL.revokeObjectURL(url);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<QrCode className="h-5 w-5" />
								QR Codes
							</CardTitle>
							<CardDescription>
								Generate and manage QR codes for your review page.
							</CardDescription>
						</div>
						<Button onClick={() => setShowGenerator(true)}>
							<Plus className="mr-2 h-4 w-4" />
							Generate QR
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{qrCodes.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
							<QrCode className="h-12 w-12 text-muted-foreground/50" />
							<h3 className="mt-4 text-lg font-semibold">No QR Codes Yet</h3>
							<p className="mt-2 text-center text-sm text-muted-foreground">
								Create your first QR code to make it easy for customers to leave
								reviews.
							</p>
							<Button className="mt-4" onClick={() => setShowGenerator(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Generate Your First QR Code
							</Button>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{qrCodes.map((qrCode) => (
								<div
									key={qrCode.id}
									className="group relative rounded-lg border p-4 transition-colors hover:bg-muted/50"
								>
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-3">
											{qrCode.qr_svg ? (
												<div
													className="flex h-16 w-16 items-center justify-center rounded-lg"
													style={{
														backgroundColor:
															qrCode.style?.backgroundColor || "#ffffff",
													}}
													dangerouslySetInnerHTML={{
														__html: qrCode.qr_svg.replace(
															/width="[^"]*"/,
															'width="64"'
														).replace(
															/height="[^"]*"/,
															'height="64"'
														),
													}}
												/>
											) : (
												<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
													<QrCode className="h-8 w-8 text-muted-foreground" />
												</div>
											)}
											<div>
												<h4 className="font-medium">{qrCode.name}</h4>
												{qrCode.description && (
													<p className="text-xs text-muted-foreground">
														{qrCode.description}
													</p>
												)}
												<p className="mt-1 text-xs text-muted-foreground">
													Created {formatDate(qrCode.created_at)}
												</p>
											</div>
										</div>
										<Badge
											variant={qrCode.is_active ? "default" : "secondary"}
											className="shrink-0"
										>
											{qrCode.is_active ? "Active" : "Inactive"}
										</Badge>
									</div>

									<div className="mt-4 flex items-center justify-between">
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<ScanLine className="h-4 w-4" />
											<span>{qrCode.scan_count} scans</span>
										</div>
										<div className="flex gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => window.open(qrCode.review_url, "_blank")}
												title="Open review page"
											>
												<ExternalLink className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleDownloadSVG(qrCode)}
												disabled={!qrCode.qr_svg}
												title="Download SVG"
											>
												<Download className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
												onClick={() => handleDelete(qrCode.id)}
												disabled={deletingId === qrCode.id}
												title="Delete"
											>
												{deletingId === qrCode.id ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Trash2 className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<QRCodeGenerator
				open={showGenerator}
				onOpenChange={setShowGenerator}
				onSuccess={fetchQRCodes}
			/>
		</>
	);
}
