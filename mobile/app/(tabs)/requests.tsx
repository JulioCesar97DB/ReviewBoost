import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isMockMode } from '@/lib/config';
import { MockReviewRequestsService, type MockReviewRequest } from '@/lib/mock';
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
					<Text style={[styles.contactName, { color: colors.foreground }]}>
						{request.contact_name}
					</Text>
					<Text style={[styles.contactEmail, { color: colors.mutedForeground }]}>
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
	const [loading, setLoading] = useState(true);
	const [resendingId, setResendingId] = useState<string | null>(null);

	const fetchRequests = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const data = await MockReviewRequestsService.getAll();
				setRequests(data);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

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
				<Button style={styles.newRequestButton}>
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
	contactName: {
		fontSize: 16,
		fontWeight: '600',
	},
	contactEmail: {
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
});
