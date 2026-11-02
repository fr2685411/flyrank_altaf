export interface ScoredPage {
  final_rank: string | number;
  content_id: string;
  client_id: string;
  final_refresh_score: string | number;
  best_model_name: string;
  best_model_probability: string | number;
  baseline_refresh_score: string | number;
  confidence: 'high' | 'medium' | 'low';
  suggested_action: string;
  final_reason_codes: string;
  is_declining_label: string | number;
  impressions_90d: string | number;
  clicks_90d: string | number;
  sessions_90d: string | number;
  avg_position: string | number;
  ctr: string | number;
  content_age_days: string | number;
  days_since_last_update: string | number;
  word_count: string | number;
  trend_direction: 'down' | 'flat' | 'up';
  competition_level: string;
  content_type: string;
  main_intent: string;
  age_tier: string;
  freshness_tier: string;
  word_count_tier: string;
  impression_tier: string;
  position_tier: string;
}

export interface ModelMetricRow {
  model: string;
  roc_auc: number;
  avg_precision: number;
  precision_at_50: number;
  recall: number | string;
  f1: number | string;
  isBest?: boolean;
}

export interface SimulatorInputs {
  impressions_90d: number;
  clicks_90d: number;
  sessions_90d: number;
  avg_position: number;
  ctr: number;
  content_age_days: number;
  days_since_last_update: number;
  word_count: number;
  trend_direction: 'down' | 'flat' | 'up';
  engagement_rate: number;
  scroll_rate: number;
}
