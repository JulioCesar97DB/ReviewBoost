import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface LogoProps {
	size?: 'sm' | 'md' | 'lg';
	showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const iconSizes = {
		sm: 20,
		md: 28,
		lg: 40,
	};

	const textSizes = {
		sm: 18,
		md: 24,
		lg: 32,
	};

	const containerSizes = {
		sm: 32,
		md: 44,
		lg: 60,
	};

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.iconContainer,
					{
						backgroundColor: colors.primary,
						width: containerSizes[size],
						height: containerSizes[size],
						borderRadius: containerSizes[size] / 4,
					},
				]}
			>
				<Ionicons name="star" size={iconSizes[size]} color={colors.primaryForeground} />
			</View>
			{showText && (
				<Text
					style={[
						styles.text,
						{
							color: colors.foreground,
							fontSize: textSizes[size],
						},
					]}
				>
					ReviewBoost
				</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontWeight: '700',
	},
});
