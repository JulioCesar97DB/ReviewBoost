import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = '@reviewboost/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemColorScheme = useSystemColorScheme();
	const [theme, setThemeState] = useState<Theme>('system');
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
			if (stored === 'light' || stored === 'dark' || stored === 'system') {
				setThemeState(stored);
			}
			setIsLoaded(true);
		});
	}, []);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
		AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
	}, []);

	const toggleTheme = useCallback(() => {
		const resolvedCurrent = theme === 'system' ? (systemColorScheme ?? 'light') : theme;
		const newTheme = resolvedCurrent === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
	}, [theme, systemColorScheme, setTheme]);

	const resolvedTheme: ResolvedTheme =
		theme === 'system' ? (systemColorScheme ?? 'light') : theme;

	if (!isLoaded) {
		return null;
	}

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
