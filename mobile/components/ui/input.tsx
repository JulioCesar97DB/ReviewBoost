import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { forwardRef, useState } from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
	label?: string;
	error?: string;
	containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
	({ label, error, containerStyle, style, ...props }, ref) => {
		const colorScheme = useColorScheme() ?? 'light';
		const colors = Colors[colorScheme];
		const [isFocused, setIsFocused] = useState(false);

		return (
			<View style={[styles.container, containerStyle]}>
				{label && (
					<Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
				)}
				<TextInput
					ref={ref}
					style={[
						styles.input,
						{
							backgroundColor: colors.card,
							color: colors.foreground,
							borderColor: error
								? colors.destructive
								: isFocused
									? colors.primary
									: colors.border,
						},
						style,
					]}
					placeholderTextColor={colors.mutedForeground}
					onFocus={(e) => {
						setIsFocused(true);
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						setIsFocused(false);
						props.onBlur?.(e);
					}}
					{...props}
				/>
				{error && (
					<Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
				)}
			</View>
		);
	}
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
	container: {
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: '500',
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 16,
		fontSize: 16,
	},
	error: {
		fontSize: 12,
	},
});
