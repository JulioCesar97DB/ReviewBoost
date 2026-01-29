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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Edit,
	Mail,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Send,
	Star,
	Trash2,
	Upload,
	Users,
} from "lucide-react";
import { useState } from "react";

interface Contact {
	id: string;
	name: string;
	email: string;
	phone?: string;
	tags: string[];
	lastContacted?: string;
	reviewCount: number;
	createdAt: string;
}

const mockContacts: Contact[] = [
	{
		id: "1",
		name: "Alice Johnson",
		email: "alice@example.com",
		phone: "+1 234 567 8901",
		tags: ["VIP", "Regular"],
		lastContacted: "2 days ago",
		reviewCount: 2,
		createdAt: "Jan 15, 2026",
	},
	{
		id: "2",
		name: "Bob Smith",
		email: "bob@example.com",
		phone: "+1 234 567 8902",
		tags: ["New"],
		lastContacted: "1 week ago",
		reviewCount: 1,
		createdAt: "Jan 10, 2026",
	},
	{
		id: "3",
		name: "Carol Williams",
		email: "carol@example.com",
		tags: ["Regular"],
		lastContacted: "3 weeks ago",
		reviewCount: 0,
		createdAt: "Dec 20, 2025",
	},
	{
		id: "4",
		name: "Dan Brown",
		email: "dan@example.com",
		phone: "+1 234 567 8904",
		tags: ["VIP"],
		reviewCount: 3,
		createdAt: "Dec 15, 2025",
	},
	{
		id: "5",
		name: "Eva Martinez",
		email: "eva@example.com",
		phone: "+1 234 567 8905",
		tags: ["Regular"],
		lastContacted: "1 month ago",
		reviewCount: 1,
		createdAt: "Nov 28, 2025",
	},
	{
		id: "6",
		name: "Frank Lee",
		email: "frank@example.com",
		tags: ["New"],
		reviewCount: 0,
		createdAt: "Jan 20, 2026",
	},
	{
		id: "7",
		name: "Grace Kim",
		email: "grace@example.com",
		phone: "+1 234 567 8907",
		tags: ["VIP", "Regular"],
		lastContacted: "5 days ago",
		reviewCount: 4,
		createdAt: "Oct 10, 2025",
	},
];

function getTagColor(tag: string) {
	switch (tag.toLowerCase()) {
		case "vip":
			return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
		case "regular":
			return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
		case "new":
			return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
		default:
			return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
	}
}

export default function ContactsPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredContacts = mockContacts.filter(
		(contact) =>
			contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			contact.phone?.includes(searchQuery)
	);

	const totalContacts = mockContacts.length;
	const contactsWithReviews = mockContacts.filter(
		(c) => c.reviewCount > 0
	).length;
	const totalReviews = mockContacts.reduce((sum, c) => sum + c.reviewCount, 0);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
						Contacts
					</h1>
					<p className="text-muted-foreground">
						Manage your customer contacts for review requests.
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<Upload className="mr-2 h-4 w-4" />
						Import CSV
					</Button>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Contact
					</Button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Users className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Contacts</p>
								<p className="text-2xl font-bold">{totalContacts}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
								<Star className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Left Reviews</p>
								<p className="text-2xl font-bold">{contactsWithReviews}</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
								<Star className="h-6 w-6 text-amber-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Reviews</p>
								<p className="text-2xl font-bold">{totalReviews}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<CardTitle>All Contacts</CardTitle>
							<CardDescription>
								{filteredContacts.length} contacts found
							</CardDescription>
						</div>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search contacts..."
								className="pl-9 sm:w-64"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Contact Info</TableHead>
									<TableHead>Tags</TableHead>
									<TableHead>Reviews</TableHead>
									<TableHead>Last Contacted</TableHead>
									<TableHead className="w-[100px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredContacts.length > 0 ? (
									filteredContacts.map((contact) => (
										<TableRow key={contact.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
														{contact.name.charAt(0)}
													</div>
													<div>
														<p className="font-medium">{contact.name}</p>
														<p className="text-xs text-muted-foreground">
															Added {contact.createdAt}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm">
														<Mail className="h-3 w-3 text-muted-foreground" />
														{contact.email}
													</div>
													{contact.phone && (
														<div className="flex items-center gap-2 text-sm text-muted-foreground">
															<Phone className="h-3 w-3" />
															{contact.phone}
														</div>
													)}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													{contact.tags.map((tag) => (
														<Badge
															key={tag}
															variant="secondary"
															className={getTagColor(tag)}
														>
															{tag}
														</Badge>
													))}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Star className="h-4 w-4 fill-[hsl(var(--star))] text-[hsl(var(--star))]" />
													<span className="font-medium">
														{contact.reviewCount}
													</span>
												</div>
											</TableCell>
											<TableCell>
												{contact.lastContacted ? (
													<span className="text-sm text-muted-foreground">
														{contact.lastContacted}
													</span>
												) : (
													<span className="text-sm text-muted-foreground">
														Never
													</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
														title="Send request"
													>
														<Send className="h-4 w-4" />
													</Button>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem>
																<Edit className="mr-2 h-4 w-4" />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Send className="mr-2 h-4 w-4" />
																Send Request
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																<Trash2 className="mr-2 h-4 w-4" />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} className="h-32 text-center">
											<div className="flex flex-col items-center justify-center">
												<Users className="mb-2 h-8 w-8 text-muted-foreground" />
												<p className="text-muted-foreground">
													No contacts found
												</p>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
