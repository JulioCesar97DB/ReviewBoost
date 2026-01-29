import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string>();

	const validate = (): boolean => {
		if (!email.trim()) {
			setError('Email is required');
			return false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError('Please enter a valid email');
			return false;
		}
		setError(undefined);
		return true;
	};

	const handleResetPassword = async () => {
		if (!validate()) return;

		setIsLoading(true);

		const { error: resetError } = await supabase.auth.resetPasswordForEmail(
			email.trim(),
			{
				redirectTo: 'reviewboost://update-password',
			}
		);

		setIsLoading(false);

		if (resetError) {
			Alert.alert('Error', resetError.message);
		} else {
			setIsSubmitted(true);
		}
	};

	if (isSubmitted) {
		return (
			<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
				<View style={styles.container}>
					<View style={styles.successContainer}>
						<View
							style={[
								styles.iconContainer,
								{ backgroundColor: colors.accent },
							]}
						>
							<Ionicons name="mail" size={48} color={colors.primary} />
						</View>
						<Text style={[styles.title, { color: colors.foreground }]}>
							Check your email
						</Text>
						<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
							We&apos;ve sent a password reset link to {email}
						</Text>
						<Button
							onPress={() => router.replace('/login')}
							style={styles.button}
						>
							Back to Sign In
						</Button>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.container}>
						<Pressable
							onPress={() => router.back()}
							style={styles.backButton}
						>
							<Ionicons name="arrow-back" size={24} color={colors.foreground} />
						</Pressable>

						<View style={styles.header}>
							<Logo size="lg" />
							<Text style={[styles.title, { color: colors.foreground }]}>
								Forgot password?
							</Text>
							<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
								No worries, we&apos;ll send you reset instructions
							</Text>
						</View>

						<View style={styles.form}>
							<Input
								label="Email"
								placeholder="Enter your email"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="email-address"
								editable={!isLoading}
								error={error}
							/>

							<Button onPress={handleResetPassword} isLoading={isLoading}>
								Reset Password
							</Button>
						</View>

						<View style={styles.footer}>
							<Link href="/login" asChild>
								<View style={styles.backLink}>
									<Ionicons name="arrow-back" size={16} color={colors.primary} />
									<Text style={[styles.link, { color: colors.primary }]}>
										Back to sign in
									</Text>
								</View>
							</Link>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	backButton: {
		position: 'absolute',
		top: 16,
		left: 24,
		padding: 8,
	},
	header: {
		alignItems: 'center',
		marginBottom: 40,
		gap: 12,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		marginTop: 16,
	},
	subtitle: {
		fontSize: 16,
		textAlign: 'center',
		paddingHorizontal: 20,
	},
	form: {
		gap: 16,
	},
	footer: {
		alignItems: 'center',
		marginTop: 32,
	},
	backLink: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	link: {
		fontSize: 14,
		fontWeight: '600',
	},
	successContainer: {
		alignItems: 'center',
		gap: 16,
	},
	iconContainer: {
		width: 96,
		height: 96,
		borderRadius: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	button: {
		marginTop: 16,
		width: '100%',
	},
});
