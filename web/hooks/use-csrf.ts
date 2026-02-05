"use client";

import { useCallback, useEffect, useState } from "react";

export function useCSRF() {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch("/api/csrf");
			const data = await response.json();
			setToken(data.token);
		} catch (error) {
			console.error("Failed to fetch CSRF token:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchToken();
	}, [fetchToken]);

	const refreshToken = useCallback(async () => {
		setLoading(true);
		await fetchToken();
	}, [fetchToken]);

	return { token, loading, refreshToken };
}
