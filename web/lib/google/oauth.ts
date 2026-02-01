import { GOOGLE_CONFIG } from './config';

export interface GoogleTokens {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
	scope: string;
}

export interface GoogleUserInfo {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

export async function exchangeCodeForTokens(
	code: string
): Promise<GoogleTokens> {
	const response = await fetch(GOOGLE_CONFIG.tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			code,
			client_id: GOOGLE_CONFIG.clientId,
			client_secret: GOOGLE_CONFIG.clientSecret,
			redirect_uri: GOOGLE_CONFIG.redirectUri,
			grant_type: 'authorization_code',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to exchange code for tokens: ${error}`);
	}

	return response.json();
}

export async function refreshAccessToken(
	refreshToken: string
): Promise<GoogleTokens> {
	const response = await fetch(GOOGLE_CONFIG.tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			refresh_token: refreshToken,
			client_id: GOOGLE_CONFIG.clientId,
			client_secret: GOOGLE_CONFIG.clientSecret,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to refresh access token: ${error}`);
	}

	return response.json();
}

export async function getGoogleUserInfo(
	accessToken: string
): Promise<GoogleUserInfo> {
	const response = await fetch(
		'https://www.googleapis.com/oauth2/v2/userinfo',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	if (!response.ok) {
		throw new Error('Failed to get user info from Google');
	}

	return response.json();
}

export async function revokeGoogleToken(token: string): Promise<void> {
	await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
		method: 'POST',
	});
}
