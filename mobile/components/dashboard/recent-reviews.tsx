import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface Review {
	id: string;
	author: string;
	rating: number;
	text: string;
	platform: string;
	date: string;
}

const mockReviews: Review[] = [
	{
		id: '1',
		author: 'John D.',
		rating: 5,
		text: 'Excellent service! Highly recommended.',
		platform: 'Google',
		date: '2 hours ago',
	},
	{
		id: '2',
		author: 'Sarah M.',
		rating: 4,
		text: 'Great experience overall. Will come back.',
		platform: 'Yelp',
		date: '5 hours ago',
	},
	{
		id: '3',
		author: 'Mike R.',
		rating: 5,
		text: 'Best in town! Professional team.',
		platform: 'Google',
		date: '1 day ago',
	},
];

function StarRating({ rating }: { rating: number }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<View style={styles.stars}>
			{[1, 2, 3, 4, 5].map((star) => (
				<Ionicons
					key={star}
					name={star <= rating ? 'star' : 'star-outline'}
					size={14}
					color={star <= rating ? colors.star : colors.mutedForeground}
				/>
			))}
		</View>
	);
}

function ReviewItem({ review }: { review: Review }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<View style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
			<View style={styles.reviewHeader}>
				<View
					style={[
						styles.avatar,
						{ backgroundColor: colors.accent },
					]}
				>
					<Text style={[styles.avatarText, { color: colors.primary }]}>
						{review.author.charAt(0)}
					</Text>
				</View>
				<View style={styles.reviewInfo}>
					<Text style={[styles.author, { color: colors.foreground }]}>
						{review.author}
					</Text>
					<View style={styles.reviewMeta}>
						<StarRating rating={review.rating} />
						<Text style={[styles.platform, { color: colors.mutedForeground }]}>
							{review.platform}
						</Text>
					</View>
				</View>
				<Text style={[styles.date, { color: colors.mutedForeground }]}>
					{review.date}
				</Text>
			</View>
			<Text
				style={[styles.reviewText, { color: colors.foreground }]}
				numberOfLines={2}
			>
				{review.text}
			</Text>
		</View>
	);
}

export function RecentReviews() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Card style={styles.card}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: colors.foreground }]}>
					Recent Reviews
				</Text>
				<Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
			</View>
			<View style={styles.reviews}>
				{mockReviews.map((review) => (
					<ReviewItem key={review.id} review={review} />
				))}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 0,
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		paddingBottom: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
	},
	viewAll: {
		fontSize: 14,
		fontWeight: '500',
	},
	reviews: {
		gap: 0,
	},
	reviewItem: {
		padding: 16,
		paddingTop: 12,
		borderBottomWidth: 1,
	},
	reviewHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 16,
		fontWeight: '600',
	},
	reviewInfo: {
		flex: 1,
		marginLeft: 12,
	},
	author: {
		fontSize: 15,
		fontWeight: '600',
	},
	reviewMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 2,
	},
	stars: {
		flexDirection: 'row',
		gap: 2,
	},
	platform: {
		fontSize: 12,
	},
	date: {
		fontSize: 12,
	},
	reviewText: {
		fontSize: 14,
		lineHeight: 20,
	},
});
