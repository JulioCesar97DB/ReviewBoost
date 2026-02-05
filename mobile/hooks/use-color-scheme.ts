import { useTheme } from '@/providers/theme-provider';

export function useColorScheme(): 'light' | 'dark' {
	const { resolvedTheme } = useTheme();
	return resolvedTheme;
}
