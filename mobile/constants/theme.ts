import { Platform } from 'react-native';

function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export const Colors = {
	light: {
		primary: hslToHex(32, 95, 50),
		primaryForeground: '#FFFFFF',
		background: hslToHex(40, 33, 98),
		foreground: hslToHex(240, 10, 10),
		card: '#FFFFFF',
		cardForeground: hslToHex(240, 10, 10),
		secondary: hslToHex(40, 20, 95),
		secondaryForeground: hslToHex(240, 10, 20),
		muted: hslToHex(40, 15, 95),
		mutedForeground: hslToHex(240, 5, 45),
		accent: hslToHex(32, 80, 92),
		accentForeground: hslToHex(32, 80, 30),
		destructive: hslToHex(0, 72, 51),
		destructiveForeground: '#FFFFFF',
		border: hslToHex(40, 15, 90),
		input: hslToHex(40, 15, 90),
		success: hslToHex(142, 71, 45),
		successForeground: '#FFFFFF',
		warning: hslToHex(45, 93, 47),
		warningForeground: hslToHex(0, 0, 10),
		star: hslToHex(45, 93, 47),
		text: hslToHex(240, 10, 10),
		tint: hslToHex(32, 95, 50),
		icon: hslToHex(240, 5, 45),
		tabIconDefault: hslToHex(240, 5, 45),
		tabIconSelected: hslToHex(32, 95, 50),
	},
	dark: {
		primary: hslToHex(32, 90, 55),
		primaryForeground: hslToHex(240, 10, 10),
		background: hslToHex(240, 10, 8),
		foreground: hslToHex(40, 20, 96),
		card: hslToHex(240, 10, 11),
		cardForeground: hslToHex(40, 20, 96),
		secondary: hslToHex(240, 8, 16),
		secondaryForeground: hslToHex(40, 15, 92),
		muted: hslToHex(240, 8, 16),
		mutedForeground: hslToHex(40, 10, 60),
		accent: hslToHex(32, 40, 20),
		accentForeground: hslToHex(32, 80, 80),
		destructive: hslToHex(0, 62, 45),
		destructiveForeground: hslToHex(0, 0, 98),
		border: hslToHex(240, 8, 18),
		input: hslToHex(240, 8, 18),
		success: hslToHex(142, 71, 50),
		successForeground: hslToHex(0, 0, 10),
		warning: hslToHex(45, 93, 50),
		warningForeground: hslToHex(0, 0, 10),
		star: hslToHex(45, 93, 50),
		text: hslToHex(40, 20, 96),
		tint: hslToHex(32, 90, 55),
		icon: hslToHex(40, 10, 60),
		tabIconDefault: hslToHex(40, 10, 60),
		tabIconSelected: hslToHex(32, 90, 55),
	},
};

export const Fonts = Platform.select({
	ios: {
		sans: 'system-ui',
		serif: 'ui-serif',
		rounded: 'ui-rounded',
		mono: 'ui-monospace',
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace',
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
});
