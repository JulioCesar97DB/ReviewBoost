"use client";

import { Suspense } from "react";

function Year() {
	return <>{new Date().getFullYear()}</>;
}

export function CopyrightYear() {
	return (
		<Suspense fallback="2026">
			<Year />
		</Suspense>
	);
}
