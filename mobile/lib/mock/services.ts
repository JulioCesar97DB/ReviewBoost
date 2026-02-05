import type { GoogleReview } from '../google/business-profile';
import {
	AI_RESPONSE_TEMPLATES,
	MOCK_BUSINESS,
	MOCK_CONTACTS,
	MOCK_NOTIFICATIONS,
	MOCK_QR_CODES,
	MOCK_REVIEW_REQUESTS,
	MOCK_REVIEWS,
	type MockContact,
	type MockNotification,
	type MockQRCode,
	type MockReviewRequest,
} from './data';

// Simulated delay to mimic API calls
function delay(ms: number = 500): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// In-memory state for mock data (persists during session)
let mockContacts = [...MOCK_CONTACTS];
let mockReviewRequests = [...MOCK_REVIEW_REQUESTS];
let mockQRCodes = [...MOCK_QR_CODES];
let mockNotifications = [...MOCK_NOTIFICATIONS];
let mockReviews = [...MOCK_REVIEWS];
let isGoogleConnected = true;

// ============================================================================
// GOOGLE CONNECTION SERVICE
// ============================================================================

export const MockGoogleConnectionService = {
	async connect(): Promise<{ success: boolean; business: typeof MOCK_BUSINESS }> {
		await delay(1500);
		isGoogleConnected = true;
		return { success: true, business: MOCK_BUSINESS };
	},

	async disconnect(): Promise<{ success: boolean }> {
		await delay(800);
		isGoogleConnected = false;
		return { success: true };
	},

	async getConnectionStatus(): Promise<{ connected: boolean; business: typeof MOCK_BUSINESS | null }> {
		await delay(300);
		return {
			connected: isGoogleConnected,
			business: isGoogleConnected ? MOCK_BUSINESS : null,
		};
	},

	async getReviewUrl(): Promise<string> {
		await delay(200);
		return MOCK_BUSINESS.google_review_url;
	},
};

// ============================================================================
// CONTACTS SERVICE
// ============================================================================

export const MockContactsService = {
	async getAll(): Promise<MockContact[]> {
		await delay(400);
		return [...mockContacts];
	},

	async getById(id: string): Promise<MockContact | null> {
		await delay(200);
		return mockContacts.find((c) => c.id === id) || null;
	},

	async create(data: Omit<MockContact, 'id' | 'created_at' | 'review_count'>): Promise<MockContact> {
		await delay(600);
		const newContact: MockContact = {
			...data,
			id: `contact-${Date.now()}`,
			created_at: new Date().toISOString(),
			review_count: 0,
		};
		mockContacts.unshift(newContact);
		return newContact;
	},

	async update(id: string, data: Partial<MockContact>): Promise<MockContact | null> {
		await delay(500);
		const index = mockContacts.findIndex((c) => c.id === id);
		if (index === -1) return null;
		mockContacts[index] = { ...mockContacts[index], ...data };
		return mockContacts[index];
	},

	async delete(id: string): Promise<boolean> {
		await delay(400);
		const index = mockContacts.findIndex((c) => c.id === id);
		if (index === -1) return false;
		mockContacts.splice(index, 1);
		return true;
	},

	async search(query: string): Promise<MockContact[]> {
		await delay(300);
		const lowerQuery = query.toLowerCase();
		return mockContacts.filter(
			(c) =>
				c.name.toLowerCase().includes(lowerQuery) ||
				c.email.toLowerCase().includes(lowerQuery)
		);
	},

	async importFromCSV(csvData: string): Promise<{ imported: number; errors: string[] }> {
		await delay(1000);
		// Simulate CSV import
		const lines = csvData.split('\n').filter((l) => l.trim());
		const imported = Math.min(lines.length - 1, 10); // Skip header, max 10
		return { imported, errors: [] };
	},
};

// ============================================================================
// REVIEW REQUESTS SERVICE
// ============================================================================

