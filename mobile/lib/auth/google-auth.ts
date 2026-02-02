import { supabase } from '@/lib/supabase';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = Linking.createURL('auth/callback');

export async function signInWithGoogle(): Promise<{ error: Error | null }> {
	try {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo,
				skipBrowserRedirect: true,
			},
		});

		if (error) {
			return { error };
		}

		if (!data.url) {
			return { error: new Error('No OAuth URL returned') };
		}

		const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

		if (result.type === 'success') {
			const { url } = result;
			const { params, errorCode } = QueryParams.getQueryParams(url);

			if (errorCode) {
				return { error: new Error(errorCode) };
			}

			const { access_token, refresh_token } = params;

			if (access_token && refresh_token) {
				const { error: sessionError } = await supabase.auth.setSession({
					access_token,
					refresh_token,
				});

				if (sessionError) {
					return { error: sessionError };
				}

				return { error: null };
			}

			return { error: new Error('No tokens in response') };
		}

		if (result.type === 'cancel' || result.type === 'dismiss') {
			return { error: new Error('Sign in cancelled') };
		}

		return { error: new Error('Authentication failed') };
	} catch (err) {
		return {
			error: err instanceof Error ? err : new Error('Unknown error occurred'),
		};
	}
}
