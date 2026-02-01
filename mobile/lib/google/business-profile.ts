import { GOOGLE_CONFIG } from './config';
import { getStoredTokens, refreshAccessToken } from './oauth';

export interface GoogleAccount {
	name: string;
	accountName: string;
	type: 'PERSONAL' | 'LOCATION_GROUP' | 'USER_GROUP' | 'ORGANIZATION';
	verificationState: string;
	vettedState: string;
}

export interface GoogleLocation {
	name: string;
	title: string;
	storefrontAddress?: {
		addressLines: string[];
		locality: string;
		administrativeArea: string;
		postalCode: string;
		regionCode: string;
	};
	phoneNumbers?: {
		primaryPhone: string;
	};
	websiteUri?: string;
	metadata?: {
		placeId: string;
	};
}

export interface GoogleReview {
	name: string;
	reviewId: string;
	reviewer: {
		profilePhotoUrl?: string;
		displayName: string;
	};
	starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
	comment?: string;
	createTime: string;
	updateTime: string;
	reviewReply?: {
		comment: string;
		updateTime: string;
	};
}

export interface ReviewsResponse {
	reviews: GoogleReview[];
	averageRating: number;
	totalReviewCount: number;
	nextPageToken?: string;
}

const STAR_RATING_MAP: Record<string, number> = {
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4,
	FIVE: 5,
};

export function starRatingToNumber(
	starRating: GoogleReview['starRating']
): number {
	return STAR_RATING_MAP[starRating] || 0;
}

export class GoogleBusinessProfileClient {
	private accessToken: string;
	private tokenExpiresAt: Date;

	constructor(accessToken: string, tokenExpiresAt: Date) {
		this.accessToken = accessToken;
		this.tokenExpiresAt = tokenExpiresAt;
	}

	static async create(): Promise<GoogleBusinessProfileClient | null> {
		const { accessToken, expiresAt } = await getStoredTokens();

		if (!accessToken || !expiresAt) {
			return null;
		}

		const bufferTime = 5 * 60 * 1000;
		if (expiresAt.getTime() - Date.now() < bufferTime) {
			try {
				const tokens = await refreshAccessToken();
				return new GoogleBusinessProfileClient(
					tokens.access_token,
					new Date(Date.now() + tokens.expires_in * 1000)
				);
			} catch {
				return null;
			}
		}

		return new GoogleBusinessProfileClient(accessToken, expiresAt);
	}

	private async ensureValidToken(): Promise<void> {
		const bufferTime = 5 * 60 * 1000;

		if (this.tokenExpiresAt.getTime() - Date.now() < bufferTime) {
			const tokens = await refreshAccessToken();
			this.accessToken = tokens.access_token;
			this.tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
		}
	}

	private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
		await this.ensureValidToken();

		const response = await fetch(url, {
			...options,
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
				'Content-Type': 'application/json',
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Google API error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	async getAccounts(): Promise<GoogleAccount[]> {
		const response = await this.request<{ accounts: GoogleAccount[] }>(
			`${GOOGLE_CONFIG.accountsApiUrl}/accounts`
		);
		return response.accounts || [];
	}

	async getLocations(accountName: string): Promise<GoogleLocation[]> {
		const response = await this.request<{ locations: GoogleLocation[] }>(
			`${GOOGLE_CONFIG.businessInfoApiUrl}/${accountName}/locations?readMask=name,title,storefrontAddress,phoneNumbers,websiteUri,metadata`
		);
		return response.locations || [];
	}

	async getReviews(
		locationName: string,
		pageSize: number = 50,
		pageToken?: string
	): Promise<ReviewsResponse> {
		let url = `${GOOGLE_CONFIG.reviewsApiUrl}/${locationName}/reviews?pageSize=${pageSize}`;
		if (pageToken) {
			url += `&pageToken=${pageToken}`;
		}
		return this.request<ReviewsResponse>(url);
	}

	async getReview(reviewName: string): Promise<GoogleReview> {
		return this.request<GoogleReview>(
			`${GOOGLE_CONFIG.reviewsApiUrl}/${reviewName}`
		);
	}

	async replyToReview(
		reviewName: string,
		comment: string
	): Promise<GoogleReview> {
		return this.request<GoogleReview>(
			`${GOOGLE_CONFIG.reviewsApiUrl}/${reviewName}/reply`,
			{
				method: 'PUT',
				body: JSON.stringify({ comment }),
			}
		);
	}

	async deleteReply(reviewName: string): Promise<void> {
		await this.request<void>(
			`${GOOGLE_CONFIG.reviewsApiUrl}/${reviewName}/reply`,
			{ method: 'DELETE' }
		);
	}

	async getAllReviews(locationName: string): Promise<GoogleReview[]> {
		const allReviews: GoogleReview[] = [];
		let pageToken: string | undefined;

		do {
			const response = await this.getReviews(locationName, 50, pageToken);
			allReviews.push(...(response.reviews || []));
			pageToken = response.nextPageToken;
		} while (pageToken);

		return allReviews;
	}
}
