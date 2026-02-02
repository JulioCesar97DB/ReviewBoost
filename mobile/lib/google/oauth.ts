import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { GOOGLE_CONFIG, buildGoogleAuthUrl } from './config';

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

const SECURE_STORE_KEYS = {
	accessToken: 'google_access_token',
	refreshToken: 'google_refresh_token',
	tokenExpiry: 'google_token_expiry',
	codeVerifier: 'google_code_verifier',
};

function generateRandomString(length: number): string {
	const charset =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
	const randomValues = Crypto.getRandomBytes(length);
	let result = '';
	for (let i = 0; i < length; i++) {
		result += charset[randomValues[i] % charset.length];
	}
	return result;
}

async function generateCodeChallenge(verifier: string): Promise<string> {
	const digest = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256,
		verifier,
		{ encoding: Crypto.CryptoEncoding.BASE64 }
	);
	return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function initiateGoogleAuth(): Promise<string> {
	const state = generateRandomString(32);
	const codeVerifier = generateRandomString(64);
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	await SecureStore.setItemAsync(SECURE_STORE_KEYS.codeVerifier, codeVerifier);

	return buildGoogleAuthUrl(state, codeChallenge);
}

export async function exchangeCodeForTokens(
	code: string
): Promise<GoogleTokens> {
	const codeVerifier = await SecureStore.getItemAsync(
		SECURE_STORE_KEYS.codeVerifier
	);

	if (!codeVerifier) {
		throw new Error('Code verifier not found. Please restart the auth flow.');
	}

	const response = await fetch(GOOGLE_CONFIG.tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			code,
			client_id: GOOGLE_CONFIG.clientId,
			redirect_uri: GOOGLE_CONFIG.redirectUri,
			grant_type: 'authorization_code',
			code_verifier: codeVerifier,
		}).toString(),
	});

	await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.codeVerifier);

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to exchange code for tokens: ${error}`);
	}

	const tokens: GoogleTokens = await response.json();

	await storeTokens(tokens);

	return tokens;
}

export async function refreshAccessToken(): Promise<GoogleTokens> {
	const refreshToken = await SecureStore.getItemAsync(
		SECURE_STORE_KEYS.refreshToken
	);

	if (!refreshToken) {
		throw new Error('No refresh token available. Please re-authenticate.');
	}

	const response = await fetch(GOOGLE_CONFIG.tokenUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			refresh_token: refreshToken,
			client_id: GOOGLE_CONFIG.clientId,
			grant_type: 'refresh_token',
		}).toString(),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to refresh access token: ${error}`);
	}

	const tokens: GoogleTokens = await response.json();

	await storeTokens(tokens);

	return tokens;
}

async function storeTokens(tokens: GoogleTokens): Promise<void> {
	await SecureStore.setItemAsync(
		SECURE_STORE_KEYS.accessToken,
		tokens.access_token
	);

	if (tokens.refresh_token) {
		await SecureStore.setItemAsync(
			SECURE_STORE_KEYS.refreshToken,
			tokens.refresh_token
		);
	}

	const expiryTime = Date.now() + tokens.expires_in * 1000;
	await SecureStore.setItemAsync(
		SECURE_STORE_KEYS.tokenExpiry,
		expiryTime.toString()
	);
}

export async function getStoredTokens(): Promise<{
	accessToken: string | null;
	refreshToken: string | null;
	expiresAt: Date | null;
}> {
	const accessToken = await SecureStore.getItemAsync(
		SECURE_STORE_KEYS.accessToken
	);
	const refreshToken = await SecureStore.getItemAsync(
		SECURE_STORE_KEYS.refreshToken
	);
	const tokenExpiry = await SecureStore.getItemAsync(
		SECURE_STORE_KEYS.tokenExpiry
	);

	return {
		accessToken,
		refreshToken,
		expiresAt: tokenExpiry ? new Date(parseInt(tokenExpiry, 10)) : null,
	};
}

export async function clearStoredTokens(): Promise<void> {
	await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.accessToken);
	await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.refreshToken);
	await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.tokenExpiry);
}

export async function getValidAccessToken(): Promise<string | null> {
	const { accessToken, expiresAt } = await getStoredTokens();

	if (!accessToken) {
		return null;
	}

	const bufferTime = 5 * 60 * 1000;
	if (expiresAt && expiresAt.getTime() - Date.now() < bufferTime) {
		try {
			const tokens = await refreshAccessToken();
			return tokens.access_token;
		} catch {
			await clearStoredTokens();
			return null;
		}
	}

	return accessToken;
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

export async function revokeGoogleToken(): Promise<void> {
	const { accessToken } = await getStoredTokens();

	if (accessToken) {
		await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
			method: 'POST',
		});
	}

	await clearStoredTokens();
}

export async function isGoogleConnected(): Promise<boolean> {
	const { accessToken, refreshToken } = await getStoredTokens();
	return !!(accessToken || refreshToken);
}
