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

interface Review {
	id: string;
	author: string;
	rating: number;
	text: string;
	platform: 'google' | 'yelp' | 'facebook';
	date: string;
	responded: boolean;
}

const mockReviews: Review[] = [
	{
		id: '1',
		author: 'John Davidson',
		rating: 5,
		text: 'Excellent service! The team was professional and went above and beyond. Highly recommended for anyone looking for quality work.',
		platform: 'google',
		date: '2 hours ago',
		responded: true,
	},
	{
		id: '2',
		author: 'Sarah Mitchell',
		rating: 4,
		text: 'Great experience overall. The staff was friendly and helpful. Will definitely come back.',
		platform: 'yelp',
		date: '5 hours ago',
		responded: false,
	},
	{
		id: '3',
		author: 'Mike Roberts',
		rating: 5,
		text: 'Best in town! Professional team and excellent results. Could not be happier.',
		platform: 'google',
		date: '1 day ago',
		responded: true,
	},
	{
		id: '4',
		author: 'Emily Chen',
		rating: 3,
		text: 'Decent service but room for improvement. The wait time was longer than expected.',
		platform: 'facebook',
		date: '2 days ago',
		responded: false,
	},
	{
		id: '5',
		author: 'David Wilson',
		rating: 5,
		text: 'Outstanding! Exceeded all my expectations. Will recommend to friends.',
		platform: 'google',
		date: '3 days ago',
		responded: true,
	},
];

type FilterType = 'all' | 'responded' | 'pending';

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

function getPlatformIcon(platform: string): keyof typeof Ionicons.glyphMap {
	switch (platform) {
		case 'google':
			return 'logo-google';
		case 'yelp':
			return 'star';
		case 'facebook':
			return 'logo-facebook';
		default:
			return 'globe';
	}
}

function ReviewCard({ review }: { review: Review }) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Card style={styles.reviewCard}>
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
						<Ionicons
							name={getPlatformIcon(review.platform)}
							size={14}
							color={colors.mutedForeground}
						/>
					</View>
				</View>
				<View style={styles.reviewRight}>
					<Text style={[styles.date, { color: colors.mutedForeground }]}>
						{review.date}
					</Text>
					{review.responded ? (
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
				{review.text}
			</Text>
			{!review.responded && (
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

	const filteredReviews = mockReviews.filter((review) => {
		if (filter === 'responded') return review.responded;
		if (filter === 'pending') return !review.responded;
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
			<FlatList
				data={filteredReviews}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <ReviewCard review={item} />}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
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
