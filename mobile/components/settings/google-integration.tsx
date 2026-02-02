import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isGoogleConnected } from '@/lib/google/oauth';
import { SyncResult, syncReviews } from '@/lib/services/review-sync';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Linking,
	Pressable,
	StyleSheet,
	Text,
	View
} from 'react-native';

interface Business {
	id: string;
	name: string;
	google_place_id: string | null;
	google_connected_at: string | null;
	last_review_sync_at: string | null;
	total_reviews: number;
	avg_rating: number;
}

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:3000';

export function GoogleIntegration() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const [business, setBusiness] = useState<Business | null>(null);
	const [loading, setLoading] = useState(true);
	const [syncing, setSyncing] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [lastSync, setLastSync] = useState<Date | null>(null);

	const fetchBusiness = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await supabase
				.from('businesses')
				.select(
					'id, name, google_place_id, google_connected_at, last_review_sync_at, total_reviews, avg_rating'
				)
				.eq('user_id', user.id)
				.single();

			if (data) {
				setBusiness(data as Business);
				setLastSync(
					data.last_review_sync_at ? new Date(data.last_review_sync_at) : null
				);
			}

			const connected = await isGoogleConnected();
			setIsConnected(connected && !!data?.google_place_id);
		} catch (error) {
			console.error('Error fetching business:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBusiness();
	}, [fetchBusiness]);

	const handleConnect = () => {
		Alert.alert(
			'Connect Google Business',
			'To connect your Google Business Profile, please use the web app. This feature requires desktop browser authentication.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Open Web App',
					onPress: () => {
						Linking.openURL(`${WEB_APP_URL}/dashboard/settings`);
					},
				},
			]
		);
	};

	const handleSync = async () => {
		if (!business) return;

		setSyncing(true);
		try {
			const result: SyncResult = await syncReviews(business.id);

			if (result.success) {
				Alert.alert(
					'Sync Complete',
					`Synced ${result.synced} reviews\n${result.created} new, ${result.updated} updated`,
					[{ text: 'OK' }]
				);
				setLastSync(new Date());
				if (result.stats) {
					setBusiness({
						...business,
						total_reviews: result.stats.totalReviews,
						avg_rating: result.stats.avgRating,
					});
				}
			} else {
				Alert.alert(
					'Sync Failed',
					result.errors.join('\n') || 'Unknown error occurred',
					[{ text: 'OK' }]
				);
			}
		} catch {
			Alert.alert('Error', 'Failed to sync reviews. Please try again.', [
				{ text: 'OK' },
			]);
		} finally {
			setSyncing(false);
		}
	};

	const handleDisconnect = () => {
		Alert.alert(
			'Disconnect Google',
			'Are you sure you want to disconnect your Google Business Profile?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Disconnect',
					style: 'destructive',
					onPress: async () => {
						// Clear tokens from SecureStore and database
						// This would need to be implemented in oauth.ts
						Alert.alert('Info', 'Disconnect functionality coming soon');
					},
				},
			]
		);
	};

	const formatDate = (date: Date | null) => {
		if (!date) return 'Never';
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	};

	if (loading) {
		return (
			<Card style={styles.card}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="small" color={colors.primary} />
				</View>
			</Card>
		);
	}

	return (
		<Card style={styles.card}>
			<View style={styles.header}>
				<View
					style={[styles.iconContainer, { backgroundColor: '#4285F420' }]}
				>
					<Ionicons name="logo-google" size={24} color="#4285F4" />
				</View>
				<View style={styles.headerText}>
					<Text style={[styles.title, { color: colors.foreground }]}>
						Google Business Profile
					</Text>
					<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
						Sync and manage your Google reviews
					</Text>
				</View>
				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor: isConnected
								? colors.success + '20'
								: colors.muted,
						},
					]}
				>
					<Text
						style={[
							styles.statusText,
							{
								color: isConnected ? colors.success : colors.mutedForeground,
							},
						]}
					>
						{isConnected ? 'Connected' : 'Not Connected'}
					</Text>
				</View>
			</View>

			{isConnected && business ? (
				<>
					<View
						style={[styles.statsContainer, { backgroundColor: colors.muted }]}
					>
						<View style={styles.statItem}>
							<Text
								style={[styles.statLabel, { color: colors.mutedForeground }]}
							>
								Total Reviews
							</Text>
							<Text style={[styles.statValue, { color: colors.foreground }]}>
								{business.total_reviews}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text
								style={[styles.statLabel, { color: colors.mutedForeground }]}
							>
								Avg Rating
							</Text>
							<Text style={[styles.statValue, { color: colors.foreground }]}>
								{business.avg_rating?.toFixed(1) || 'N/A'}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text
								style={[styles.statLabel, { color: colors.mutedForeground }]}
							>
								Last Sync
							</Text>
							<Text
								style={[styles.statValue, { color: colors.foreground }]}
								numberOfLines={1}
							>
								{lastSync ? formatDate(lastSync) : 'Never'}
							</Text>
						</View>
					</View>

					<View style={styles.actions}>
						<Button
							onPress={handleSync}
							disabled={syncing}
							style={styles.syncButton}
						>
							{syncing ? (
								<ActivityIndicator size="small" color="#fff" />
							) : (
								<>
									<Ionicons
										name="refresh"
										size={18}
										color="#fff"
										style={styles.buttonIcon}
									/>
									<Text style={styles.buttonText}>Sync Reviews</Text>
								</>
							)}
						</Button>
						<Pressable
							onPress={handleDisconnect}
							style={[styles.disconnectButton, { borderColor: colors.border }]}
						>
							<Ionicons
								name="unlink"
								size={18}
								color={colors.destructive}
								style={styles.buttonIcon}
							/>
							<Text style={[styles.disconnectText, { color: colors.destructive }]}>
								Disconnect
							</Text>
						</Pressable>
					</View>
				</>
			) : (
				<View style={styles.connectContainer}>
					<Text style={[styles.connectText, { color: colors.mutedForeground }]}>
						Connect your Google Business Profile to sync reviews automatically.
					</Text>
					<Button onPress={handleConnect}>
						<Ionicons
							name="logo-google"
							size={18}
							color="#fff"
							style={styles.buttonIcon}
						/>
						<Text style={styles.buttonText}>Connect Google</Text>
					</Button>
				</View>
			)}
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 16,
		gap: 16,
	},
	loadingContainer: {
		padding: 20,
		alignItems: 'center',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	iconContainer: {
		width: 44,
		height: 44,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 13,
		marginTop: 2,
	},
	statusBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '500',
	},
	statsContainer: {
		flexDirection: 'row',
		borderRadius: 12,
		padding: 12,
		gap: 8,
	},
	statItem: {
		flex: 1,
		alignItems: 'center',
	},
	statLabel: {
		fontSize: 11,
		marginBottom: 4,
	},
	statValue: {
		fontSize: 14,
		fontWeight: '600',
	},
	actions: {
		flexDirection: 'row',
		gap: 12,
	},
	syncButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	disconnectButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
	},
	buttonIcon: {
		marginRight: 6,
	},
	buttonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
	},
	disconnectText: {
		fontSize: 14,
		fontWeight: '500',
	},
	connectContainer: {
		alignItems: 'center',
		gap: 12,
	},
	connectText: {
		fontSize: 14,
		textAlign: 'center',
	},
});
