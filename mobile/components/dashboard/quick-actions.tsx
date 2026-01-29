import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface QuickAction {
	id: string;
	title: string;
	description: string;
	icon: keyof typeof Ionicons.glyphMap;
	color: string;
}

const actions: QuickAction[] = [
	{
		id: '1',
		title: 'Send Request',
		description: 'Request a new review',
		icon: 'paper-plane',
		color: '#F59E0B',
	},
	{
		id: '2',
		title: 'View Reviews',
		description: 'See all reviews',
		icon: 'chatbubbles',
		color: '#3B82F6',
	},
	{
		id: '3',
		title: 'Analytics',
		description: 'View statistics',
		icon: 'bar-chart',
		color: '#10B981',
	},
	{
		id: '4',
		title: 'Contacts',
		description: 'Manage contacts',
		icon: 'people',
		color: '#8B5CF6',
	},
];

export function QuickActions() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	return (
		<Card style={styles.card}>
			<Text style={[styles.title, { color: colors.foreground }]}>
				Quick Actions
			</Text>
			<View style={styles.actions}>
				{actions.map((action) => (
					<Pressable
						key={action.id}
						style={({ pressed }) => [
							styles.actionItem,
							{ backgroundColor: colors.secondary },
							pressed && styles.pressed,
						]}
					>
						<View
							style={[
								styles.iconContainer,
								{ backgroundColor: action.color + '20' },
							]}
						>
							<Ionicons name={action.icon} size={22} color={action.color} />
						</View>
						<Text style={[styles.actionTitle, { color: colors.foreground }]}>
							{action.title}
						</Text>
						<Text style={[styles.actionDescription, { color: colors.mutedForeground }]}>
							{action.description}
						</Text>
					</Pressable>
				))}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
	},
	actions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	actionItem: {
		width: '47%',
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
		gap: 8,
	},
	pressed: {
		opacity: 0.7,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionTitle: {
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
	actionDescription: {
		fontSize: 12,
		textAlign: 'center',
	},
});
