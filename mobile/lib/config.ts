export const config = {
	useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true' || __DEV__,

	supabase: {
		url: process.env.EXPO_PUBLIC_SUPABASE_URL!,
		anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
	},

	google: {
		clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
	},

	webAppUrl: process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://localhost:3000',
};

export function isMockMode(): boolean {
	return config.useMockData;
}
