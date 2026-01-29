import { QuickActions } from '@/components/dashboard/quick-actions';
import { RatingDistribution } from '@/components/dashboard/rating-distribution';
import { RecentReviews } from '@/components/dashboard/recent-reviews';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Colors } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const { profile, session } = useAuthContext();

	const userName = profile?.full_name || session?.user?.email?.split('@')[0] || 'User';

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['left', 'right']}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<Text style={[styles.greeting, { color: colors.mutedForeground }]}>
						Welcome back,
					</Text>
					<Text style={[styles.userName, { color: colors.foreground }]}>
						{userName}
					</Text>
				</View>

				<View style={styles.statsGrid}>
					<StatsCard
						title="Total Reviews"
						value="137"
						change="+12% from last month"
						changeType="positive"
						icon="chatbubbles"
					/>
					<StatsCard
						title="Avg. Rating"
						value="4.8"
						change="+0.2 from last month"
						changeType="positive"
						icon="star"
					/>
					<StatsCard
						title="Pending Requests"
						value="24"
						change="8 sent today"
						changeType="neutral"
						icon="paper-plane"
					/>
					<StatsCard
						title="Response Rate"
						value="68%"
						change="+5% from last month"
						changeType="positive"
						icon="trending-up"
					/>
				</View>

				<QuickActions />

				<RatingDistribution />

				<RecentReviews />

				<View style={styles.bottomSpacer} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 16,
	},
	header: {
		marginBottom: 8,
	},
	greeting: {
		fontSize: 14,
	},
	userName: {
		fontSize: 24,
		fontWeight: '700',
	},
	statsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	bottomSpacer: {
		height: 80,
	},
});
