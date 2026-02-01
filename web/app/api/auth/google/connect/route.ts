import { buildGoogleAuthUrl } from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	const searchParams = request.nextUrl.searchParams;
	const businessId = searchParams.get('businessId');

	if (!businessId) {
		return NextResponse.json(
			{ error: 'businessId is required' },
			{ status: 400 }
		);
	}

	const { data: business, error } = await supabase
		.from('businesses')
		.select('id, user_id')
		.eq('id', businessId)
		.single();

	if (error || !business) {
		return NextResponse.json({ error: 'Business not found' }, { status: 404 });
	}

	if (business.user_id !== user.id) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
	}

	const state = Buffer.from(
		JSON.stringify({
			businessId,
			userId: user.id,
			timestamp: Date.now(),
		})
	).toString('base64');

	const authUrl = buildGoogleAuthUrl(state);

	return NextResponse.redirect(authUrl);
}
