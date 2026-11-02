import { SimulatorInputs } from '../types';

export interface ScoringResult {
  visibilityScore: number;
  freshnessRiskScore: number;
  positionOpportunityScore: number;
  depthGapScore: number;
  baselineScore: number;
  modelProbability: number;
  finalRefreshScore: number;
  confidence: 'high' | 'medium' | 'low';
  suggestedAction: 'expand_and_refresh' | 'refresh_and_review_ctr' | 'refresh_and_review_engagement' | 'refresh' | 'monitor';
  reasonCodes: string[];
  actionDescription: string;
  checklist: string[];
}

export function simulatePageScore(inputs: SimulatorInputs): ScoringResult {
  const {
    impressions_90d,
    clicks_90d: _clicks_90d,
    sessions_90d,
    avg_position,
    ctr,
    content_age_days,
    days_since_last_update,
    word_count,
    trend_direction,
    engagement_rate,
    scroll_rate,
  } = inputs;

  // Approximate percentile ranks based on the 30k FlyRank distribution
  const logImp = Math.log1p(impressions_90d);
  const visibilityScore = Math.min(1, Math.max(0, logImp / 10.5)); // 10.5 corresponds to ~36k impressions
  const freshnessRiskScore = Math.min(1, Math.max(0, days_since_last_update / 240));

  const normPos = Math.min(1, Math.max(0, (Math.min(50, Math.max(1, avg_position)) - 1) / 49));
  const positionOpportunityScore = (1 - normPos) * visibilityScore * (avg_position > 0 ? 1 : 0);

  const wordRank = Math.min(1, Math.max(0, word_count / 3000));
  const depthGapScore = (1 - wordRank) * visibilityScore;

  const baselineScore = Math.min(
    1,
    Math.max(
      0,
      0.4 * visibilityScore +
        0.3 * freshnessRiskScore +
        0.25 * positionOpportunityScore +
        0.05 * depthGapScore
    )
  );

  // Model probability surrogate calibrated to FlyRank Random Forest model
  let logOdds = -0.5; // base decline rate ~0.54
  if (trend_direction === 'down') logOdds += 1.35;
  if (trend_direction === 'flat') logOdds += 0.2;
  if (trend_direction === 'up') logOdds -= 1.1;

  if (content_age_days >= 180) logOdds += 0.45;
  if (days_since_last_update >= 120) logOdds += 0.55;
  if (avg_position <= 10) logOdds += 0.4;
  if (ctr < 0.2) logOdds += 0.35;
  if (impressions_90d > 1000) logOdds += 0.3;
  if (sessions_90d < 15) logOdds += 0.25;

  const modelProbability = 1 / (1 + Math.exp(-logOdds));

  // Final blended score (0 to 100)
  const finalRefreshScore = Math.min(
    100,
    Math.max(0, 100 * (0.7 * modelProbability + 0.3 * baselineScore))
  );

  // Reason codes
  const reasons: string[] = [];
  if (days_since_last_update >= 180 && impressions_90d >= 500) {
    reasons.push('stale_visible_page');
  }
  if (trend_direction === 'down' && impressions_90d >= 100) {
    reasons.push('declining_with_demand');
  }
  if (word_count > 0 && word_count < 1200 && impressions_90d >= 250) {
    reasons.push('thin_visible_page');
  }
  if (avg_position > 0 && avg_position <= 10 && content_age_days >= 180) {
    reasons.push('page_one_decay_risk');
  }
  if (impressions_90d >= 500 && avg_position > 0 && avg_position <= 20 && ctr < 0.5) {
    reasons.push('low_ctr_visible_page');
  }
  if (
    sessions_90d >= 30 &&
    ((engagement_rate > 0 && engagement_rate < 30) || (scroll_rate > 0 && scroll_rate < 30))
  ) {
    reasons.push('low_engagement_visible_page');
  }
  if (modelProbability >= 0.65) {
    reasons.push('model_decline_risk');
  }
  if (modelProbability >= 0.5 && impressions_90d >= 500) {
    reasons.push('visible_model_opportunity');
  }
  if (impressions_90d >= 500 && avg_position > 0 && avg_position <= 20 && ctr < 0.5) {
    reasons.push('ctr_review_candidate');
  }
  if (
    sessions_90d >= 30 &&
    ((engagement_rate > 0 && engagement_rate < 30) || (scroll_rate > 0 && scroll_rate < 30))
  ) {
    reasons.push('engagement_review_candidate');
  }

  const uniqueReasons = Array.from(new Set(reasons));
  if (uniqueReasons.length === 0) {
    uniqueReasons.push('general_refresh_review');
  }

  // Action mapping
  let suggestedAction: ScoringResult['suggestedAction'] = 'monitor';
  const reasonSet = new Set(uniqueReasons);

  if (reasonSet.has('thin_visible_page')) {
    suggestedAction = 'expand_and_refresh';
  } else if (
    reasonSet.has('ctr_review_candidate') &&
    (reasonSet.has('model_decline_risk') || reasonSet.has('declining_with_demand'))
  ) {
    suggestedAction = 'refresh_and_review_ctr';
  } else if (
    reasonSet.has('engagement_review_candidate') &&
    (reasonSet.has('model_decline_risk') || reasonSet.has('declining_with_demand'))
  ) {
    suggestedAction = 'refresh_and_review_engagement';
  } else if (
    reasonSet.has('model_decline_risk') ||
    reasonSet.has('declining_with_demand') ||
    reasonSet.has('stale_visible_page') ||
    reasonSet.has('visible_model_opportunity')
  ) {
    suggestedAction = 'refresh';
  }

  // Confidence calculation
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (
    finalRefreshScore >= 78 &&
    impressions_90d >= 500 &&
    sessions_90d >= 10 &&
    modelProbability >= 0.5
  ) {
    confidence = 'high';
  } else if (finalRefreshScore >= 55) {
    confidence = 'medium';
  }

  // Guidance and checklist
  let actionDescription = '';
  const checklist: string[] = [];

  switch (suggestedAction) {
    case 'refresh_and_review_ctr':
      actionDescription =
        'High Google visibility with lagging CTR on a decaying page. Prioritize SERP title tag, meta description, and snippet intent alignment before rewriting body content.';
      checklist.push('Audit current SERP snippet against top 3 competing ranking results');
      checklist.push('Rewrite meta title with clear value hook or date update');
      checklist.push('Add schema markup (FAQ, Article, Breadcrumb) for rich snippet capture');
      checklist.push('Update outdated statistics or references in the opening 2 paragraphs');
      break;
    case 'refresh_and_review_engagement':
      actionDescription =
        'Good visibility and clicks, but high bounce/low scroll rate. The user lands but leaves early.';
      checklist.push('Inspect page load speed, layout shifts (CLS), and mobile popups');
      checklist.push('Add an executive summary or quick table of contents above the fold');
      checklist.push('Embed interactive elements, tables, or visual summaries to anchor scroll');
      checklist.push('Strengthen in-article navigation and related content callouts');
      break;
    case 'expand_and_refresh':
      actionDescription =
        'Page is receiving search impressions despite thin content (<1,200 words). High potential for topical expansion.';
      checklist.push('Conduct gap analysis against competing comprehensive guides');
      checklist.push('Expand depth by adding missing subtopics, FAQs, and real examples');
      checklist.push('Update internal linking from newer related articles');
      checklist.push('Ensure primary search intent is completely answered in one place');
      break;
    case 'refresh':
      actionDescription =
        'Classic content decay with proven historical demand. Timely factual refresh needed.';
      checklist.push('Verify and update outdated facts, links, and dates');
      checklist.push('Refresh header tags (H2/H3) to match current sub-queries');
      checklist.push('Add updated screenshots, charts, or recent methodology notes');
      checklist.push('Re-publish with fresh lastmod date and submit for re-indexing');
      break;
    default:
      actionDescription =
        'Content is currently stable or low demand. Maintain and observe next 30-day reporting cycle.';
      checklist.push('No urgent editorial intervention required');
      checklist.push('Keep in observation queue for next algorithm refresh cycle');
      break;
  }

  return {
    visibilityScore,
    freshnessRiskScore,
    positionOpportunityScore,
    depthGapScore,
    baselineScore,
    modelProbability,
    finalRefreshScore,
    confidence,
    suggestedAction,
    reasonCodes: uniqueReasons,
    actionDescription,
    checklist,
  };
}
