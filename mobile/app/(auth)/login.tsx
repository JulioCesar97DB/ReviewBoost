import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
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

export default function LoginScreen() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	const validate = (): boolean => {
		const newErrors: { email?: string; password?: string } = {};

		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Please enter a valid email';
		}

		if (!password) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleLogin = async () => {
		if (!validate()) return;

		setIsLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password,
		});

		setIsLoading(false);

		if (error) {
			Alert.alert('Error', error.message);
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
								Welcome back
							</Text>
							<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
								Sign in to your account to continue
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
								error={errors.email}
							/>

							<Input
								label="Password"
								placeholder="Enter your password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								editable={!isLoading}
								error={errors.password}
							/>

							<Link href="/forgot-password" asChild>
								<Text style={[styles.forgotPassword, { color: colors.primary }]}>
									Forgot your password?
								</Text>
							</Link>

							<Button onPress={handleLogin} isLoading={isLoading}>
								Sign In
							</Button>
						</View>

						<View style={styles.footer}>
							<Text style={[styles.footerText, { color: colors.mutedForeground }]}>
								Don&apos;t have an account?{' '}
							</Text>
							<Link href="/sign-up" asChild>
								<Text style={[styles.link, { color: colors.primary }]}>Sign up</Text>
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
	},
	form: {
		gap: 16,
	},
	forgotPassword: {
		fontSize: 14,
		fontWeight: '500',
		textAlign: 'right',
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
