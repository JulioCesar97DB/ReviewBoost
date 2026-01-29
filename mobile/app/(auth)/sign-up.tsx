import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{
		fullName?: string;
		email?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

	const validate = (): boolean => {
		const newErrors: typeof errors = {};

		if (!fullName.trim()) {
			newErrors.fullName = 'Full name is required';
		}

		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSignUp = async () => {
		if (!validate()) return;

		setIsLoading(true);

		const { error } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: {
				data: {
					full_name: fullName.trim(),
				},
			},
		});

		setIsLoading(false);

		if (error) {
			Alert.alert('Error', error.message);
		} else {
			Alert.alert(
				'Success',
				'Check your email to confirm your account',
				[
					{
						text: 'OK',
						onPress: () => router.replace('/login'),
					},
				]
			);
		}
	};

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
						<View style={styles.header}>
							<Logo size="lg" />
							<Text style={[styles.title, { color: colors.foreground }]}>
								Create account
							</Text>
							<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
								Start managing your reviews today
							</Text>
						</View>

						<View style={styles.form}>
							<Input
								label="Full Name"
								placeholder="Enter your full name"
								value={fullName}
								onChangeText={setFullName}
								autoCapitalize="words"
								autoCorrect={false}
								editable={!isLoading}
								error={errors.fullName}
							/>

							<Input
								label="Email"
								placeholder="Enter your email"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								autoCorrect={false}
								keyboardType="email-address"
								editable={!isLoading}
								error={errors.email}
							/>

							<Input
								label="Password"
								placeholder="Create a password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								editable={!isLoading}
								error={errors.password}
							/>

							<Input
								label="Confirm Password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry
								editable={!isLoading}
								error={errors.confirmPassword}
							/>

							<Button onPress={handleSignUp} isLoading={isLoading}>
								Create Account
							</Button>
						</View>

						<View style={styles.footer}>
							<Text style={[styles.footerText, { color: colors.mutedForeground }]}>
								Already have an account?{' '}
							</Text>
							<Link href="/login" asChild>
								<Text style={[styles.link, { color: colors.primary }]}>Sign in</Text>
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
	header: {
		alignItems: 'center',
		marginBottom: 32,
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
	},
	form: {
		gap: 16,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 32,
	},
	footerText: {
		fontSize: 14,
	},
	link: {
		fontSize: 14,
		fontWeight: '600',
	},
});
