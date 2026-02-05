import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ReviewRequest {
	id: string;
	contactName: string;
	contactEmail: string;
	sentAt: string;
	status: 'pending' | 'opened' | 'completed' | 'expired';
}

const mockRequests: ReviewRequest[] = [
	{
		id: '1',
		contactName: 'Alice Johnson',
		contactEmail: 'alice@example.com',
		sentAt: '2 hours ago',
		status: 'pending',
	},
	{
		id: '2',
		contactName: 'Bob Smith',
		contactEmail: 'bob@example.com',
		sentAt: '5 hours ago',
		status: 'opened',
	},
	{
		id: '3',
		contactName: 'Carol Williams',
		contactEmail: 'carol@example.com',
		sentAt: '1 day ago',
		status: 'completed',
	},
	{
		id: '4',
		contactName: 'Dan Brown',
		contactEmail: 'dan@example.com',
		sentAt: '3 days ago',
		status: 'expired',
	},
	{
		id: '5',
		contactName: 'Eva Martinez',
		contactEmail: 'eva@example.com',
		sentAt: '4 hours ago',
		status: 'pending',
	},
];

type FilterType = 'all' | 'pending' | 'opened' | 'completed';

function getStatusConfig(status: string, colors: typeof Colors.light) {
	switch (status) {
		case 'pending':
			return { color: colors.warning, label: 'Pending', icon: 'time' as const };
		case 'opened':
			return { color: colors.primary, label: 'Opened', icon: 'eye' as const };
		case 'completed':
			return { color: colors.success, label: 'Completed', icon: 'checkmark-circle' as const };
		case 'expired':
			return { color: colors.destructive, label: 'Expired', icon: 'close-circle' as const };
		default:
			return { color: colors.mutedForeground, label: status, icon: 'help-circle' as const };
	}
}

function RequestCard({ request }: { request: ReviewRequest }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const statusConfig = getStatusConfig(request.status, colors);

	return (
		<Card style={styles.requestCard}>
			<View style={styles.requestHeader}>
				<View
					style={[
						styles.avatar,
						{ backgroundColor: colors.accent },
					]}
				>
					<Text style={[styles.avatarText, { color: colors.primary }]}>
						{request.contactName.charAt(0)}
					</Text>
				</View>
				<View style={styles.requestInfo}>
					<Text style={[styles.contactName, { color: colors.foreground }]}>
						{request.contactName}
					</Text>
					<Text style={[styles.contactEmail, { color: colors.mutedForeground }]}>
						{request.contactEmail}
					</Text>
				</View>
				<View style={styles.requestRight}>
					<Text style={[styles.sentAt, { color: colors.mutedForeground }]}>
						{request.sentAt}
					</Text>
					<View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
						<Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
						<Text style={[styles.statusText, { color: statusConfig.color }]}>
							{statusConfig.label}
						</Text>
					</View>
				</View>
			</View>
			{request.status === 'pending' && (
				<View style={styles.actions}>
					<Pressable
						style={[styles.actionButton, { backgroundColor: colors.secondary }]}
					>
						<Ionicons name="refresh" size={16} color={colors.foreground} />
						<Text style={[styles.actionText, { color: colors.foreground }]}>
							Resend
						</Text>
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

	const filteredRequests = mockRequests.filter((request) => {
		if (filter === 'all') return true;
		return request.status === filter;
	});

	const filters: { key: FilterType; label: string }[] = [
		{ key: 'all', label: 'All' },
		{ key: 'pending', label: 'Pending' },
		{ key: 'opened', label: 'Opened' },
		{ key: 'completed', label: 'Completed' },
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

			<FlatList
				data={filteredRequests}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <RequestCard request={item} />}
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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
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
