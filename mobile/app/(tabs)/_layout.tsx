import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.tabIconDefault,
				headerShown: true,
				headerStyle: {
					backgroundColor: colors.card,
				},
				headerTintColor: colors.foreground,
				headerShadowVisible: false,
				tabBarButton: HapticTab,
				tabBarStyle: Platform.select({
					ios: {
						position: 'absolute',
						backgroundColor: colors.card,
						borderTopColor: colors.border,
					},
					default: {
						backgroundColor: colors.card,
						borderTopColor: colors.border,
					},
				}),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Dashboard',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="grid" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="reviews"
				options={{
					title: 'Reviews',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbubbles" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="requests"
				options={{
					title: 'Requests',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="paper-plane" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="contacts"
				options={{
					title: 'Contacts',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="people" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
