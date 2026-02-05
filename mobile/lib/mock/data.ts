import type { GoogleAccount, GoogleLocation, GoogleReview } from '../google/business-profile';

export const MOCK_BUSINESS = {
	id: 'mock-business-123',
	name: 'CodeCraft Studio',
	google_place_id: 'ChIJmock123456789',
	google_account_id: 'accounts/mock-account-123',
	google_location_id: 'locations/mock-location-123',
};

export const MOCK_ACCOUNT: GoogleAccount = {
	name: 'accounts/mock-account-123',
	accountName: 'CodeCraft Studio',
	type: 'PERSONAL',
	verificationState: 'VERIFIED',
	vettedState: 'VETTED',
};

export const MOCK_LOCATION: GoogleLocation = {
	name: 'accounts/mock-account-123/locations/mock-location-123',
	title: 'CodeCraft Studio',
	storefrontAddress: {
		addressLines: ['123 Developer Lane'],
		locality: 'San Francisco',
		administrativeArea: 'CA',
		postalCode: '94105',
		regionCode: 'US',
	},
	phoneNumbers: {
		primaryPhone: '+1 (555) 123-4567',
	},
	websiteUri: 'https://codecraft.studio',
	metadata: {
		placeId: 'ChIJmock123456789',
	},
};

const reviewerNames = [
	'Sarah Mitchell',
	'John Davidson',
	'Emily Chen',
	'Michael Roberts',
	'Jessica Williams',
	'David Thompson',
	'Amanda Garcia',
	'Christopher Lee',
	'Rachel Brown',
	'Daniel Martinez',
	'Laura Johnson',
	'James Wilson',
	'Michelle Anderson',
	'Robert Taylor',
	'Jennifer Moore',
];

const positiveComments = [
	'Excellent work on our website! The team was professional and delivered exactly what we needed. Highly recommended!',
	'Outstanding service! They transformed our outdated site into a modern, responsive masterpiece. Very happy with the results.',
	'Best web development agency we\'ve worked with. Clear communication, on-time delivery, and beautiful design.',
	'They built our e-commerce platform from scratch and it\'s been running flawlessly. Great attention to detail!',
	'Fantastic experience working with CodeCraft Studio. They understood our vision and executed it perfectly.',
	'Professional team that goes above and beyond. Our new app has received amazing feedback from users.',
	'Quick turnaround and excellent quality. Will definitely use them for future projects.',
	'They made the entire process so easy. From design to deployment, everything was handled professionally.',
	'Our website traffic increased by 200% after the redesign. Couldn\'t be happier!',
	'The team is incredibly talented and responsive. They fixed issues immediately and added great suggestions.',
];

const neutralComments = [
	'Good work overall. The project took a bit longer than expected but the end result was satisfactory.',
	'Decent service. The website works well, though there were some communication delays during the project.',
	'They delivered what was promised. Nothing extraordinary but solid work.',
	'The site looks good. Had some minor issues that needed fixing after launch but they resolved them.',
];

const negativeComments = [
	'Project went over timeline. Final product is okay but expected better communication throughout.',
	'Had some misunderstandings about requirements. They fixed most issues but it took extra time.',
];

function getRandomDate(daysAgo: number): string {
	const date = new Date();
	date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
	return date.toISOString();
}

function getRandomRating(): GoogleReview['starRating'] {
	const weights = { FIVE: 50, FOUR: 30, THREE: 12, TWO: 5, ONE: 3 };
	const total = Object.values(weights).reduce((a, b) => a + b, 0);
	let random = Math.random() * total;

	for (const [rating, weight] of Object.entries(weights)) {
		random -= weight;
		if (random <= 0) {
			return rating as GoogleReview['starRating'];
		}
	}
	return 'FIVE';
}

function getCommentForRating(rating: GoogleReview['starRating']): string {
	if (rating === 'FIVE' || rating === 'FOUR') {
		return positiveComments[Math.floor(Math.random() * positiveComments.length)];
	} else if (rating === 'THREE') {
		return neutralComments[Math.floor(Math.random() * neutralComments.length)];
	} else {
		return negativeComments[Math.floor(Math.random() * negativeComments.length)];
	}
}

function generateMockReview(index: number): GoogleReview {
	const rating = getRandomRating();
	const hasReply = rating === 'FIVE' || rating === 'FOUR' ? Math.random() > 0.3 : Math.random() > 0.7;
	const createTime = getRandomDate(180);

	return {
		name: `accounts/mock-account-123/locations/mock-location-123/reviews/review-${index}`,
		reviewId: `review-${index}`,
		reviewer: {
			displayName: reviewerNames[index % reviewerNames.length],
			profilePhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerNames[index % reviewerNames.length])}&background=random`,
		},
		starRating: rating,
		comment: getCommentForRating(rating),
		createTime,
		updateTime: createTime,
		reviewReply: hasReply
			? {
				comment: 'Thank you so much for your wonderful feedback! We truly appreciate you taking the time to share your experience. Looking forward to working with you again!',
				updateTime: new Date(new Date(createTime).getTime() + 86400000).toISOString(),
			}
			: undefined,
	};
}

export const MOCK_REVIEWS: GoogleReview[] = Array.from({ length: 25 }, (_, i) =>
	generateMockReview(i)
).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

export function calculateMockStats() {
	const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
	let totalRating = 0;

	const ratingMap: Record<string, number> = {
		ONE: 1,
		TWO: 2,
		THREE: 3,
		FOUR: 4,
		FIVE: 5,
	};

	for (const review of MOCK_REVIEWS) {
		const numRating = ratingMap[review.starRating];
		ratingCounts[numRating as keyof typeof ratingCounts]++;
		totalRating += numRating;
	}

	const avgRating = totalRating / MOCK_REVIEWS.length;
	const respondedCount = MOCK_REVIEWS.filter((r) => r.reviewReply).length;

	return {
		totalReviews: MOCK_REVIEWS.length,
		averageRating: Math.round(avgRating * 10) / 10,
		ratingDistribution: ratingCounts,
		respondedCount,
		responseRate: Math.round((respondedCount / MOCK_REVIEWS.length) * 100),
	};
}

export const MOCK_STATS = calculateMockStats();
