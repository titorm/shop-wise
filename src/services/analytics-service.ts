
'use client';

import { getAnalytics, logEvent, setUserId } from 'firebase/analytics';
import { app } from '@/lib/firebase';

// A good practice to type the events for consistency
type AnalyticsEvent =
  | 'login'
  | 'sign_up'
  | 'user_logged_out'
  | 'purchase_saved'
  | 'purchase_deleted'
  | 'purchase_items_updated'
  | 'shopping_list_item_added'
  | 'shopping_list_ai_suggestion_requested'
  | 'consumption_analysis_requested'
  | 'profile_updated'
  | 'preferences_updated'
  | 'plan_changed'
  | 'screen_view'; // GA4 standard event for page views

let analytics: any;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

/**
 * Tracks a custom event in Google Analytics.
 * @param eventName The name of the event to track.
 * @param properties Additional properties for the event.
 */
export const trackEvent = (
  eventName: AnalyticsEvent,
  properties?: Record<string, any>
) => {
  if (!analytics) return;
  logEvent(analytics, eventName, properties);
};

/**
 * Sets the user ID for all subsequent analytics events.
 * @param userId The unique identifier for the user.
 */
export const identifyUser = (userId: string) => {
  if (!analytics) return;
  setUserId(analytics, userId);
};

/**
 * Clears the user ID when the user logs out.
 */
export const clearUserIdentity = () => {
    if (!analytics) return;
    setUserId(analytics, null as any);
}