export const MockReviewRequestsService = {
	async getAll(): Promise<MockReviewRequest[]> {
		await delay(400);
		return [...mockReviewRequests].sort(
			(a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
		);
	},

	async getByStatus(status: MockReviewRequest['status']): Promise<MockReviewRequest[]> {
		await delay(300);
		return mockReviewRequests.filter((r) => r.status === status);
	},

	async send(data: {
		contact_id: string;
		channel: 'email' | 'sms' | 'whatsapp';
		message?: string;
	}): Promise<MockReviewRequest> {
		await delay(1000);
		const contact = mockContacts.find((c) => c.id === data.contact_id);
		if (!contact) throw new Error('Contact not found');

		const newRequest: MockReviewRequest = {
			id: `request-${Date.now()}`,
			contact_id: data.contact_id,
			contact_name: contact.name,
			contact_email: contact.email,
			status: 'sent',
			channel: data.channel,
			sent_at: new Date().toISOString(),
			message: data.message,
		};
		mockReviewRequests.unshift(newRequest);

		// Update contact's last_contacted_at
		const contactIndex = mockContacts.findIndex((c) => c.id === data.contact_id);
		if (contactIndex !== -1) {
			mockContacts[contactIndex].last_contacted_at = new Date().toISOString();
		}

		return newRequest;
	},

	async sendBulk(contactIds: string[], channel: 'email' | 'sms' | 'whatsapp'): Promise<{
		sent: number;
		failed: number;
	}> {
		await delay(2000);
		let sent = 0;
		for (const contactId of contactIds) {
			try {
				await this.send({ contact_id: contactId, channel });
				sent++;
			} catch {
				// Skip failed
			}
		}
		return { sent, failed: contactIds.length - sent };
	},

	async resend(requestId: string): Promise<MockReviewRequest> {
		await delay(800);
		const index = mockReviewRequests.findIndex((r) => r.id === requestId);
		if (index === -1) throw new Error('Request not found');

		mockReviewRequests[index] = {
			...mockReviewRequests[index],
			status: 'sent',
			sent_at: new Date().toISOString(),
			opened_at: undefined,
			clicked_at: undefined,
			reviewed_at: undefined,
		};

		return mockReviewRequests[index];
	},

	async getStats(): Promise<{
		total: number;
		pending: number;
		sent: number;
		opened: number;
		clicked: number;
		reviewed: number;
		conversionRate: number;
	}> {
		await delay(300);
		const stats = {
			total: mockReviewRequests.length,
			pending: mockReviewRequests.filter((r) => r.status === 'pending').length,
			sent: mockReviewRequests.filter((r) => r.status === 'sent').length,
			opened: mockReviewRequests.filter((r) => r.status === 'opened').length,
			clicked: mockReviewRequests.filter((r) => r.status === 'clicked').length,
			reviewed: mockReviewRequests.filter((r) => r.status === 'reviewed').length,
			conversionRate: 0,
		};
		stats.conversionRate =
			stats.total > 0 ? Math.round((stats.reviewed / stats.total) * 100) : 0;
		return stats;
	},
};

// ============================================================================
// QR CODES SERVICE
// ============================================================================

export const MockQRCodesService = {
	async getAll(): Promise<MockQRCode[]> {
		await delay(400);
		return [...mockQRCodes];
	},

	async getById(id: string): Promise<MockQRCode | null> {
		await delay(200);
		return mockQRCodes.find((qr) => qr.id === id) || null;
	},

	async create(data: {
		name: string;
		style?: MockQRCode['style'];
	}): Promise<MockQRCode> {
		await delay(800);
		const newQR: MockQRCode = {
			id: `qr-${Date.now()}`,
			name: data.name,
			url: MOCK_BUSINESS.google_review_url,
			scans: 0,
			created_at: new Date().toISOString(),
			style: data.style || { foreground: '#000000', background: '#FFFFFF', logo: true },
		};
		mockQRCodes.unshift(newQR);
		return newQR;
	},

	async update(id: string, data: Partial<MockQRCode>): Promise<MockQRCode | null> {
		await delay(500);
		const index = mockQRCodes.findIndex((qr) => qr.id === id);
		if (index === -1) return null;
		mockQRCodes[index] = { ...mockQRCodes[index], ...data };
		return mockQRCodes[index];
	},

	async delete(id: string): Promise<boolean> {
		await delay(400);
		const index = mockQRCodes.findIndex((qr) => qr.id === id);
		if (index === -1) return false;
		mockQRCodes.splice(index, 1);
		return true;
	},

	async trackScan(id: string): Promise<void> {
		await delay(100);
		const index = mockQRCodes.findIndex((qr) => qr.id === id);
		if (index !== -1) {
			mockQRCodes[index].scans++;
			mockQRCodes[index].last_scanned_at = new Date().toISOString();
		}
	},

	async getStats(): Promise<{ totalQRCodes: number; totalScans: number }> {
		await delay(200);
		return {
			totalQRCodes: mockQRCodes.length,
			totalScans: mockQRCodes.reduce((sum, qr) => sum + qr.scans, 0),
		};
	},
};

// ============================================================================
// AI RESPONSE SERVICE
// ============================================================================

export const MockAIResponseService = {
	async generateResponse(review: GoogleReview): Promise<string> {
		await delay(1500); // Simulate AI processing

		const rating = {
			ONE: 1,
			TWO: 2,
			THREE: 3,
			FOUR: 4,
			FIVE: 5,
		}[review.starRating];

		let templates: string[];
		if (rating >= 4) {
			templates = AI_RESPONSE_TEMPLATES.positive;
		} else if (rating === 3) {
			templates = AI_RESPONSE_TEMPLATES.neutral;
		} else {
			templates = AI_RESPONSE_TEMPLATES.negative;
		}

		const template = templates[Math.floor(Math.random() * templates.length)];
		return template.replace('{name}', review.reviewer.displayName.split(' ')[0]);
	},

	async improveResponse(currentResponse: string): Promise<string> {
		await delay(1000);
		// Simulate AI improvement
		return currentResponse + '\n\nP.S. We\'d love to have you back soon!';
	},
};

// ============================================================================
// REVIEWS SERVICE (with reply functionality)
// ============================================================================

export const MockReviewsService = {
	async getAll(): Promise<GoogleReview[]> {
		await delay(500);
		return [...mockReviews];
	},

	async replyToReview(reviewId: string, comment: string): Promise<GoogleReview> {
		await delay(1000);
		const index = mockReviews.findIndex((r) => r.reviewId === reviewId);
		if (index === -1) throw new Error('Review not found');

		mockReviews[index] = {
			...mockReviews[index],
			reviewReply: {
				comment,
				updateTime: new Date().toISOString(),
			},
		};

		return mockReviews[index];
	},

	async deleteReply(reviewId: string): Promise<GoogleReview> {
		await delay(600);
		const index = mockReviews.findIndex((r) => r.reviewId === reviewId);
		if (index === -1) throw new Error('Review not found');

		mockReviews[index] = {
			...mockReviews[index],
			reviewReply: undefined,
		};

		return mockReviews[index];
	},

	async syncFromGoogle(): Promise<{ synced: number; new: number }> {
		await delay(2000);
		// Simulate sync - no new reviews
		return { synced: mockReviews.length, new: 0 };
	},
};

// ============================================================================
// NOTIFICATIONS SERVICE
// ============================================================================

export const MockNotificationsService = {
	async getAll(): Promise<MockNotification[]> {
		await delay(300);
		return [...mockNotifications].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	},

	async getUnread(): Promise<MockNotification[]> {
		await delay(200);
		return mockNotifications.filter((n) => !n.read);
	},

	async markAsRead(id: string): Promise<void> {
		await delay(200);
		const index = mockNotifications.findIndex((n) => n.id === id);
		if (index !== -1) {
			mockNotifications[index].read = true;
		}
	},

	async markAllAsRead(): Promise<void> {
		await delay(300);
		mockNotifications.forEach((n) => {
			n.read = true;
		});
	},

	async getUnreadCount(): Promise<number> {
		await delay(100);
		return mockNotifications.filter((n) => !n.read).length;
	},
};

// ============================================================================
// RESET MOCK DATA
// ============================================================================

export function resetAllMockData(): void {
	mockContacts = [...MOCK_CONTACTS];
	mockReviewRequests = [...MOCK_REVIEW_REQUESTS];
	mockQRCodes = [...MOCK_QR_CODES];
	mockNotifications = [...MOCK_NOTIFICATIONS];
	mockReviews = [...MOCK_REVIEWS];
	isGoogleConnected = true;
}
