import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import type { GoogleUserInfo } from '../lib/google';
import {
	clearStoredTokens,
	exchangeCodeForTokens,
	getGoogleUserInfo,
	getStoredTokens,
	initiateGoogleAuth,
	revokeGoogleToken,
} from '../lib/google';

WebBrowser.maybeCompleteAuthSession();

interface UseGoogleAuthReturn {
	isConnected: boolean;
	isLoading: boolean;
	user: GoogleUserInfo | null;
	error: string | null;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	checkConnection: () => Promise<void>;
}

export function useGoogleAuth(): UseGoogleAuthReturn {
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<GoogleUserInfo | null>(null);
	const [error, setError] = useState<string | null>(null);

	const checkConnection = useCallback(async () => {
		try {
			setIsLoading(true);
			const { accessToken } = await getStoredTokens();

			if (accessToken) {
				const userInfo = await getGoogleUserInfo(accessToken);
				setUser(userInfo);
				setIsConnected(true);
			} else {
				setUser(null);
				setIsConnected(false);
			}
		} catch {
			setUser(null);
			setIsConnected(false);
			await clearStoredTokens();
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkConnection();
	}, [checkConnection]);

	const connect = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const authUrl = await initiateGoogleAuth();

			const result = await WebBrowser.openAuthSessionAsync(
				authUrl,
				Linking.createURL('oauth2callback')
			);

			if (result.type === 'success' && result.url) {
				const url = new URL(result.url);
				const code = url.searchParams.get('code');
				const errorParam = url.searchParams.get('error');

				if (errorParam) {
					throw new Error(`Google auth error: ${errorParam}`);
				}

				if (!code) {
					throw new Error('No authorization code received');
				}

				const tokens = await exchangeCodeForTokens(code);
				const userInfo = await getGoogleUserInfo(tokens.access_token);

				setUser(userInfo);
				setIsConnected(true);
			} else if (result.type === 'cancel') {
				setError('Authentication was cancelled');
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to connect to Google';
			setError(message);
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const disconnect = useCallback(async () => {
		try {
			setIsLoading(true);
			await revokeGoogleToken();
			setUser(null);
			setIsConnected(false);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to disconnect from Google';
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		isConnected,
		isLoading,
		user,
		error,
		connect,
		disconnect,
		checkConnection,
	};
}
