import {
	GoogleBusinessProfileClient,
	starRatingToNumber,
} from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const businessId = searchParams.get('businessId');

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

		const reviews = await client.getAllReviews(locationName);

		return NextResponse.json({
			reviews: reviews.map((review) => ({
				googleReviewId: review.reviewId,
				authorName: review.reviewer.displayName,
				authorPhotoUrl: review.reviewer.profilePhotoUrl,
				rating: starRatingToNumber(review.starRating),
				text: review.comment,
				publishedAt: review.createTime,
				responseText: review.reviewReply?.comment,
				responseAt: review.reviewReply?.updateTime,
				isResponded: !!review.reviewReply,
			})),
		});
	} catch (err) {
		console.error('Error fetching Google reviews:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch reviews' },
			{ status: 500 }
		);
	}
}
