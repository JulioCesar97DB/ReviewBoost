import { isMockMode } from '../config';
import {
	GoogleBusinessProfileClient,
	type GoogleAccount,
	type GoogleLocation,
	type GoogleReview,
	type ReviewsResponse,
} from '../google/business-profile';
import {
	MOCK_BUSINESS,
	MOCK_STATS,
	MockGoogleBusinessProfileClient,
} from '../mock';

export interface BusinessStats {
	totalReviews: number;
	averageRating: number;
	ratingDistribution: Record<number, number>;
	respondedCount: number;
	responseRate: number;
}

export interface GoogleBusinessService {
	getAccounts(): Promise<GoogleAccount[]>;
	getLocations(accountName: string): Promise<GoogleLocation[]>;
	getReviews(locationName: string, pageSize?: number, pageToken?: string): Promise<ReviewsResponse>;
	getReview(reviewName: string): Promise<GoogleReview>;
	replyToReview(reviewName: string, comment: string): Promise<GoogleReview>;
	deleteReply(reviewName: string): Promise<void>;
	getAllReviews(locationName: string): Promise<GoogleReview[]>;
}

export async function createGoogleBusinessService(): Promise<GoogleBusinessService | null> {
	if (isMockMode()) {
		console.log('🔶 Using MOCK Google Business Profile data');
		return new MockGoogleBusinessProfileClient();
	}

	console.log('🟢 Using REAL Google Business Profile API');
	return GoogleBusinessProfileClient.create();
}

export function getBusinessStats(): BusinessStats {
	if (isMockMode()) {
		return MockGoogleBusinessProfileClient.getStats();
	}
	return MOCK_STATS;
}

export function getMockBusinessInfo() {
	return MOCK_BUSINESS;
}

export { isMockMode };
