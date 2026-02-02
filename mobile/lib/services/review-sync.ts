import {
	GoogleBusinessProfileClient,
	GoogleReview,
	starRatingToNumber,
} from '../google/business-profile';
import { supabase } from '../supabase';

export interface SyncResult {
	success: boolean;
	synced: number;
	created: number;
	updated: number;
	errors: string[];
	stats?: {
		totalReviews: number;
		avgRating: number;
		reviewsThisMonth: number;
		responseRate: number;
	};
}

interface Business {
	id: string;
	user_id: string;
	google_place_id: string | null;
	google_access_token: string | null;
	google_refresh_token: string | null;
	google_token_expires_at: string | null;
}

function transformGoogleReview(
	review: GoogleReview,
	businessId: string
): Record<string, unknown> {
	return {
		business_id: businessId,
		google_review_id: review.reviewId,
		author_name: review.reviewer.displayName,
		author_photo_url: review.reviewer.profilePhotoUrl || null,
		profile_photo_url: review.reviewer.profilePhotoUrl || null,
		rating: starRatingToNumber(review.starRating),
		text: review.comment || null,
		original_text: review.comment || null,
		published_at: review.createTime,
		response_text: review.reviewReply?.comment || null,
		response_at: review.reviewReply?.updateTime || null,
		is_responded: !!review.reviewReply,
		response_published_at: review.reviewReply?.updateTime || null,
		synced_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	};
}

export async function syncReviews(businessId: string): Promise<SyncResult> {
	const result: SyncResult = {
		success: false,
		synced: 0,
		created: 0,
		updated: 0,
		errors: [],
	};

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			result.errors.push('User not authenticated');
			return result;
		}

		const { data: business, error: fetchError } = await supabase
			.from('businesses')
			.select(
				'id, user_id, google_place_id, google_access_token, google_refresh_token, google_token_expires_at'
			)
			.eq('id', businessId)
			.single();

		if (fetchError || !business) {
			result.errors.push('Business not found');
			return result;
		}

		const typedBusiness = business as Business;

		if (typedBusiness.user_id !== user.id) {
			result.errors.push('Unauthorized');
			return result;
		}

		if (
			!typedBusiness.google_access_token ||
			!typedBusiness.google_refresh_token
		) {
			result.errors.push('Google not connected');
			return result;
		}

		if (!typedBusiness.google_place_id) {
			result.errors.push('No Google location selected');
			return result;
		}

		const client = await GoogleBusinessProfileClient.create();
		if (!client) {
			result.errors.push('Failed to create Google client');
			return result;
		}

		const accounts = await client.getAccounts();

		let locationName: string | null = null;

		for (const account of accounts) {
			const locations = await client.getLocations(account.name);
			const matchingLocation = locations.find(
				(loc) => loc.metadata?.placeId === typedBusiness.google_place_id
			);
			if (matchingLocation) {
				locationName = matchingLocation.name;
				break;
			}
		}

		if (!locationName) {
			result.errors.push('Location not found in Google account');
			return result;
		}

		const googleReviews = await client.getAllReviews(locationName);

		const { data: existingReviews } = await supabase
			.from('reviews')
			.select('google_review_id')
			.eq('business_id', businessId);

		const existingIds = new Set(
			existingReviews?.map((r) => r.google_review_id) || []
		);

		const newReviews: GoogleReview[] = [];
		const reviewsToUpdate: GoogleReview[] = [];

		for (const review of googleReviews) {
			if (existingIds.has(review.reviewId)) {
				reviewsToUpdate.push(review);
			} else {
				newReviews.push(review);
			}
		}

		if (newReviews.length > 0) {
			const reviewsToInsert = newReviews.map((review) =>
				transformGoogleReview(review, businessId)
			);

			const { error: insertError } = await supabase
				.from('reviews')
				.insert(reviewsToInsert);

			if (insertError) {
				result.errors.push(`Insert error: ${insertError.message}`);
			} else {
				result.created = newReviews.length;

				for (const review of newReviews) {
					await supabase.from('notifications').insert({
						user_id: user.id,
						business_id: businessId,
						type: 'new_review',
						title: 'New Review',
						message: `${review.reviewer.displayName} left a ${starRatingToNumber(review.starRating)}-star review`,
						action_url: `/dashboard/reviews`,
						action_label: 'View Review',
					});
				}
			}
		}

		for (const review of reviewsToUpdate) {
			const { error: updateError } = await supabase
				.from('reviews')
				.update({
					author_name: review.reviewer.displayName,
					author_photo_url: review.reviewer.profilePhotoUrl || null,
					text: review.comment || null,
					response_text: review.reviewReply?.comment || null,
					response_at: review.reviewReply?.updateTime || null,
					is_responded: !!review.reviewReply,
					response_published_at: review.reviewReply?.updateTime || null,
					synced_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.eq('business_id', businessId)
				.eq('google_review_id', review.reviewId);

			if (updateError) {
				result.errors.push(
					`Update error for ${review.reviewId}: ${updateError.message}`
				);
			} else {
				result.updated++;
			}
		}

		result.synced = googleReviews.length;

		const totalReviews = googleReviews.length;
		const avgRating =
			totalReviews > 0
				? googleReviews.reduce(
					(sum, r) => sum + starRatingToNumber(r.starRating),
					0
				) / totalReviews
				: 0;

		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const reviewsThisMonth = googleReviews.filter(
			(r) => new Date(r.createTime) >= startOfMonth
		).length;

		const respondedCount = googleReviews.filter((r) => r.reviewReply).length;
		const responseRate =
			totalReviews > 0 ? (respondedCount / totalReviews) * 100 : 0;

		await supabase
			.from('businesses')
			.update({
				total_reviews: totalReviews,
				avg_rating: Math.round(avgRating * 10) / 10,
				reviews_this_month: reviewsThisMonth,
				response_rate: Math.round(responseRate * 100) / 100,
				last_review_sync_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq('id', businessId);

		result.success = true;
		result.stats = {
			totalReviews,
			avgRating: Math.round(avgRating * 10) / 10,
			reviewsThisMonth,
			responseRate: Math.round(responseRate * 100) / 100,
		};

		return result;
	} catch (err) {
		result.errors.push(
			err instanceof Error ? err.message : 'Unknown error occurred'
		);
		return result;
	}
}

export async function getLastSyncTime(
	businessId: string
): Promise<Date | null> {
	const { data } = await supabase
		.from('businesses')
		.select('last_review_sync_at')
		.eq('id', businessId)
		.single();

	return data?.last_review_sync_at ? new Date(data.last_review_sync_at) : null;
}
