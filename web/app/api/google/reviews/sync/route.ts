import {
	GoogleBusinessProfileClient,
	GoogleReview,
	starRatingToNumber,
} from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface SyncResult {
	synced: number;
	created: number;
	updated: number;
	errors: string[];
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

export async function POST(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { businessId } = body;

	if (!businessId) {
		return NextResponse.json(
			{ error: 'businessId is required' },
			{ status: 400 }
		);
	}

	const { data: business, error: fetchError } = await supabase
		.from('businesses')
		.select(
			'id, user_id, google_place_id, google_access_token, google_refresh_token, google_token_expires_at'
		)
		.eq('id', businessId)
		.single();

	if (fetchError || !business) {
		return NextResponse.json({ error: 'Business not found' }, { status: 404 });
	}

	if (business.user_id !== user.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	if (!business.google_access_token || !business.google_refresh_token) {
		return NextResponse.json(
			{ error: 'Google not connected' },
			{ status: 400 }
		);
	}

	if (!business.google_place_id) {
		return NextResponse.json(
			{ error: 'No Google location selected' },
			{ status: 400 }
		);
	}

	const client = new GoogleBusinessProfileClient(
		business.google_access_token,
		business.google_refresh_token,
		new Date(business.google_token_expires_at),
		async (newAccessToken, newExpiresAt) => {
			await supabase
				.from('businesses')
				.update({
					google_access_token: newAccessToken,
					google_token_expires_at: newExpiresAt.toISOString(),
				})
				.eq('id', businessId);
		}
	);

	const result: SyncResult = {
		synced: 0,
		created: 0,
		updated: 0,
		errors: [],
	};

	try {
		const accounts = await client.getAccounts();

		let locationName: string | null = null;

		for (const account of accounts) {
			const locations = await client.getLocations(account.name);
			const matchingLocation = locations.find(
				(loc) => loc.metadata?.placeId === business.google_place_id
			);
			if (matchingLocation) {
				locationName = matchingLocation.name;
				break;
			}
		}

		if (!locationName) {
			return NextResponse.json(
				{ error: 'Location not found in Google account' },
				{ status: 404 }
			);
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

		return NextResponse.json({
			success: true,
			result,
			stats: {
				totalReviews,
				avgRating: Math.round(avgRating * 10) / 10,
				reviewsThisMonth,
				responseRate: Math.round(responseRate * 100) / 100,
			},
		});
	} catch (err) {
		console.error('Error syncing Google reviews:', err);
		return NextResponse.json(
			{
				error: 'Failed to sync reviews',
				details: err instanceof Error ? err.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
