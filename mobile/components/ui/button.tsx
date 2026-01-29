import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
	ActivityIndicator,
	Pressable,
	PressableProps,
	StyleSheet,
	Text,
	ViewStyle,
} from 'react-native';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<PressableProps, 'style'> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	children: React.ReactNode;
	style?: ViewStyle;
}

export function Button({
	variant = 'default',
	size = 'default',
	isLoading = false,
	children,
	disabled,
	style,
	...props
}: ButtonProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const getVariantStyles = (): ViewStyle => {
		switch (variant) {
			case 'secondary':
				return {
					backgroundColor: colors.secondary,
				};
			case 'outline':
				return {
					backgroundColor: 'transparent',
					borderWidth: 1,
					borderColor: colors.border,
				};
			case 'ghost':
				return {
					backgroundColor: 'transparent',
				};
			case 'destructive':
				return {
					backgroundColor: colors.destructive,
				};
			default:
				return {
					backgroundColor: colors.primary,
				};
		}
	};

	const getTextColor = (): string => {
		switch (variant) {
			case 'secondary':
				return colors.secondaryForeground;
			case 'outline':
			case 'ghost':
				return colors.foreground;
			case 'destructive':
				return colors.destructiveForeground;
			default:
				return colors.primaryForeground;
		}
	};

	const getSizeStyles = (): ViewStyle => {
		switch (size) {
			case 'sm':
				return {
					height: 36,
					paddingHorizontal: 12,
				};
			case 'lg':
				return {
					height: 56,
					paddingHorizontal: 32,
				};
			case 'icon':
				return {
					height: 40,
					width: 40,
					paddingHorizontal: 0,
				};
			default:
				return {
					height: 48,
					paddingHorizontal: 20,
				};
		}
	};

	const getFontSize = (): number => {
		switch (size) {
			case 'sm':
				return 14;
			case 'lg':
				return 18;
			default:
				return 16;
		}
	};

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				getVariantStyles(),
				getSizeStyles(),
				pressed && styles.pressed,
				(disabled || isLoading) && styles.disabled,
				style,
			]}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<ActivityIndicator color={getTextColor()} size="small" />
			) : typeof children === 'string' ? (
				<Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }]}>
					{children}
				</Text>
			) : (
				children
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	pressed: {
		opacity: 0.8,
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		fontWeight: '600',
	},
});
