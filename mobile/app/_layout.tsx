import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SplashScreenController } from '@/components/splash-screen-controller';
import { Colors } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthProvider from '@/providers/auth-provider';

function RootNavigator() {
	const { isLoggedIn } = useAuthContext();
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const customLightTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: colors.primary,
			background: colors.background,
			card: colors.card,
			text: colors.foreground,
			border: colors.border,
			notification: colors.primary,
		},
	};

	const customDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			primary: colors.primary,
			background: colors.background,
			card: colors.card,
			text: colors.foreground,
			border: colors.border,
			notification: colors.primary,
		},
	};

	return (
		<ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Protected guard={isLoggedIn}>
					<Stack.Screen name="(tabs)" />
				</Stack.Protected>
				<Stack.Protected guard={!isLoggedIn}>
					<Stack.Screen name="(auth)" />
				</Stack.Protected>
				<Stack.Screen name="+not-found" />
			</Stack>
		</ThemeProvider>
	);
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<SplashScreenController />
			<RootNavigator />
			<StatusBar style="auto" />
		</AuthProvider>
	);
}
