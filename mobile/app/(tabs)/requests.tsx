import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isMockMode } from '@/lib/config';
import {
	MockContactsService,
	MockReviewRequestsService,
	type MockContact,
	type MockReviewRequest,
} from '@/lib/mock';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'all' | 'pending' | 'sent' | 'opened' | 'reviewed';

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) {
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		if (diffHours === 0) {
			const diffMins = Math.floor(diffMs / (1000 * 60));
			return `${diffMins}m ago`;
		}
		return `${diffHours}h ago`;
	} else if (diffDays === 1) {
		return '1d ago';
	} else if (diffDays < 7) {
		return `${diffDays}d ago`;
	} else {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks}w ago`;
	}
}

function getStatusConfig(status: string, colors: typeof Colors.light) {
	switch (status) {
		case 'pending':
			return { color: colors.warning, label: 'Pending', icon: 'time' as const };
		case 'sent':
			return { color: colors.primary, label: 'Sent', icon: 'paper-plane' as const };
		case 'opened':
			return { color: colors.primary, label: 'Opened', icon: 'eye' as const };
		case 'clicked':
			return { color: '#8b5cf6', label: 'Clicked', icon: 'link' as const };
		case 'reviewed':
			return { color: colors.success, label: 'Reviewed', icon: 'checkmark-circle' as const };
		case 'expired':
			return { color: colors.destructive, label: 'Expired', icon: 'close-circle' as const };
		default:
			return { color: colors.mutedForeground, label: status, icon: 'help-circle' as const };
	}
}

interface NewRequestModalProps {
	visible: boolean;
	contacts: MockContact[];
	onClose: () => void;
	onSubmit: (contactId: string, channel: 'email' | 'sms' | 'whatsapp', message?: string) => Promise<void>;
}

function NewRequestModal({ visible, contacts, onClose, onSubmit }: NewRequestModalProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [contactId, setContactId] = useState('');
	const [channel, setChannel] = useState<'email' | 'sms' | 'whatsapp'>('email');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!visible) {
			setContactId('');
			setChannel('email');
			setMessage('');
		}
	}, [visible]);

	const handleSubmit = async () => {
		if (!contactId) return;
		setLoading(true);
		try {
			await onSubmit(contactId, channel, message || undefined);
			onClose();
		} finally {
			setLoading(false);
		}
	};

	const selectedContact = contacts.find((c) => c.id === contactId);

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
						New Review Request
					</Text>
					<Pressable onPress={onClose} style={styles.closeButton}>
						<Ionicons name="close" size={24} color={colors.foreground} />
					</Pressable>
				</View>

				<ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
					<View style={styles.formSection}>
						<Text style={[styles.label, { color: colors.foreground }]}>
							Select Contact
						</Text>
						<View
							style={[
								styles.pickerContainer,
								{ backgroundColor: colors.card, borderColor: colors.border },
							]}
						>
							<Picker
								selectedValue={contactId}
								onValueChange={(value) => setContactId(value)}
								style={{ color: colors.foreground }}
							>
								<Picker.Item label="Choose a contact..." value="" />
								{contacts.map((contact) => (
									<Picker.Item
										key={contact.id}
										label={`${contact.name} (${contact.email})`}
										value={contact.id}
									/>
								))}
							</Picker>
						</View>
						{selectedContact && (
							<View style={[styles.contactPreview, { backgroundColor: colors.muted }]}>
								<View style={[styles.contactAvatar, { backgroundColor: colors.accent }]}>
									<Text style={[styles.contactAvatarText, { color: colors.primary }]}>
										{selectedContact.name.charAt(0)}
									</Text>
								</View>
								<View>
									<Text style={[styles.contactName, { color: colors.foreground }]}>
										{selectedContact.name}
									</Text>
									<Text style={[styles.contactEmail, { color: colors.mutedForeground }]}>
										{selectedContact.email}
									</Text>
								</View>
							</View>
						)}
					</View>

					<View style={styles.formSection}>
						<Text style={[styles.label, { color: colors.foreground }]}>
							Send Via
						</Text>
						<View style={styles.channelOptions}>
							{(['email', 'sms', 'whatsapp'] as const).map((ch) => (
								<Pressable
									key={ch}
									onPress={() => setChannel(ch)}
									style={[
										styles.channelOption,
										{
											backgroundColor: channel === ch ? colors.primary : colors.secondary,
											borderColor: channel === ch ? colors.primary : colors.border,
										},
									]}
								>
									<Ionicons
										name={ch === 'email' ? 'mail' : ch === 'sms' ? 'chatbubble' : 'logo-whatsapp'}
										size={20}
										color={channel === ch ? colors.primaryForeground : colors.foreground}
									/>
									<Text
										style={[
											styles.channelText,
											{
												color: channel === ch ? colors.primaryForeground : colors.foreground,
											},
										]}
									>
										{ch === 'email' ? 'Email' : ch === 'sms' ? 'SMS' : 'WhatsApp'}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					<View style={styles.formSection}>
						<Text style={[styles.label, { color: colors.foreground }]}>
							Custom Message (optional)
						</Text>
						<TextInput
							style={[
								styles.messageInput,
								{
									backgroundColor: colors.card,
									borderColor: colors.border,
									color: colors.foreground,
								},
							]}
							placeholder="Add a personal touch to your request..."
							placeholderTextColor={colors.mutedForeground}
							value={message}
							onChangeText={setMessage}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
					</View>
				</ScrollView>

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
						disabled={loading || !contactId}
						style={[
							styles.submitButton,
							{ backgroundColor: colors.primary },
							(!contactId || loading) && { opacity: 0.5 },
						]}
					>
						{loading ? (
							<ActivityIndicator size="small" color={colors.primaryForeground} />
						) : (
							<>
								<Ionicons name="paper-plane" size={18} color={colors.primaryForeground} />
								<Text style={[styles.submitButtonText, { color: colors.primaryForeground }]}>
									Send Request
								</Text>
							</>
						)}
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

function RequestCard({
	request,
	onResend,
	resending,
}: {
	request: MockReviewRequest;
	onResend: (id: string) => void;
	resending: boolean;
}) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const statusConfig = getStatusConfig(request.status, colors);

	return (
		<Card style={styles.requestCard}>
			<View style={styles.requestHeader}>
				<View
					style={[styles.avatar, { backgroundColor: colors.accent }]}
				>
					<Text style={[styles.avatarText, { color: colors.primary }]}>
						{request.contact_name.charAt(0)}
					</Text>
				</View>
				<View style={styles.requestInfo}>
					<Text style={[styles.contactNameCard, { color: colors.foreground }]}>
						{request.contact_name}
					</Text>
					<Text style={[styles.contactEmailCard, { color: colors.mutedForeground }]}>
						{request.contact_email}
					</Text>
				</View>
				<View style={styles.requestRight}>
					<Text style={[styles.sentAt, { color: colors.mutedForeground }]}>
						{formatRelativeTime(request.sent_at)}
					</Text>
					<View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
						<Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
						<Text style={[styles.statusText, { color: statusConfig.color }]}>
							{statusConfig.label}
						</Text>
					</View>
				</View>
			</View>
			{(request.status === 'pending' || request.status === 'expired') && (
				<View style={styles.actions}>
					<Pressable
						style={[styles.actionButton, { backgroundColor: colors.secondary }]}
						onPress={() => onResend(request.id)}
						disabled={resending}
					>
						{resending ? (
							<ActivityIndicator size="small" color={colors.foreground} />
						) : (
							<>
								<Ionicons name="refresh" size={16} color={colors.foreground} />
								<Text style={[styles.actionText, { color: colors.foreground }]}>
									Resend
								</Text>
							</>
						)}
					</Pressable>
				</View>
			)}
		</Card>
	);
}

export default function RequestsScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [filter, setFilter] = useState<FilterType>('all');
	const [requests, setRequests] = useState<MockReviewRequest[]>([]);
	const [contacts, setContacts] = useState<MockContact[]>([]);
	const [loading, setLoading] = useState(true);
	const [resendingId, setResendingId] = useState<string | null>(null);
	const [newRequestModalVisible, setNewRequestModalVisible] = useState(false);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const [requestsData, contactsData] = await Promise.all([
					MockReviewRequestsService.getAll(),
					MockContactsService.getAll(),
				]);
				setRequests(requestsData);
				setContacts(contactsData);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleResend = async (id: string) => {
		setResendingId(id);
		try {
			if (isMockMode()) {
				const updated = await MockReviewRequestsService.resend(id);
				setRequests((prev) =>
					prev.map((r) => (r.id === id ? updated : r))
				);
			}
		} finally {
			setResendingId(null);
		}
	};

	const handleNewRequest = async (
		contactId: string,
		channel: 'email' | 'sms' | 'whatsapp',
		message?: string
	) => {
		if (isMockMode()) {
			const newRequest = await MockReviewRequestsService.send({
				contact_id: contactId,
				channel,
				message,
			});
			setRequests((prev) => [newRequest, ...prev]);
		}
	};

	const filteredRequests = requests.filter((request) => {
		if (filter === 'all') return true;
		return request.status === filter;
	});

	const filters: { key: FilterType; label: string }[] = [
		{ key: 'all', label: 'All' },
		{ key: 'pending', label: 'Pending' },
		{ key: 'sent', label: 'Sent' },
		{ key: 'opened', label: 'Opened' },
		{ key: 'reviewed', label: 'Reviewed' },
	];

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['left', 'right']}
		>
			<View style={styles.headerSection}>
				<Button
					style={styles.newRequestButton}
					onPress={() => setNewRequestModalVisible(true)}
				>
					<View style={styles.buttonContent}>
						<Ionicons name="add" size={20} color={colors.primaryForeground} />
						<Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
							New Request
						</Text>
					</View>
				</Button>
			</View>

			<View style={styles.filterContainer}>
				{filters.map((f) => (
					<Pressable
						key={f.key}
						onPress={() => setFilter(f.key)}
						style={[
							styles.filterButton,
							{
								backgroundColor:
									filter === f.key ? colors.primary : colors.secondary,
							},
						]}
					>
						<Text
							style={[
								styles.filterText,
								{
									color:
										filter === f.key
											? colors.primaryForeground
											: colors.foreground,
								},
							]}
						>
							{f.label}
						</Text>
					</Pressable>
				))}
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
				</View>
			) : (
				<FlatList
					data={filteredRequests}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<RequestCard
							request={item}
							onResend={handleResend}
							resending={resendingId === item.id}
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
								name="paper-plane-outline"
								size={48}
								color={colors.mutedForeground}
							/>
							<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
								No requests found
							</Text>
						</View>
					}
				/>
			)}

			<NewRequestModal
				visible={newRequestModalVisible}
				contacts={contacts}
				onClose={() => setNewRequestModalVisible(false)}
				onSubmit={handleNewRequest}
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
		paddingTop: 12,
	},
	newRequestButton: {
		width: '100%',
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
	filterContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 8,
	},
	filterButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
	},
	filterText: {
		fontSize: 13,
		fontWeight: '500',
	},
	listContent: {
		padding: 16,
		paddingTop: 0,
		gap: 12,
		paddingBottom: 100,
	},
	requestCard: {
		gap: 12,
	},
	requestHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 18,
		fontWeight: '600',
	},
	requestInfo: {
		flex: 1,
		marginLeft: 12,
	},
	contactNameCard: {
		fontSize: 16,
		fontWeight: '600',
	},
	contactEmailCard: {
		fontSize: 13,
		marginTop: 2,
	},
	requestRight: {
		alignItems: 'flex-end',
		gap: 4,
	},
	sentAt: {
		fontSize: 12,
	},
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 10,
	},
	statusText: {
		fontSize: 11,
		fontWeight: '500',
	},
	actions: {
		flexDirection: 'row',
		gap: 8,
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
	},
	actionText: {
		fontSize: 13,
		fontWeight: '500',
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
	modalContent: {
		flex: 1,
	},
	formSection: {
		marginBottom: 24,
		gap: 8,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
	},
	pickerContainer: {
		borderWidth: 1,
		borderRadius: 12,
		overflow: 'hidden',
	},
	contactPreview: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 10,
		gap: 12,
		marginTop: 8,
	},
	contactAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contactAvatarText: {
		fontSize: 16,
		fontWeight: '600',
	},
	contactName: {
		fontSize: 15,
		fontWeight: '600',
	},
	contactEmail: {
		fontSize: 13,
	},
	channelOptions: {
		flexDirection: 'row',
		gap: 10,
	},
	channelOption: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		paddingVertical: 12,
		borderRadius: 10,
		borderWidth: 1,
	},
	channelText: {
		fontSize: 14,
		fontWeight: '500',
	},
	messageInput: {
		borderWidth: 1,
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		lineHeight: 22,
		minHeight: 100,
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 14,
		borderRadius: 10,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
