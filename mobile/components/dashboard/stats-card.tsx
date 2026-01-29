import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface StatsCardProps {
	title: string;
	value: string;
	change?: string;
	changeType?: 'positive' | 'negative' | 'neutral';
	icon: keyof typeof Ionicons.glyphMap;
}

export function StatsCard({
	title,
	value,
	change,
	changeType = 'neutral',
	icon,
}: StatsCardProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const getChangeColor = () => {
		switch (changeType) {
			case 'positive':
				return colors.success;
			case 'negative':
				return colors.destructive;
			default:
				return colors.mutedForeground;
		}
	};

	return (
		<Card style={styles.card}>
			<View style={styles.header}>
				<Text style={[styles.title, { color: colors.mutedForeground }]}>
					{title}
				</Text>
				<View
					style={[
						styles.iconContainer,
						{ backgroundColor: colors.accent },
					]}
				>
					<Ionicons name={icon} size={18} color={colors.primary} />
				</View>
			</View>
			<Text style={[styles.value, { color: colors.foreground }]}>{value}</Text>
			{change && (
				<Text style={[styles.change, { color: getChangeColor() }]}>
					{change}
				</Text>
			)}
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		flex: 1,
		minWidth: '45%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: 13,
		fontWeight: '500',
	},
	iconContainer: {
		width: 32,
		height: 32,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	value: {
		fontSize: 28,
		fontWeight: '700',
	},
	change: {
		fontSize: 12,
		marginTop: 4,
	},
});
