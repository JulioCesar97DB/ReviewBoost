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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { isMockMode } from "@/lib/config";
import { MockContactsService, type MockContact } from "@/lib/mock";
import {
	Edit,
	Loader2,
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
import { useCallback, useEffect, useState } from "react";

function getTagColor(tag: string) {
	switch (tag.toLowerCase()) {
		case "vip":
			return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
		case "repeat-customer":
			return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
		default:
			return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
	}
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function formatRelativeTime(dateString: string | undefined): string {
	if (!dateString) return "Never";
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "1 day ago";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
	}
	const months = Math.floor(diffDays / 30);
	return `${months} month${months > 1 ? "s" : ""} ago`;
}

interface ContactDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	contact?: MockContact | null;
	onSubmit: (data: {
		name: string;
		email: string;
		phone?: string;
		tags?: string[];
	}) => Promise<void>;
}

function ContactDialog({
	open,
	onOpenChange,
	contact,
	onSubmit,
}: ContactDialogProps) {
	const [name, setName] = useState(contact?.name || "");
	const [email, setEmail] = useState(contact?.email || "");
	const [phone, setPhone] = useState(contact?.phone || "");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (contact) {
			setName(contact.name);
			setEmail(contact.email);
			setPhone(contact.phone || "");
		} else {
			setName("");
			setEmail("");
			setPhone("");
		}
	}, [contact]);

	const handleSubmit = async () => {
		if (!name || !email) return;
		setLoading(true);
		try {
			await onSubmit({
				name,
				email,
				phone: phone || undefined,
			});
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{contact ? "Edit Contact" : "Add New Contact"}
					</DialogTitle>
					<DialogDescription>
						{contact
							? "Update the contact information."
							: "Add a new contact to your list."}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="John Doe"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="john@example.com"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone (optional)</Label>
						<Input
							id="phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="+1 234 567 8900"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading || !name || !email}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{contact ? "Save Changes" : "Add Contact"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function ContactsPage() {
	const [contacts, setContacts] = useState<MockContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [showContactDialog, setShowContactDialog] = useState(false);
	const [editingContact, setEditingContact] = useState<MockContact | null>(
		null
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchContacts = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const data = await MockContactsService.getAll();
				setContacts(data);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchContacts();
	}, [fetchContacts]);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);
		if (isMockMode()) {
			if (query.trim()) {
				const results = await MockContactsService.search(query);
				setContacts(results);
			} else {
				const all = await MockContactsService.getAll();
				setContacts(all);
			}
		}
	};

	const handleAddContact = async (data: {
		name: string;
		email: string;
		phone?: string;
	}) => {
		if (isMockMode()) {
			const newContact = await MockContactsService.create(data);
			setContacts((prev) => [newContact, ...prev]);
		}
	};

	const handleEditContact = async (data: {
		name: string;
		email: string;
		phone?: string;
	}) => {
		if (!editingContact) return;
		if (isMockMode()) {
			const updated = await MockContactsService.update(editingContact.id, data);
			if (updated) {
				setContacts((prev) =>
					prev.map((c) => (c.id === editingContact.id ? updated : c))
				);
			}
		}
		setEditingContact(null);
	};

	const handleDeleteContact = async (id: string) => {
		if (!confirm("Are you sure you want to delete this contact?")) return;
		setDeletingId(id);
		try {
			if (isMockMode()) {
				const success = await MockContactsService.delete(id);
				if (success) {
					setContacts((prev) => prev.filter((c) => c.id !== id));
				}
			}
		} finally {
			setDeletingId(null);
		}
	};

	const totalContacts = contacts.length;
	const contactsWithReviews = contacts.filter((c) => c.review_count > 0).length;
	const totalReviews = contacts.reduce((sum, c) => sum + c.review_count, 0);

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
					<Button onClick={() => setShowContactDialog(true)}>
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
								{contacts.length} contacts found
							</CardDescription>
						</div>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search contacts..."
								className="pl-9 sm:w-64"
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : (
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
									{contacts.length > 0 ? (
										contacts.map((contact) => (
											<TableRow key={contact.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
															{contact.name.charAt(0)}
														</div>
														<div>
															<p className="font-medium">{contact.name}</p>
															<p className="text-xs text-muted-foreground">
																Added {formatDate(contact.created_at)}
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
														{contact.tags?.map((tag) => (
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
															{contact.review_count}
														</span>
													</div>
												</TableCell>
												<TableCell>
													<span className="text-sm text-muted-foreground">
														{formatRelativeTime(contact.last_contacted_at)}
													</span>
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
																<DropdownMenuItem
																	onClick={() => {
																		setEditingContact(contact);
																		setShowContactDialog(true);
																	}}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuItem>
																	<Send className="mr-2 h-4 w-4" />
																	Send Request
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	className="text-destructive"
																	onClick={() =>
																		handleDeleteContact(contact.id)
																	}
																	disabled={deletingId === contact.id}
																>
																	{deletingId === contact.id ? (
																		<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	) : (
																		<Trash2 className="mr-2 h-4 w-4" />
																	)}
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
					)}
				</CardContent>
			</Card>

			<ContactDialog
				open={showContactDialog}
				onOpenChange={(open) => {
					setShowContactDialog(open);
					if (!open) setEditingContact(null);
				}}
				contact={editingContact}
				onSubmit={editingContact ? handleEditContact : handleAddContact}
			/>
		</div>
	);
}
