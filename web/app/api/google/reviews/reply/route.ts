import { GoogleBusinessProfileClient } from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { businessId, reviewId, comment } = await request.json();

	if (!businessId || !reviewId || !comment) {
		return NextResponse.json(
			{ error: 'businessId, reviewId and comment are required' },
			{ status: 400 }
		);
	}

	if (comment.length > 4096) {
		return NextResponse.json(
			{ error: 'Comment is too long (max 4096 characters)' },
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

	const { data: review, error: reviewError } = await supabase
		.from('reviews')
		.select('id, google_review_id')
		.eq('id', reviewId)
		.eq('business_id', businessId)
		.single();

	if (reviewError || !review) {
		return NextResponse.json({ error: 'Review not found' }, { status: 404 });
	}

	if (!review.google_review_id) {
		return NextResponse.json(
			{ error: 'Review not linked to Google' },
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

		let reviewName: string | null = null;

		for (const account of accounts) {
			const locations = await client.getLocations(account.name);
			const matchingLocation = locations.find(
				(loc) => loc.metadata?.placeId === business.google_place_id
			);
			if (matchingLocation) {
				reviewName = `${matchingLocation.name}/reviews/${review.google_review_id}`;
				break;
			}
		}

		if (!reviewName) {
			return NextResponse.json(
				{ error: 'Could not find review in Google' },
				{ status: 404 }
			);
		}

		await client.replyToReview(reviewName, comment);

		const now = new Date().toISOString();
		await supabase
			.from('reviews')
			.update({
				response_text: comment,
				response_at: now,
				response_published_at: now,
				is_responded: true,
			})
			.eq('id', reviewId);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error('Error replying to review:', err);
		return NextResponse.json(
			{ error: 'Failed to post reply to Google' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { businessId, reviewId } = await request.json();

	if (!businessId || !reviewId) {
		return NextResponse.json(
			{ error: 'businessId and reviewId are required' },
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

	const { data: review, error: reviewError } = await supabase
		.from('reviews')
		.select('id, google_review_id')
		.eq('id', reviewId)
		.eq('business_id', businessId)
		.single();

	if (reviewError || !review || !review.google_review_id) {
		return NextResponse.json({ error: 'Review not found' }, { status: 404 });
	}

	const client = new GoogleBusinessProfileClient(
		business.google_access_token!,
		business.google_refresh_token!,
		new Date(business.google_token_expires_at!),
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

		let reviewName: string | null = null;

		for (const account of accounts) {
			const locations = await client.getLocations(account.name);
			const matchingLocation = locations.find(
				(loc) => loc.metadata?.placeId === business.google_place_id
			);
			if (matchingLocation) {
				reviewName = `${matchingLocation.name}/reviews/${review.google_review_id}`;
				break;
			}
		}

		if (!reviewName) {
			return NextResponse.json(
				{ error: 'Could not find review in Google' },
				{ status: 404 }
			);
		}

		await client.deleteReply(reviewName);

		await supabase
			.from('reviews')
			.update({
				response_text: null,
				response_at: null,
				response_published_at: null,
				is_responded: false,
			})
			.eq('id', reviewId);

		return NextResponse.json({ success: true });
	} catch (err) {
		console.error('Error deleting reply:', err);
		return NextResponse.json(
			{ error: 'Failed to delete reply from Google' },
			{ status: 500 }
		);
	}
}
