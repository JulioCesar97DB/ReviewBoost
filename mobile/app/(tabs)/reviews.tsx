import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isMockMode } from '@/lib/config';
import type { GoogleReview } from '@/lib/google/business-profile';
import { MockReviewsService } from '@/lib/mock';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'all' | 'responded' | 'pending';

function getNumericRating(rating: GoogleReview['starRating']): number {
	const map: Record<string, number> = {
		ONE: 1,
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
	};
	return map[rating] || 0;
}

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
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks}w ago`;
	} else {
		const months = Math.floor(diffDays / 30);
		return `${months}mo ago`;
	}
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

function ReviewCard({ review }: { review: GoogleReview }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const rating = getNumericRating(review.starRating);
	const hasResponse = !!review.reviewReply;

	return (
		<Card style={styles.reviewCard}>
			<View style={styles.reviewHeader}>
				{review.reviewer.profilePhotoUrl ? (
					<Image
						source={{ uri: review.reviewer.profilePhotoUrl }}
						style={styles.avatar}
					/>
				) : (
					<View
						style={[styles.avatar, { backgroundColor: colors.accent }]}
					>
						<Text style={[styles.avatarText, { color: colors.primary }]}>
							{review.reviewer.displayName.charAt(0)}
						</Text>
					</View>
				)}
				<View style={styles.reviewInfo}>
					<Text style={[styles.author, { color: colors.foreground }]}>
						{review.reviewer.displayName}
					</Text>
					<View style={styles.reviewMeta}>
						<StarRating rating={rating} />
						<Ionicons
							name="logo-google"
							size={14}
							color={colors.mutedForeground}
						/>
					</View>
				</View>
				<View style={styles.reviewRight}>
					<Text style={[styles.date, { color: colors.mutedForeground }]}>
						{formatRelativeTime(review.createTime)}
					</Text>
					{hasResponse ? (
						<View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
							<Text style={[styles.badgeText, { color: colors.success }]}>
								Responded
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
			<Text style={[styles.reviewText, { color: colors.foreground }]}>
				{review.comment}
			</Text>
			{hasResponse && review.reviewReply && (
				<View style={[styles.replyContainer, { backgroundColor: colors.muted }]}>
					<Text style={[styles.replyLabel, { color: colors.mutedForeground }]}>
						Your response:
					</Text>
					<Text style={[styles.replyText, { color: colors.foreground }]}>
						{review.reviewReply.comment}
					</Text>
				</View>
			)}
			{!hasResponse && (
				<Pressable
					style={[styles.respondButton, { backgroundColor: colors.primary }]}
				>
					<Text style={[styles.respondText, { color: colors.primaryForeground }]}>
						Respond
					</Text>
				</Pressable>
			)}
		</Card>
	);
}

export default function ReviewsScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [filter, setFilter] = useState<FilterType>('all');
	const [reviews, setReviews] = useState<GoogleReview[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchReviews = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const data = await MockReviewsService.getAll();
				setReviews(data);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	const filteredReviews = reviews.filter((review) => {
		const hasResponse = !!review.reviewReply;
		if (filter === 'responded') return hasResponse;
		if (filter === 'pending') return !hasResponse;
		return true;
	});

	const filters: { key: FilterType; label: string }[] = [
		{ key: 'all', label: 'All' },
		{ key: 'pending', label: 'Pending' },
		{ key: 'responded', label: 'Responded' },
	];

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['left', 'right']}
		>
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
					data={filteredReviews}
					keyExtractor={(item) => item.reviewId}
					renderItem={({ item }) => <ReviewCard review={item} />}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
					initialNumToRender={10}
					maxToRenderPerBatch={10}
					windowSize={5}
					removeClippedSubviews={true}
					getItemLayout={(_, index) => ({
						length: 200,
						offset: 200 * index + 12 * index,
						index,
					})}
					ListEmptyComponent={
						<View style={styles.emptyState}>
							<Ionicons
								name="chatbubbles-outline"
								size={48}
								color={colors.mutedForeground}
							/>
							<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
								No reviews found
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
	filterContainer: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 8,
	},
	filterButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	filterText: {
		fontSize: 14,
		fontWeight: '500',
	},
	listContent: {
		padding: 16,
		paddingTop: 0,
		gap: 12,
		paddingBottom: 100,
	},
	reviewCard: {
		gap: 12,
	},
	reviewHeader: {
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
	reviewInfo: {
		flex: 1,
		marginLeft: 12,
	},
	author: {
		fontSize: 16,
		fontWeight: '600',
	},
	reviewMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 4,
	},
	stars: {
		flexDirection: 'row',
		gap: 2,
	},
	reviewRight: {
		alignItems: 'flex-end',
		gap: 4,
	},
	date: {
		fontSize: 12,
	},
	badge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 10,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '500',
	},
	reviewText: {
		fontSize: 14,
		lineHeight: 21,
	},
	replyContainer: {
		padding: 12,
		borderRadius: 8,
		gap: 4,
	},
	replyLabel: {
		fontSize: 12,
		fontWeight: '500',
	},
	replyText: {
		fontSize: 14,
		lineHeight: 20,
	},
	respondButton: {
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: 'center',
	},
	respondText: {
		fontSize: 14,
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
});
