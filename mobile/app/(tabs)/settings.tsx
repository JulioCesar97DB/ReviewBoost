import { GoogleIntegration } from '@/components/settings/google-integration';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItemProps {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	rightElement?: React.ReactNode;
	destructive?: boolean;
}

function SettingItem({
	icon,
	title,
	subtitle,
	onPress,
	rightElement,
	destructive,
}: SettingItemProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				styles.settingItem,
				{ borderBottomColor: colors.border },
				pressed && onPress && styles.pressed,
			]}
			disabled={!onPress}
		>
			<View
				style={[
					styles.settingIcon,
					{ backgroundColor: destructive ? colors.destructive + '20' : colors.accent },
				]}
			>
				<Ionicons
					name={icon}
					size={20}
					color={destructive ? colors.destructive : colors.primary}
				/>
			</View>
			<View style={styles.settingContent}>
				<Text
					style={[
						styles.settingTitle,
						{ color: destructive ? colors.destructive : colors.foreground },
					]}
				>
					{title}
				</Text>
				{subtitle && (
					<Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>
						{subtitle}
					</Text>
				)}
			</View>
			{rightElement || (
				onPress && (
					<Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
				)
			)}
		</Pressable>
	);
}

function SettingSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
				{title}
			</Text>
			<Card style={styles.sectionCard}>{children}</Card>
		</View>
	);
}

export default function SettingsScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const { profile, session } = useAuthContext();

	const handleSignOut = () => {
		Alert.alert(
			'Sign Out',
			'Are you sure you want to sign out?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Sign Out',
					style: 'destructive',
					onPress: async () => {
						await supabase.auth.signOut();
					},
				},
			]
		);
	};

	const userMetadata = session?.user?.user_metadata;
	const userName = userMetadata?.full_name || userMetadata?.name || profile?.full_name || 'User';
	const userEmail = session?.user?.email || '';
	const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture || profile?.avatar_url;

	return (
		<SafeAreaView
			style={[styles.safeArea, { backgroundColor: colors.background }]}
			edges={['left', 'right']}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<Card style={styles.profileCard}>
					<View style={styles.profileHeader}>
						{avatarUrl ? (
							<Image
								source={{ uri: avatarUrl }}
								style={styles.profileAvatarImage}
							/>
						) : (
							<View
								style={[
									styles.profileAvatar,
									{ backgroundColor: colors.accent },
								]}
							>
								<Text style={[styles.profileInitial, { color: colors.primary }]}>
									{userName.charAt(0).toUpperCase()}
								</Text>
							</View>
						)}
						<View style={styles.profileInfo}>
							<Text style={[styles.profileName, { color: colors.foreground }]}>
								{userName}
							</Text>
							<Text style={[styles.profileEmail, { color: colors.mutedForeground }]}>
								{userEmail}
							</Text>
						</View>
					</View>
					<Button variant="outline" onPress={() => { }}>
						Edit Profile
					</Button>
				</Card>

				<SettingSection title="PREFERENCES">
					<SettingItem
						icon="notifications"
						title="Notifications"
						subtitle="Manage notification settings"
						onPress={() => { }}
					/>
					<SettingItem
						icon="moon"
						title="Dark Mode"
						subtitle="Use dark theme"
						rightElement={
							<Switch
								value={colorScheme === 'dark'}
								onValueChange={() => { }}
								trackColor={{ false: colors.border, true: colors.primary }}
								thumbColor={colors.card}
							/>
						}
					/>
					<SettingItem
						icon="language"
						title="Language"
						subtitle="English"
						onPress={() => { }}
					/>
				</SettingSection>

				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
						INTEGRATIONS
					</Text>
					<GoogleIntegration />
				</View>

				<SettingSection title="COMING SOON">
					<SettingItem
						icon="star"
						title="Yelp"
						subtitle="Not connected"
					/>
					<SettingItem
						icon="logo-facebook"
						title="Facebook"
						subtitle="Not connected"
					/>
				</SettingSection>

				<SettingSection title="SUPPORT">
					<SettingItem
						icon="help-circle"
						title="Help Center"
						onPress={() => { }}
					/>
					<SettingItem
						icon="chatbubble"
						title="Contact Support"
						onPress={() => { }}
					/>
					<SettingItem
						icon="document-text"
						title="Terms of Service"
						onPress={() => { }}
					/>
					<SettingItem
						icon="shield-checkmark"
						title="Privacy Policy"
						onPress={() => { }}
					/>
				</SettingSection>

				<SettingSection title="ACCOUNT">
					<SettingItem
						icon="log-out"
						title="Sign Out"
						onPress={handleSignOut}
						destructive
					/>
				</SettingSection>

				<Text style={[styles.version, { color: colors.mutedForeground }]}>
					ReviewBoost v1.0.0
				</Text>

				<View style={styles.bottomSpacer} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 24,
	},
	profileCard: {
		gap: 16,
	},
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	profileAvatar: {
		width: 64,
		height: 64,
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	profileAvatarImage: {
		width: 64,
		height: 64,
		borderRadius: 32,
	},
	profileInitial: {
		fontSize: 28,
		fontWeight: '700',
	},
	profileInfo: {
		flex: 1,
		marginLeft: 16,
	},
	profileName: {
		fontSize: 20,
		fontWeight: '600',
	},
	profileEmail: {
		fontSize: 14,
		marginTop: 2,
	},
	section: {
		gap: 8,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: '600',
		letterSpacing: 0.5,
		paddingHorizontal: 4,
	},
	sectionCard: {
		padding: 0,
		overflow: 'hidden',
	},
	settingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 14,
		borderBottomWidth: 1,
		gap: 12,
	},
	pressed: {
		opacity: 0.7,
	},
	settingIcon: {
		width: 36,
		height: 36,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	settingContent: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: '500',
	},
	settingSubtitle: {
		fontSize: 13,
		marginTop: 2,
	},
	version: {
		textAlign: 'center',
		fontSize: 12,
	},
	bottomSpacer: {
		height: 80,
	},
});
