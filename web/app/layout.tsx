import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	display: "swap",
	subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "ReviewBoost - Get More 5-Star Reviews for Your Business",
		template: "%s | ReviewBoost",
	},
	description:
		"Get more positive Google reviews, respond with AI, and monitor your reputation. All from $19/month.",
	keywords: [
		"google reviews",
		"review management",
		"online reputation",
		"local business",
		"customer reviews",
	],
	authors: [{ name: "ReviewBoost" }],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "ReviewBoost",
		title: "ReviewBoost - Get More 5-Star Reviews for Your Business",
		description:
			"Get more positive Google reviews, respond with AI, and monitor your reputation.",
	},
	twitter: {
		card: "summary_large_image",
		title: "ReviewBoost - Get More 5-Star Reviews for Your Business",
		description:
			"Get more positive Google reviews, respond with AI, and monitor your reputation.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
