const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
	console.warn('EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set');
}

export const GOOGLE_CONFIG = {
	clientId: GOOGLE_CLIENT_ID || '',

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

	redirectUri: 'com.reviewboost.app:/oauth2callback',
};

export function buildGoogleAuthUrl(state: string, codeChallenge: string): string {
	const params = new URLSearchParams({
		client_id: GOOGLE_CONFIG.clientId,
		redirect_uri: GOOGLE_CONFIG.redirectUri,
		response_type: 'code',
		scope: GOOGLE_CONFIG.scopes.join(' '),
		access_type: 'offline',
		prompt: 'consent',
		state,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256',
	});

	return `${GOOGLE_CONFIG.authUrl}?${params.toString()}`;
}
