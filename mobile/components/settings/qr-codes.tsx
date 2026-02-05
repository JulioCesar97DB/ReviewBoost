import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isMockMode } from '@/lib/config';
import { MockGoogleConnectionService, MockQRCodesService, type MockQRCode } from '@/lib/mock';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const COLOR_THEMES = [
	{ fg: '#000000', bg: '#ffffff', name: 'Classic' },
	{ fg: '#f97316', bg: '#fff7ed', name: 'Orange' },
	{ fg: '#1e40af', bg: '#eff6ff', name: 'Blue' },
	{ fg: '#15803d', bg: '#f0fdf4', name: 'Green' },
	{ fg: '#7c3aed', bg: '#faf5ff', name: 'Purple' },
	{ fg: '#dc2626', bg: '#fef2f2', name: 'Red' },
];

interface QRCodeGeneratorModalProps {
	visible: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

function QRCodeGeneratorModal({ visible, onClose, onSuccess }: QRCodeGeneratorModalProps) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [name, setName] = useState('');
	const [selectedColor, setSelectedColor] = useState(0);
	const [saving, setSaving] = useState(false);
	const [reviewUrl, setReviewUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (visible) {
			fetchReviewUrl();
		}
	}, [visible]);

	const fetchReviewUrl = async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const url = await MockGoogleConnectionService.getReviewUrl();
				setReviewUrl(url);
				setName('My QR Code');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!name.trim()) return;
		setSaving(true);
		try {
			if (isMockMode()) {
				await MockQRCodesService.create({
					name: name.trim(),
					style: {
						foreground: COLOR_THEMES[selectedColor].fg,
						background: COLOR_THEMES[selectedColor].bg,
						logo: true,
					},
				});
				onSuccess();
				onClose();
			}
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
				<View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={colors.primary} />
					</View>
				</View>
			</Modal>
		);
	}

	if (!reviewUrl) {
		return (
			<Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
				<View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
					<View style={styles.modalHeader}>
						<Text style={[styles.modalTitle, { color: colors.foreground }]}>Generate QR Code</Text>
						<Pressable onPress={onClose}>
							<Ionicons name="close" size={24} color={colors.foreground} />
						</Pressable>
					</View>
					<View style={styles.noConnectionContainer}>
						<Ionicons name="warning-outline" size={48} color={colors.warning} />
						<Text style={[styles.noConnectionText, { color: colors.foreground }]}>
							Google Business Required
						</Text>
						<Text style={[styles.noConnectionSubtext, { color: colors.mutedForeground }]}>
							Connect your Google Business Profile to generate QR codes for reviews.
						</Text>
						<Button onPress={onClose}>Close</Button>
					</View>
				</View>
			</Modal>
		);
	}

	return (
		<Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={[styles.modalContainer, { backgroundColor: colors.background }]}
			>
				<View style={styles.modalHeader}>
					<Text style={[styles.modalTitle, { color: colors.foreground }]}>Generate QR Code</Text>
					<Pressable onPress={onClose}>
						<Ionicons name="close" size={24} color={colors.foreground} />
					</Pressable>
				</View>

				<ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
					<View style={styles.qrPreviewContainer}>
						<View style={[styles.qrPreview, { backgroundColor: COLOR_THEMES[selectedColor].bg }]}>
							<QRCode
								value={reviewUrl}
								size={200}
								color={COLOR_THEMES[selectedColor].fg}
								backgroundColor={COLOR_THEMES[selectedColor].bg}
							/>
						</View>
					</View>

					<View style={styles.formSection}>
						<Text style={[styles.label, { color: colors.foreground }]}>Name</Text>
						<TextInput
							style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
							placeholder="My QR Code"
							placeholderTextColor={colors.mutedForeground}
							value={name}
							onChangeText={setName}
						/>
					</View>

					<View style={styles.formSection}>
						<Text style={[styles.label, { color: colors.foreground }]}>Color Theme</Text>
						<View style={styles.colorOptions}>
							{COLOR_THEMES.map((theme, index) => (
								<Pressable
									key={theme.name}
									onPress={() => setSelectedColor(index)}
									style={[
										styles.colorOption,
										{ backgroundColor: theme.bg, borderColor: selectedColor === index ? colors.primary : colors.border },
										selectedColor === index && styles.colorOptionSelected,
									]}
								>
									<View style={[styles.colorDot, { backgroundColor: theme.fg }]} />
								</Pressable>
							))}
						</View>
					</View>
				</ScrollView>

				<View style={styles.modalActions}>
					<Pressable
						onPress={onClose}
						style={[styles.cancelButton, { backgroundColor: colors.secondary }]}
					>
						<Text style={[styles.cancelButtonText, { color: colors.foreground }]}>Cancel</Text>
					</Pressable>
					<Pressable
						onPress={handleSave}
						disabled={saving || !name.trim()}
						style={[styles.saveButton, { backgroundColor: colors.primary }, (!name.trim() || saving) && { opacity: 0.5 }]}
					>
						{saving ? (
							<ActivityIndicator size="small" color={colors.primaryForeground} />
						) : (
							<Text style={[styles.saveButtonText, { color: colors.primaryForeground }]}>Save QR Code</Text>
						)}
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

function QRCodeCard({
	qrCode,
	onDelete,
	deleting,
}: {
	qrCode: MockQRCode;
	onDelete: (id: string) => void;
	deleting: boolean;
}) {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Scan this QR code to leave us a review! ${qrCode.url}`,
				url: qrCode.url,
			});
		} catch {
			// Ignored
		}
	};

	const handleDelete = () => {
		Alert.alert('Delete QR Code', `Are you sure you want to delete "${qrCode.name}"?`, [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => onDelete(qrCode.id) },
		]);
	};

	return (
		<View style={[styles.qrCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
			<View style={[styles.qrCardPreview, { backgroundColor: qrCode.style.background }]}>
				<QRCode
					value={qrCode.url}
					size={60}
					color={qrCode.style.foreground}
					backgroundColor={qrCode.style.background}
				/>
			</View>
			<View style={styles.qrCardInfo}>
				<Text style={[styles.qrCardName, { color: colors.foreground }]}>{qrCode.name}</Text>
				<View style={styles.qrCardStats}>
					<Ionicons name="scan-outline" size={14} color={colors.mutedForeground} />
					<Text style={[styles.qrCardScans, { color: colors.mutedForeground }]}>{qrCode.scans} scans</Text>
				</View>
			</View>
			<View style={styles.qrCardActions}>
				<Pressable style={[styles.qrCardAction, { backgroundColor: colors.secondary }]} onPress={handleShare}>
					<Ionicons name="share-outline" size={18} color={colors.foreground} />
				</Pressable>
				<Pressable
					style={[styles.qrCardAction, { backgroundColor: colors.destructive + '15' }]}
					onPress={handleDelete}
					disabled={deleting}
				>
					{deleting ? (
						<ActivityIndicator size="small" color={colors.destructive} />
					) : (
						<Ionicons name="trash-outline" size={18} color={colors.destructive} />
					)}
				</Pressable>
			</View>
		</View>
	);
}

export function QRCodesSection() {
	const colorScheme = useColorScheme() ?? 'light';
	const colors = Colors[colorScheme];
	const [qrCodes, setQrCodes] = useState<MockQRCode[]>([]);
	const [loading, setLoading] = useState(true);
	const [showGenerator, setShowGenerator] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const fetchQRCodes = useCallback(async () => {
		setLoading(true);
		try {
			if (isMockMode()) {
				const data = await MockQRCodesService.getAll();
				setQrCodes(data);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchQRCodes();
	}, [fetchQRCodes]);

	const handleDelete = async (id: string) => {
		setDeletingId(id);
		try {
			if (isMockMode()) {
				const success = await MockQRCodesService.delete(id);
				if (success) {
					setQrCodes((prev) => prev.filter((qr) => qr.id !== id));
				}
			}
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<View style={styles.container}>
			<Card style={styles.sectionCard}>
				<View style={styles.sectionHeader}>
					<View style={styles.sectionTitleRow}>
						<Ionicons name="qr-code" size={20} color={colors.primary} />
						<Text style={[styles.sectionTitle, { color: colors.foreground }]}>QR Codes</Text>
					</View>
					<Pressable
						style={[styles.addButton, { backgroundColor: colors.primary }]}
						onPress={() => setShowGenerator(true)}
					>
						<Ionicons name="add" size={20} color={colors.primaryForeground} />
					</Pressable>
				</View>

				{loading ? (
					<View style={styles.loadingSection}>
						<ActivityIndicator size="small" color={colors.primary} />
					</View>
				) : qrCodes.length === 0 ? (
					<View style={styles.emptySection}>
						<Ionicons name="qr-code-outline" size={32} color={colors.mutedForeground} />
						<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No QR codes yet</Text>
						<Pressable
							style={[styles.emptyButton, { borderColor: colors.border }]}
							onPress={() => setShowGenerator(true)}
						>
							<Ionicons name="add" size={16} color={colors.primary} />
							<Text style={[styles.emptyButtonText, { color: colors.primary }]}>Generate QR Code</Text>
						</Pressable>
					</View>
				) : (
					<View style={styles.qrList}>
						{qrCodes.map((qrCode) => (
							<QRCodeCard
								key={qrCode.id}
								qrCode={qrCode}
								onDelete={handleDelete}
								deleting={deletingId === qrCode.id}
							/>
						))}
					</View>
				)}
			</Card>

			<QRCodeGeneratorModal
				visible={showGenerator}
				onClose={() => setShowGenerator(false)}
				onSuccess={fetchQRCodes}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	sectionCard: {
		padding: 16,
		gap: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sectionTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
	},
	addButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingSection: {
		paddingVertical: 24,
		alignItems: 'center',
	},
	emptySection: {
		alignItems: 'center',
		paddingVertical: 24,
		gap: 8,
	},
	emptyText: {
		fontSize: 14,
	},
	emptyButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		marginTop: 8,
	},
	emptyButtonText: {
		fontSize: 14,
		fontWeight: '500',
	},
	qrList: {
		gap: 12,
	},
	qrCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		gap: 12,
	},
	qrCardPreview: {
		width: 70,
		height: 70,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
	},
	qrCardInfo: {
		flex: 1,
		gap: 4,
	},
	qrCardName: {
		fontSize: 15,
		fontWeight: '600',
	},
	qrCardStats: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	qrCardScans: {
		fontSize: 13,
	},
	qrCardActions: {
		flexDirection: 'row',
		gap: 8,
	},
	qrCardAction: {
		width: 36,
		height: 36,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Modal styles
	modalContainer: {
		flex: 1,
		padding: 16,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
	},
	modalContent: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noConnectionContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
		gap: 12,
	},
	noConnectionText: {
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	noConnectionSubtext: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 8,
	},
	qrPreviewContainer: {
		alignItems: 'center',
		paddingVertical: 24,
	},
	qrPreview: {
		padding: 16,
		borderRadius: 16,
	},
	formSection: {
		gap: 8,
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
	},
	textInput: {
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
	},
	colorOptions: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	colorOption: {
		width: 48,
		height: 48,
		borderRadius: 12,
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	colorOptionSelected: {
		borderWidth: 3,
	},
	colorDot: {
		width: 20,
		height: 20,
		borderRadius: 10,
	},
	modalActions: {
		flexDirection: 'row',
		gap: 12,
		paddingVertical: 16,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
	saveButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: '600',
	},
});
