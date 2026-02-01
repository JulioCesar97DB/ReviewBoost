export const GOOGLE_CONFIG = {
	clientId: process.env.GOOGLE_CLIENT_ID!,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
	redirectUri:
		process.env.GOOGLE_REDIRECT_URI ||
		'http://localhost:3000/api/auth/google/callback',

	authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',

	accountsApiUrl: 'https://mybusinessaccountmanagement.googleapis.com/v1',
	businessInfoApiUrl: 'https://mybusinessbusinessinformation.googleapis.com/v1',
	reviewsApiUrl: 'https://mybusiness.googleapis.com/v4',

	scopes: [
		'https://www.googleapis.com/auth/business.manage',
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/userinfo.profile',
	],
};

export function buildGoogleAuthUrl(state: string): string {
	const params = new URLSearchParams({
		client_id: GOOGLE_CONFIG.clientId,
		redirect_uri: GOOGLE_CONFIG.redirectUri,
		response_type: 'code',
		scope: GOOGLE_CONFIG.scopes.join(' '),
		access_type: 'offline',
		prompt: 'consent',
		state,
	});

	return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`;
}
