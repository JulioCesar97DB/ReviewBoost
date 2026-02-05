import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getBusinessStats } from '@/lib/services/google-business';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RatingData {
	stars: number;
	count: number;
	percentage: number;
}

function RatingBar({ data }: { data: RatingData }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<View style={styles.ratingRow}>
			<View style={styles.starLabel}>
				<Text style={[styles.starCount, { color: colors.foreground }]}>
					{data.stars}
				</Text>
				<Ionicons name="star" size={14} color={colors.star} />
			</View>
			<View style={[styles.barContainer, { backgroundColor: colors.secondary }]}>
				<View
					style={[
						styles.barFill,
						{
							width: `${data.percentage}%`,
							backgroundColor: colors.primary,
						},
					]}
				/>
			</View>
			<Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
				{data.count}
			</Text>
		</View>
	);
}

export function RatingDistribution() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [ratingData, setRatingData] = useState<RatingData[]>([]);
	const [totalReviews, setTotalReviews] = useState(0);
	const [avgRating, setAvgRating] = useState('0.0');

	useEffect(() => {
		const loadData = () => {
			const stats = getBusinessStats();
			const total = stats.totalReviews;

			const data: RatingData[] = [5, 4, 3, 2, 1].map((stars) => {
				const count = stats.ratingDistribution[stars] || 0;
				return {
					stars,
					count,
					percentage: total > 0 ? Math.round((count / total) * 100) : 0,
				};
			});

			setRatingData(data);
			setTotalReviews(total);
			setAvgRating(stats.averageRating.toFixed(1));
		};

		loadData();
	}, []);

	return (
		<Card style={styles.card}>
			<Text style={[styles.title, { color: colors.foreground }]}>
				Rating Distribution
			</Text>
			<View style={styles.content}>
				<View style={styles.summary}>
					<Text style={[styles.avgRating, { color: colors.foreground }]}>
						{avgRating}
					</Text>
					<View style={styles.stars}>
						{[1, 2, 3, 4, 5].map((star) => (
							<Ionicons
								key={star}
								name={star <= Math.round(parseFloat(avgRating)) ? 'star' : 'star-outline'}
								size={20}
								color={colors.star}
							/>
						))}
					</View>
					<Text style={[styles.totalReviews, { color: colors.mutedForeground }]}>
						{totalReviews} reviews
					</Text>
				</View>
				<View style={styles.bars}>
					{ratingData.map((data) => (
						<RatingBar key={data.stars} data={data} />
					))}
				</View>
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	content: {
		flexDirection: 'row',
		gap: 24,
	},
	summary: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingRight: 16,
	},
	avgRating: {
		fontSize: 48,
		fontWeight: '700',
	},
	stars: {
		flexDirection: 'row',
		gap: 2,
		marginTop: 4,
	},
	totalReviews: {
		fontSize: 13,
		marginTop: 4,
	},
	bars: {
		flex: 1,
		gap: 8,
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	starLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 28,
		gap: 2,
	},
	starCount: {
		fontSize: 14,
		fontWeight: '500',
	},
	barContainer: {
		flex: 1,
		height: 8,
		borderRadius: 4,
		overflow: 'hidden',
	},
	barFill: {
		height: '100%',
		borderRadius: 4,
	},
	countLabel: {
		fontSize: 12,
		width: 28,
		textAlign: 'right',
	},
});
