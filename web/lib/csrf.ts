import { cookies } from "next/headers";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_TOKEN_LENGTH = 32;

function generateToken(): string {
	const array = new Uint8Array(CSRF_TOKEN_LENGTH);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		""
	);
}

export async function getCSRFToken(): Promise<string> {
	const cookieStore = await cookies();
	let token = cookieStore.get(CSRF_COOKIE_NAME)?.value;

	if (!token) {
		token = generateToken();
		cookieStore.set(CSRF_COOKIE_NAME, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24, // 24 hours
		});
	}

	return token;
}

export async function validateCSRFToken(token: string): Promise<boolean> {
	const cookieStore = await cookies();
	const storedToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

	if (!storedToken || !token) {
		return false;
	}

	// Constant-time comparison to prevent timing attacks
	if (storedToken.length !== token.length) {
		return false;
	}

	let result = 0;
	for (let i = 0; i < storedToken.length; i++) {
		result |= storedToken.charCodeAt(i) ^ token.charCodeAt(i);
	}

	return result === 0;
}
