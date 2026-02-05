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
	FlatList,
	Pressable,
	StyleSheet,
	Text,
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

function ContactCard({ contact }: { contact: MockContact }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

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
				<Pressable
					style={[styles.sendButton, { backgroundColor: colors.primary }]}
				>
					<Ionicons name="paper-plane" size={14} color={colors.primaryForeground} />
					<Text style={[styles.sendText, { color: colors.primaryForeground }]}>
						Send Request
					</Text>
				</Pressable>
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
					<Button size="icon" style={styles.addButton}>
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
					renderItem={({ item }) => <ContactCard contact={item} />}
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
								<Button style={styles.emptyButton}>
									Add Your First Contact
								</Button>
							)}
						</View>
					}
				/>
			)}
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
});
