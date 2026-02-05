import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { starRatingToNumber, type GoogleReview } from '@/lib/google/business-profile';
import { MOCK_REVIEWS } from '@/lib/mock';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Review {
	id: string;
	author: string;
	avatarUrl?: string;
	rating: number;
	text: string;
	date: string;
	responded: boolean;
}

function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffHours / 24);

	if (diffHours < 1) return 'Just now';
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString();
}

function transformGoogleReview(review: GoogleReview): Review {
	return {
		id: review.reviewId,
		author: review.reviewer.displayName,
		avatarUrl: review.reviewer.profilePhotoUrl,
		rating: starRatingToNumber(review.starRating),
		text: review.comment || '',
		date: formatRelativeTime(review.createTime),
		responded: !!review.reviewReply,
	};
}

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
				{review.avatarUrl ? (
					<Image
						source={{ uri: review.avatarUrl }}
						style={styles.avatar}
						contentFit="cover"
					/>
				) : (
					<View style={[styles.avatar, { backgroundColor: colors.accent }]}>
						<Text style={[styles.avatarText, { color: colors.primary }]}>
							{review.author.charAt(0)}
						</Text>
					</View>
				)}
				<View style={styles.reviewInfo}>
					<Text style={[styles.author, { color: colors.foreground }]}>
						{review.author}
					</Text>
					<View style={styles.reviewMeta}>
						<StarRating rating={review.rating} />
						{review.responded ? (
							<View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
								<Text style={[styles.badgeText, { color: colors.success }]}>
									Replied
								</Text>
							</View>
						) : (
							<View style={[styles.badge, { backgroundColor: colors.warning + '20' }]}>
								<Text style={[styles.badgeText, { color: colors.warning }]}>
									Pending
								</Text>
							</View>
						)}
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
	const router = useRouter();
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		const loadReviews = () => {
			const recentReviews = MOCK_REVIEWS.slice(0, 3).map(transformGoogleReview);
			setReviews(recentReviews);
		};

		loadReviews();
	}, []);

	return (
		<Card style={styles.card}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: colors.foreground }]}>
					Recent Reviews
				</Text>
				<Pressable onPress={() => router.push('/reviews')}>
					<Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
				</Pressable>
			</View>
			<View style={styles.reviews}>
				{reviews.map((review) => (
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
	badge: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	badgeText: {
		fontSize: 10,
		fontWeight: '500',
	},
	date: {
		fontSize: 12,
	},
	reviewText: {
		fontSize: 14,
		lineHeight: 20,
	},
});
