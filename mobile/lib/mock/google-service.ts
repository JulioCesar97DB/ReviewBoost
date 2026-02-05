import type {
	GoogleAccount,
	GoogleLocation,
	GoogleReview,
	ReviewsResponse,
} from '../google/business-profile';
import {
	MOCK_ACCOUNT,
	MOCK_BUSINESS,
	MOCK_LOCATION,
	MOCK_REVIEWS,
	MOCK_STATS,
} from './data';

function delay(ms: number = 500): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

let mockReviews = [...MOCK_REVIEWS];

export class MockGoogleBusinessProfileClient {
	async getAccounts(): Promise<GoogleAccount[]> {
		await delay(300);
		return [MOCK_ACCOUNT];
	}

	async getLocations(_accountName: string): Promise<GoogleLocation[]> {
		await delay(300);
		return [MOCK_LOCATION];
	}

	async getReviews(
		_locationName: string,
		pageSize: number = 50,
		pageToken?: string
	): Promise<ReviewsResponse> {
		await delay(500);

		const startIndex = pageToken ? parseInt(pageToken, 10) : 0;
		const endIndex = startIndex + pageSize;
		const paginatedReviews = mockReviews.slice(startIndex, endIndex);

		return {
			reviews: paginatedReviews,
			averageRating: MOCK_STATS.averageRating,
			totalReviewCount: MOCK_STATS.totalReviews,
			nextPageToken: endIndex < mockReviews.length ? String(endIndex) : undefined,
		};
	}

	async getReview(reviewName: string): Promise<GoogleReview> {
		await delay(200);

		const review = mockReviews.find((r) => r.name === reviewName);
		if (!review) {
			throw new Error('Review not found');
		}
		return review;
	}

	async replyToReview(reviewName: string, comment: string): Promise<GoogleReview> {
		await delay(800);

		const reviewIndex = mockReviews.findIndex((r) => r.name === reviewName);
		if (reviewIndex === -1) {
			throw new Error('Review not found');
		}

		const updatedReview: GoogleReview = {
			...mockReviews[reviewIndex],
			reviewReply: {
				comment,
				updateTime: new Date().toISOString(),
			},
		};

		mockReviews[reviewIndex] = updatedReview;
		return updatedReview;
	}

	async deleteReply(reviewName: string): Promise<void> {
		await delay(500);

		const reviewIndex = mockReviews.findIndex((r) => r.name === reviewName);
		if (reviewIndex === -1) {
			throw new Error('Review not found');
		}

		mockReviews[reviewIndex] = {
			...mockReviews[reviewIndex],
			reviewReply: undefined,
		};
	}

	async getAllReviews(_locationName: string): Promise<GoogleReview[]> {
		await delay(800);
		return [...mockReviews];
	}

	static getBusinessInfo() {
		return MOCK_BUSINESS;
	}

	static getStats() {
		const respondedCount = mockReviews.filter((r) => r.reviewReply).length;
		return {
			...MOCK_STATS,
			respondedCount,
			responseRate: Math.round((respondedCount / mockReviews.length) * 100),
		};
	}

	static resetMockData(): void {
		mockReviews = [...MOCK_REVIEWS];
	}
}

export async function mockGoogleOAuthFlow(): Promise<{
	success: boolean;
	business: typeof MOCK_BUSINESS;
}> {
	await delay(1500);

	return {
		success: true,
		business: MOCK_BUSINESS,
	};
}

export async function mockDisconnectGoogle(): Promise<{ success: boolean }> {
	await delay(500);
	return { success: true };
}
