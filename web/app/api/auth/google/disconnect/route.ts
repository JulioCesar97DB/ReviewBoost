import { revokeGoogleToken } from '@/lib/google';
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

	const { businessId } = await request.json();

	if (!businessId) {
		return NextResponse.json(
			{ error: 'businessId is required' },
			{ status: 400 }
		);
	}

	const { data: business, error: fetchError } = await supabase
		.from('businesses')
		.select('id, user_id, google_access_token, google_refresh_token')
		.eq('id', businessId)
		.single();

	if (fetchError || !business) {
		return NextResponse.json({ error: 'Business not found' }, { status: 404 });
	}

	if (business.user_id !== user.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	if (business.google_access_token) {
		try {
			await revokeGoogleToken(business.google_access_token);
		} catch (err) {
			console.error('Error revoking Google token:', err);
		}
	}

	const { error: updateError } = await supabase
		.from('businesses')
		.update({
			google_account_id: null,
			google_place_id: null,
			google_access_token: null,
			google_refresh_token: null,
			google_token_expires_at: null,
			google_connected_at: null,
		})
		.eq('id', businessId)
		.eq('user_id', user.id);

	if (updateError) {
		return NextResponse.json(
			{ error: 'Failed to disconnect' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ success: true });
}
