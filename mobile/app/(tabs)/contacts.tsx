import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isMockMode } from '@/lib/config';
import { MockContactsService, type MockContact } from '@/lib/mock';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function formatRelativeTime(dateString: string | undefined): string {
	if (!dateString) return 'Never';
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return '1d ago';
	if (diffDays < 7) return `${diffDays}d ago`;
	if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks}w ago`;
	}
	const months = Math.floor(diffDays / 30);
	return `${months}mo ago`;
}

interface ContactModalProps {
	visible: boolean;
	contact: MockContact | null;
	onClose: () => void;
	onSubmit: (data: { name: string; email: string; phone?: string }) => Promise<void>;
}

function ContactModal({ visible, contact, onClose, onSubmit }: ContactModalProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visible && contact) {
			setName(contact.name);
			setEmail(contact.email);
			setPhone(contact.phone || '');
		} else if (visible) {
			setName('');
			setEmail('');
			setPhone('');
		}
	}, [visible, contact]);

	const handleSubmit = async () => {
		if (!name.trim() || !email.trim()) return;
		setLoading(true);
		try {
			await onSubmit({
				name: name.trim(),
				email: email.trim(),
				phone: phone.trim() || undefined,
			});
			onClose();
		} finally {
			setLoading(false);
		}
	};

	const isValid = name.trim() && email.trim();

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={[styles.modalContainer, { backgroundColor: colors.background }]}
			>
				<View style={styles.modalHeader}>
					<Text style={[styles.modalTitle, { color: colors.foreground }]}>
						{contact ? 'Edit Contact' : 'Add Contact'}
					</Text>
					<Pressable onPress={onClose} style={styles.closeButton}>
						<Ionicons name="close" size={24} color={colors.foreground} />
					</Pressable>
				</View>

				<View style={styles.formContent}>
					<View style={styles.formField}>
						<Text style={[styles.label, { color: colors.foreground }]}>Name</Text>
						<TextInput
							style={[
								styles.textInput,
								{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
							]}
							placeholder="John Doe"
							placeholderTextColor={colors.mutedForeground}
							value={name}
							onChangeText={setName}
							autoCapitalize="words"
						/>
					</View>

					<View style={styles.formField}>
						<Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
						<TextInput
							style={[
								styles.textInput,
								{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
							]}
							placeholder="john@example.com"
							placeholderTextColor={colors.mutedForeground}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
					</View>

					<View style={styles.formField}>
						<Text style={[styles.label, { color: colors.foreground }]}>
							Phone (optional)
						</Text>
						<TextInput
							style={[
								styles.textInput,
								{ backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
							]}
							placeholder="+1 234 567 8900"
							placeholderTextColor={colors.mutedForeground}
							value={phone}
							onChangeText={setPhone}
							keyboardType="phone-pad"
						/>
					</View>
				</View>

				<View style={styles.modalActions}>
					<Pressable
						onPress={onClose}
						style={[styles.cancelButton, { backgroundColor: colors.secondary }]}
					>
						<Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
							Cancel
						</Text>
					</Pressable>
					<Pressable
						onPress={handleSubmit}
						disabled={loading || !isValid}
						style={[
							styles.submitButton,
							{ backgroundColor: colors.primary },
							(!isValid || loading) && { opacity: 0.5 },
						]}
					>
						{loading ? (
							<ActivityIndicator size="small" color={colors.primaryForeground} />
						) : (
							<Text style={[styles.submitButtonText, { color: colors.primaryForeground }]}>
								{contact ? 'Save Changes' : 'Add Contact'}
							</Text>
						)}
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

function ContactCard({
	contact,
	onEdit,
	onDelete,
	deleting,
}: {
	contact: MockContact;
	onEdit: (contact: MockContact) => void;
	onDelete: (id: string) => void;
	deleting: boolean;
}) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const handleDelete = () => {
		Alert.alert(
			'Delete Contact',
			`Are you sure you want to delete ${contact.name}?`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Delete', style: 'destructive', onPress: () => onDelete(contact.id) },
			]
		);
	};

	return (
		<Card style={styles.contactCard}>
			<View style={styles.contactHeader}>
				<View
					style={[styles.avatar, { backgroundColor: colors.accent }]}
				>
					<Text style={[styles.avatarText, { color: colors.primary }]}>
						{contact.name.charAt(0)}
					</Text>
				</View>
				<View style={styles.contactInfo}>
					<Text style={[styles.contactName, { color: colors.foreground }]}>
						{contact.name}
					</Text>
					<Text style={[styles.contactEmail, { color: colors.mutedForeground }]}>
						{contact.email}
					</Text>
					{contact.phone && (
						<Text style={[styles.contactPhone, { color: colors.mutedForeground }]}>
							{contact.phone}
						</Text>
					)}
				</View>
				<View style={styles.contactStats}>
					<View style={[styles.reviewBadge, { backgroundColor: colors.secondary }]}>
						<Ionicons name="star" size={12} color={colors.star} />
						<Text style={[styles.reviewCount, { color: colors.foreground }]}>
							{contact.review_count}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.contactFooter}>
				<Text style={[styles.lastContacted, { color: colors.mutedForeground }]}>
					Last contacted: {formatRelativeTime(contact.last_contacted_at)}
				</Text>
				<View style={styles.contactActions}>
					<Pressable
						style={[styles.iconButton, { backgroundColor: colors.secondary }]}
						onPress={() => onEdit(contact)}
					>
						<Ionicons name="pencil" size={16} color={colors.foreground} />
					</Pressable>
					<Pressable
						style={[styles.iconButton, { backgroundColor: colors.destructive + '15' }]}
						onPress={handleDelete}
						disabled={deleting}
					>
						{deleting ? (
							<ActivityIndicator size="small" color={colors.destructive} />
						) : (
							<Ionicons name="trash" size={16} color={colors.destructive} />
						)}
					</Pressable>
					<Pressable
						style={[styles.sendButton, { backgroundColor: colors.primary }]}
					>
						<Ionicons name="paper-plane" size={14} color={colors.primaryForeground} />
						<Text style={[styles.sendText, { color: colors.primaryForeground }]}>
							Send
						</Text>
					</Pressable>
				</View>
			</View>
		</Card>
	);
}

export default function ContactsScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [searchQuery, setSearchQuery] = useState('');
	const [contacts, setContacts] = useState<MockContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingContact, setEditingContact] = useState<MockContact | null>(null);
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

	const handleAddContact = async (data: { name: string; email: string; phone?: string }) => {
		if (isMockMode()) {
			const newContact = await MockContactsService.create(data);
			setContacts((prev) => [newContact, ...prev]);
		}
	};

	const handleEditContact = async (data: { name: string; email: string; phone?: string }) => {
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

	const openEditModal = (contact: MockContact) => {
		setEditingContact(contact);
		setModalVisible(true);
	};

	const openAddModal = () => {
		setEditingContact(null);
		setModalVisible(true);
	};

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['left', 'right']}
		>
			<View style={styles.headerSection}>
				<View style={styles.searchRow}>
					<View style={styles.searchContainer}>
						<Ionicons
							name="search"
							size={20}
							color={colors.mutedForeground}
							style={styles.searchIcon}
						/>
						<Input
							placeholder="Search contacts..."
							value={searchQuery}
							onChangeText={handleSearch}
							containerStyle={styles.searchInput}
							style={styles.searchInputField}
						/>
					</View>
					<Button size="icon" style={styles.addButton} onPress={openAddModal}>
						<Ionicons name="add" size={24} color={colors.primaryForeground} />
					</Button>
				</View>
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : (
				<FlatList
					data={contacts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<ContactCard
							contact={item}
							onEdit={openEditModal}
							onDelete={handleDeleteContact}
							deleting={deletingId === item.id}
						/>
					)}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					initialNumToRender={10}
					maxToRenderPerBatch={10}
					windowSize={5}
					removeClippedSubviews={true}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Ionicons
								name="people-outline"
								size={48}
								color={colors.mutedForeground}
							/>
							<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
								{searchQuery ? 'No contacts found' : 'No contacts yet'}
							</Text>
							{!searchQuery && (
								<Button style={styles.emptyButton} onPress={openAddModal}>
									Add Your First Contact
								</Button>
							)}
						</View>
					}
				/>
			)}

			<ContactModal
				visible={modalVisible}
				contact={editingContact}
				onClose={() => {
					setModalVisible(false);
					setEditingContact(null);
				}}
				onSubmit={editingContact ? handleEditContact : handleAddContact}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerSection: {
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	searchRow: {
		flexDirection: 'row',
		gap: 12,
	},
	searchContainer: {
		flex: 1,
		position: 'relative',
	},
	searchIcon: {
		position: 'absolute',
		left: 12,
		top: 14,
		zIndex: 1,
	},
	searchInput: {
		flex: 1,
	},
	searchInputField: {
		paddingLeft: 40,
	},
	addButton: {
		width: 48,
		height: 48,
	},
	listContent: {
		padding: 16,
		paddingTop: 0,
		gap: 12,
		paddingBottom: 100,
	},
	contactCard: {
		gap: 12,
	},
	contactHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 20,
		fontWeight: '600',
	},
	contactInfo: {
		flex: 1,
		marginLeft: 12,
	},
	contactName: {
		fontSize: 16,
		fontWeight: '600',
	},
	contactEmail: {
		fontSize: 13,
		marginTop: 2,
	},
	contactPhone: {
		fontSize: 13,
		marginTop: 2,
	},
	contactStats: {
		alignItems: 'flex-end',
	},
	reviewBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
	},
	reviewCount: {
		fontSize: 13,
		fontWeight: '600',
	},
	contactFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	lastContacted: {
		fontSize: 12,
		flex: 1,
	},
	contactActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	iconButton: {
		width: 36,
		height: 36,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sendButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
	},
	sendText: {
		fontSize: 13,
		fontWeight: '600',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48,
		gap: 12,
	},
	emptyText: {
		fontSize: 16,
	},
	emptyButton: {
		marginTop: 8,
	},
	// Modal styles
	modalContainer: {
		flex: 1,
		padding: 16,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
	},
	closeButton: {
		padding: 4,
	},
	formContent: {
		flex: 1,
		gap: 20,
	},
	formField: {
		gap: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
	},
	textInput: {
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
	},
	modalActions: {
		flexDirection: 'row',
		gap: 12,
		paddingVertical: 16,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
	submitButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
