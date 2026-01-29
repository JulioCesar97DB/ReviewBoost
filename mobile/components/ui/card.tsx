import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

interface CardProps extends ViewProps {
	style?: ViewStyle;
}

export function Card({ style, children, ...props }: CardProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: colors.card,
					borderColor: colors.border,
				},
				style,
			]}
			{...props}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		borderWidth: 1,
		padding: 16,
	},
});
