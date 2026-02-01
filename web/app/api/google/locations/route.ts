import { GoogleBusinessProfileClient } from '@/lib/google';
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
			'id, user_id, google_access_token, google_refresh_token, google_token_expires_at'
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

		const allLocations = [];

		for (const account of accounts) {
			const locations = await client.getLocations(account.name);
			allLocations.push(
				...locations.map((loc) => ({
					...loc,
					accountName: account.accountName,
					accountId: account.name,
				}))
			);
		}

		return NextResponse.json({ locations: allLocations });
	} catch (err) {
		console.error('Error fetching Google locations:', err);
		return NextResponse.json(
			{ error: 'Failed to fetch locations' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { businessId, locationName, placeId } = await request.json();

	if (!businessId || !locationName || !placeId) {
		return NextResponse.json(
			{ error: 'businessId, locationName and placeId are required' },
			{ status: 400 }
		);
	}

	const { error: updateError } = await supabase
		.from('businesses')
		.update({
			google_place_id: placeId,
		})
		.eq('id', businessId)
		.eq('user_id', user.id);

	if (updateError) {
		return NextResponse.json(
			{ error: 'Failed to save location' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ success: true });
}
