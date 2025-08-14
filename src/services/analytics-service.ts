
'use client';

import posthog from 'posthog-js';

// A good practice to type the events for consistency
type AnalyticsEvent =
  | 'user_logged_in'
  | 'user_signed_up'
  | 'user_logged_out'
  | 'purchase_saved'
  | 'purchase_deleted'
  | 'purchase_items_updated'
  | 'shopping_list_item_added'
  | 'shopping_list_ai_suggestion_requested'
  | 'consumption_analysis_requested'
  | 'profile_updated'
  | 'preferences_updated'
  | 'plan_changed';

export const trackEvent = (
  event: AnalyticsEvent,
  properties?: Record<string, any>
) => {
  posthog.capture(event, properties);
};
