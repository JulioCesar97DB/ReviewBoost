import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: colors.background,
				},
			}}
		>
			<Stack.Screen name="login" />
			<Stack.Screen name="sign-up" />
			<Stack.Screen name="forgot-password" />
		</Stack>
	);
}
