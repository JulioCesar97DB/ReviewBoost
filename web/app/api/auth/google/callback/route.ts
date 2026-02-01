import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface OAuthState {
	businessId: string;
	userId: string;
	timestamp: number;
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const error = searchParams.get('error');

	const baseUrl = new URL(request.url).origin;

	if (error) {
		console.error('Google OAuth error:', error);
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=google_auth_failed&message=${encodeURIComponent(error)}`
		);
	}

	if (!code || !state) {
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=missing_params`
		);
	}

	let stateData: OAuthState;
	try {
		stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
	} catch {
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=invalid_state`
		);
	}

	const stateAge = Date.now() - stateData.timestamp;
	if (stateAge > 10 * 60 * 1000) {
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=state_expired`
		);
	}

	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || user.id !== stateData.userId) {
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=unauthorized`
		);
	}

	try {
		const tokens = await exchangeCodeForTokens(code);

		if (!tokens.refresh_token) {
			return NextResponse.redirect(
				`${baseUrl}/dashboard/settings?error=no_refresh_token`
			);
		}

		const googleUser = await getGoogleUserInfo(tokens.access_token);

		const tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

		const { error: updateError } = await supabase
			.from('businesses')
			.update({
				google_account_id: googleUser.id,
				google_access_token: tokens.access_token,
				google_refresh_token: tokens.refresh_token,
				google_token_expires_at: tokenExpiresAt.toISOString(),
				google_connected_at: new Date().toISOString(),
			})
			.eq('id', stateData.businessId)
			.eq('user_id', user.id);

		if (updateError) {
			console.error('Error updating business:', updateError);
			return NextResponse.redirect(
				`${baseUrl}/dashboard/settings?error=database_error`
			);
		}

		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?success=google_connected`
		);
	} catch (err) {
		console.error('Error in Google OAuth callback:', err);
		return NextResponse.redirect(
			`${baseUrl}/dashboard/settings?error=token_exchange_failed`
		);
	}
}
