// Calculator utility functions for "De Vergeten Verkoper"

/**
 * Format a number as currency in nl-BE format (€ X.XXX)
 */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Format a number with nl-BE thousands separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('nl-BE').format(Math.round(num));
}

/**
 * Calculate the ramp factor for a given month
 * Returns 1 if rampMonths is 0, otherwise a gradual curve
 * that reaches ~50% at rampMonths
 */
export function rampFactor(month: number, rampMonths: number): number {
  if (rampMonths === 0) return 1;
  const k = 4.394 / rampMonths;
  return 1 / (1 + Math.exp(-k * (month - rampMonths)));
}

/**
 * Calculate email retention factor for a given month
 * Accounts for bounces and unsubs over time (Colibry only)
 * deliveredFactor = 1 - bounceRate
 * retention(m) = (1 - unsubPerEmail)^(emailsPerMonth * m)
 * effectiveFactor(m) = deliveredFactor * retention(m)
 */
export function effectiveFactor(
  month: number,
  bounceRate: number,
  unsubPerEmail: number,
  emailsPerMonth: number
): number {
  const deliveredFactor = 1 - bounceRate;
  const retention = Math.pow(1 - unsubPerEmail, emailsPerMonth * month);
  return deliveredFactor * retention;
}

/**
 * Calculate cumulative revenue over a period with ramp-up (manual scenario, no dropoff)
 */
export function calculateCumulativeRevenue(
  monthlySteady: number,
  months: number,
  rampMonths: number
): number {
  let cumulative = 0;
  for (let m = 1; m <= months; m++) {
    cumulative += monthlySteady * rampFactor(m, rampMonths);
  }
  return cumulative;
}

/**
 * Calculate cumulative revenue with ramp-up AND drop-off (Colibry scenario)
 */
export function calculateCumulativeRevenueWithDropoff(
  monthlySteady: number,
  months: number,
  rampMonths: number,
  bounceRate: number,
  unsubPerEmail: number,
  emailsPerMonth: number
): number {
  let cumulative = 0;
  for (let m = 1; m <= months; m++) {
    const ramp = rampFactor(m, rampMonths);
    const eff = effectiveFactor(m, bounceRate, unsubPerEmail, emailsPerMonth);
    cumulative += monthlySteady * ramp * eff;
  }
  return cumulative;
}

// Input types
export interface CalculatorInputs {
  dbBuyers: number;
  visits12m: number;
  sales12m: number;
  periodUnit: 'year' | 'month';
  manualFollowUpPercent: number;
  // Settings
  workdaysPerMonth: number;
  ownershipRate: number;
  avgSalePrice: number;
  commissionPercent: number;
  upliftRatePercent: number; // RENAMED: incremental uplift on extra reach
  rampMonths: number;
  // Deliverability & drop-off
  bounceRate: number; // as decimal (0.0233 = 2.33%)
  unsubPerEmail: number; // as decimal (0.002 = 0.20%)
  emailsPerMonth: number;
  // Acquisition context (for details/uitleg only)
  acquisitionConversationsPerYear: number;
  shareMandatesWithPriorVisit: number; // baseline: 29.5% of mandates came from prior contact
  // Visits input mode
  visitsInputMode: 'tasks' | 'unique_contacts';
  // Unique visitors inputs (for unique_contacts mode)
  uniqueVisitors12mLower: number;
  uniqueVisitors12mUpper: number;
  ownerShareAmongVisitorsLow: number;
  ownerShareAmongVisitorsHigh: number;
}

// Default values - BUSINESSCASE PRESETS
export const DEFAULT_INPUTS: CalculatorInputs = {
  dbBuyers: 1109, // Unieke contacten met zoekfiche ≤12m, budget ≥350k
  visits12m: 2081, // VISIT tasks totaal in 12m (ruw, niet uniek)
  sales12m: 95, // Mandaten/jaar
  periodUnit: 'year',
  manualFollowUpPercent: 2,
  workdaysPerMonth: 22,
  ownershipRate: 71,
  avgSalePrice: 367000,
  commissionPercent: 2.78,
  upliftRatePercent: 2, // RENAMED: 2% incremental uplift on extra reach
  rampMonths: 5,
  // Deliverability
  bounceRate: 0.0233, // 2.33%
  unsubPerEmail: 0.002, // 0.20%
  emailsPerMonth: 2,
  // Acquisition context
  acquisitionConversationsPerYear: 173,
  shareMandatesWithPriorVisit: 0.295, // 29.5%
  // Visits input mode
  visitsInputMode: 'tasks',
  // Unique visitors (prepared for BigQuery data)
  uniqueVisitors12mLower: 0,
  uniqueVisitors12mUpper: 0,
  ownerShareAmongVisitorsLow: 0.60,
  ownerShareAmongVisitorsHigh: 0.70,
};

// Baseline status results (what you have today without Colibry)
export interface BaselineStatus {
  salesPerYear: number;
  priorVisitShare: number; // 29.5%
  baselineMandatesFromPriorContact: number; // sales × priorVisitShare
  baselinePercentFormatted: string; // "29,5%"
}

// Database calculation results - UPDATED FOR INCREMENTAL UPLIFT MODEL
export interface DatabaseResults {
  dbSellers: number;
  // Extra reach = pool × (colibryEffectiveCoverage - manualCoverage)
  extraReachDb: number;
  // Extra mandates = extraReach × upliftRate
  extraMandatesDb: number;
  // Revenue from extra mandates
  extraRevenueDbYearSteady: number;
  extraRevenueDb12m: number;
  extraRevenueDb24m: number;
  extraRevenueDbYear2Only: number;
  // Dropoff context
  effectiveReach12m: number; // average effective factor over 12 months
  effectiveReach24m: number;
  colibryEffectiveCoverageSteady: number;
}

// Visits calculation results (with range) - UPDATED FOR INCREMENTAL UPLIFT MODEL
export interface VisitsResults {
  visitsPerMonth: number;
  salesPerMonth: number;
  nonBuyersPerMonth: number;
  // Pool of potential sellers (60-70% of non-buyers, OR from unique visitors)
  visitSellersMonthLow: number;
  visitSellersMonthHigh: number;
  visitSellersYearLow: number;
  visitSellersYearHigh: number;
  visitSellersPerDayLow: number;
  visitSellersPerDayHigh: number;
  // Data quality indicator
  isTasksMode: boolean;
  // Extra reach = pool × (colibryEffectiveCoverage - manualCoverage)
  extraReachVisitLow: number;
  extraReachVisitHigh: number;
  // Extra mandates = extraReach × upliftRate
  extraMandatesVisitLow: number;
  extraMandatesVisitHigh: number;
  // Revenue from extra mandates
  extraRevenueVisitYearSteadyLow: number;
  extraRevenueVisitYearSteadyHigh: number;
  extraRevenueVisit12mLow: number;
  extraRevenueVisit12mHigh: number;
  extraRevenueVisit24mLow: number;
  extraRevenueVisit24mHigh: number;
  extraRevenueVisitYear2OnlyLow: number;
  extraRevenueVisitYear2OnlyHigh: number;
}

// Acquisition context results (for details/uitleg)
export interface AcquisitionContext {
  baselineMandatesFromVisits: number;
  closeRateOnceConversation: number;
}

/**
 * Get normalized visits and sales (always yearly values)
 */
function normalizeInputs(inputs: CalculatorInputs): { visits12m: number; sales12m: number } {
  if (inputs.periodUnit === 'month') {
    return {
      visits12m: inputs.visits12m * 12,
      sales12m: inputs.sales12m * 12,
    };
  }
  return {
    visits12m: inputs.visits12m,
    sales12m: inputs.sales12m,
  };
}

/**
 * Calculate baseline status (what you have today without Colibry)
 */
export function calculateBaselineStatus(inputs: CalculatorInputs): BaselineStatus {
  const { sales12m } = normalizeInputs(inputs);
  const priorVisitShare = Math.max(0, Math.min(1, inputs.shareMandatesWithPriorVisit));
  const baselineMandatesFromPriorContact = sales12m * priorVisitShare;
  
  return {
    salesPerYear: sales12m,
    priorVisitShare,
    baselineMandatesFromPriorContact: Math.round(baselineMandatesFromPriorContact),
    baselinePercentFormatted: `${(priorVisitShare * 100).toFixed(1).replace('.', ',')}%`,
  };
}

/**
 * Calculate average effective factor over a period
 */
export function calculateAverageEffectiveFactor(
  months: number,
  bounceRate: number,
  unsubPerEmail: number,
  emailsPerMonth: number
): number {
  let sum = 0;
  for (let m = 1; m <= months; m++) {
    sum += effectiveFactor(m, bounceRate, unsubPerEmail, emailsPerMonth);
  }
  return sum / months;
}

/**
 * Calculate steady-state Colibry effective coverage
 * Uses end-of-year-1 factor as approximation for steady state
 */
function calculateColibryEffectiveCoverageSteady(
  bounceRate: number,
  unsubPerEmail: number,
  emailsPerMonth: number
): number {
  return effectiveFactor(12, bounceRate, unsubPerEmail, emailsPerMonth);
}

/**
 * Calculate database potential with INCREMENTAL UPLIFT model
 * 
 * Key formula:
 * extraReach = pool × (colibryEffectiveCoverage - manualCoverage)
 * extraMandates = extraReach × upliftRate
 * 
 * The 2% is NOT an absolute conversion on pool, but incremental uplift
 * on the EXTRA reach Colibry provides beyond manual capacity.
 */
export function calculateDatabaseResults(inputs: CalculatorInputs): DatabaseResults {
  const ownershipDecimal = inputs.ownershipRate / 100;
  const manualCoverage = inputs.manualFollowUpPercent / 100;
  const upliftRate = inputs.upliftRatePercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const dbSellers = inputs.dbBuyers * ownershipDecimal;
  
  // Colibry effective coverage (steady-state, accounting for deliverability)
  const colibryEffectiveCoverageSteady = calculateColibryEffectiveCoverageSteady(
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  
  // INCREMENTAL UPLIFT MODEL:
  // extraReach = pool × (colibryEffectiveCoverage - manualCoverage)
  // extraMandates = extraReach × upliftRate
  const extraReachDb = dbSellers * Math.max(0, colibryEffectiveCoverageSteady - manualCoverage);
  const extraMandatesDb = extraReachDb * upliftRate;
  
  // Revenue from extra mandates (steady-state)
  const extraRevenueDbYearSteady = extraMandatesDb * inputs.avgSalePrice * commissionDecimal;
  const monthlyExtraRevenue = extraRevenueDbYearSteady / 12;
  
  // Apply ramp-up + dropoff to cumulative projections
  // Manual has no revenue in this model (uplift is on delta-reach, not absolute)
  // We only calculate Colibry extra revenue with ramp + dropoff
  const extraRevenueDb12m = calculateCumulativeRevenueWithDropoff(
    monthlyExtraRevenue, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueDb24m = calculateCumulativeRevenueWithDropoff(
    monthlyExtraRevenue, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueDbYear2Only = extraRevenueDb24m - extraRevenueDb12m;

  // Dropoff context
  const effectiveReach12m = calculateAverageEffectiveFactor(12, inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth);
  const effectiveReach24m = calculateAverageEffectiveFactor(24, inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth);

  return {
    dbSellers: Math.round(dbSellers),
    extraReachDb: Math.round(extraReachDb),
    extraMandatesDb: Math.round(extraMandatesDb),
    extraRevenueDbYearSteady,
    extraRevenueDb12m,
    extraRevenueDb24m,
    extraRevenueDbYear2Only,
    effectiveReach12m,
    effectiveReach24m,
    colibryEffectiveCoverageSteady,
  };
}

/**
 * Calculate visits potential with INCREMENTAL UPLIFT model
 * 
 * Supports two modes:
 * - 'tasks': Uses 60-70% heuristic on non-buyers (current fallback)
 * - 'unique_contacts': Uses actual unique visitor counts (future BigQuery data)
 * 
 * Key formula:
 * extraReach = pool × (colibryEffectiveCoverage - manualCoverage)
 * extraMandates = extraReach × upliftRate
 */
export function calculateVisitsResults(inputs: CalculatorInputs): VisitsResults {
  const { visits12m, sales12m } = normalizeInputs(inputs);
  const manualCoverage = inputs.manualFollowUpPercent / 100;
  const upliftRate = inputs.upliftRatePercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const visitsPerMonth = visits12m / 12;
  const salesPerMonth = sales12m / 12;
  const nonBuyersPerMonth = Math.max(visitsPerMonth - salesPerMonth, 0);

  let visitSellersYearLow: number;
  let visitSellersYearHigh: number;
  const isTasksMode = inputs.visitsInputMode === 'tasks';

  if (isTasksMode) {
    // Tasks mode: 60-70% heuristic (existing approach, data quality caveat)
    visitSellersYearLow = nonBuyersPerMonth * 12 * 0.60;
    visitSellersYearHigh = nonBuyersPerMonth * 12 * 0.70;
  } else {
    // Unique contacts mode: use actual unique visitor counts with owner share
    const lowerVisitors = Math.max(0, inputs.uniqueVisitors12mLower);
    const upperVisitors = Math.max(lowerVisitors, inputs.uniqueVisitors12mUpper || lowerVisitors + 43);
    visitSellersYearLow = lowerVisitors * inputs.ownerShareAmongVisitorsLow;
    visitSellersYearHigh = upperVisitors * inputs.ownerShareAmongVisitorsHigh;
  }

  const visitSellersMonthLow = visitSellersYearLow / 12;
  const visitSellersMonthHigh = visitSellersYearHigh / 12;
  const visitSellersPerDayLow = visitSellersMonthLow / inputs.workdaysPerMonth;
  const visitSellersPerDayHigh = visitSellersMonthHigh / inputs.workdaysPerMonth;

  // Colibry effective coverage (steady-state)
  const colibryEffectiveCoverageSteady = calculateColibryEffectiveCoverageSteady(
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );

  // INCREMENTAL UPLIFT MODEL:
  // extraReach = pool × (colibryEffectiveCoverage - manualCoverage)
  // extraMandates = extraReach × upliftRate
  const extraReachVisitLow = visitSellersYearLow * Math.max(0, colibryEffectiveCoverageSteady - manualCoverage);
  const extraReachVisitHigh = visitSellersYearHigh * Math.max(0, colibryEffectiveCoverageSteady - manualCoverage);
  const extraMandatesVisitLow = extraReachVisitLow * upliftRate;
  const extraMandatesVisitHigh = extraReachVisitHigh * upliftRate;

  // Revenue from extra mandates (steady-state)
  const extraRevenueVisitYearSteadyLow = extraMandatesVisitLow * inputs.avgSalePrice * commissionDecimal;
  const extraRevenueVisitYearSteadyHigh = extraMandatesVisitHigh * inputs.avgSalePrice * commissionDecimal;
  const monthlyExtraLow = extraRevenueVisitYearSteadyLow / 12;
  const monthlyExtraHigh = extraRevenueVisitYearSteadyHigh / 12;

  // Apply ramp-up + dropoff to cumulative projections
  const extraRevenueVisit12mLow = calculateCumulativeRevenueWithDropoff(
    monthlyExtraLow, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueVisit12mHigh = calculateCumulativeRevenueWithDropoff(
    monthlyExtraHigh, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueVisit24mLow = calculateCumulativeRevenueWithDropoff(
    monthlyExtraLow, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueVisit24mHigh = calculateCumulativeRevenueWithDropoff(
    monthlyExtraHigh, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const extraRevenueVisitYear2OnlyLow = extraRevenueVisit24mLow - extraRevenueVisit12mLow;
  const extraRevenueVisitYear2OnlyHigh = extraRevenueVisit24mHigh - extraRevenueVisit12mHigh;

  return {
    visitsPerMonth: Math.round(visitsPerMonth),
    salesPerMonth: Math.round(salesPerMonth),
    nonBuyersPerMonth: Math.round(nonBuyersPerMonth),
    visitSellersMonthLow: Math.round(visitSellersMonthLow),
    visitSellersMonthHigh: Math.round(visitSellersMonthHigh),
    visitSellersYearLow: Math.round(visitSellersYearLow),
    visitSellersYearHigh: Math.round(visitSellersYearHigh),
    visitSellersPerDayLow,
    visitSellersPerDayHigh,
    isTasksMode,
    extraReachVisitLow: Math.round(extraReachVisitLow),
    extraReachVisitHigh: Math.round(extraReachVisitHigh),
    extraMandatesVisitLow: Math.round(extraMandatesVisitLow),
    extraMandatesVisitHigh: Math.round(extraMandatesVisitHigh),
    extraRevenueVisitYearSteadyLow,
    extraRevenueVisitYearSteadyHigh,
    extraRevenueVisit12mLow,
    extraRevenueVisit12mHigh,
    extraRevenueVisit24mLow,
    extraRevenueVisit24mHigh,
    extraRevenueVisitYear2OnlyLow,
    extraRevenueVisitYear2OnlyHigh,
  };
}

/**
 * Calculate acquisition context metrics (for details/uitleg only)
 */
export function calculateAcquisitionContext(inputs: CalculatorInputs): AcquisitionContext {
  const { sales12m } = normalizeInputs(inputs);
  
  const baselineMandatesFromVisits = sales12m * inputs.shareMandatesWithPriorVisit;
  const closeRateOnceConversation = sales12m / inputs.acquisitionConversationsPerYear;
  
  return {
    baselineMandatesFromVisits,
    closeRateOnceConversation,
  };
}

/**
 * ViewModel for UI - separates "above the fold" from "details"
 */
export interface CalculatorViewModel {
  heroCopy: {
    title: string;
    subtitle: string;
    microcopy: string;
  };
  // Baseline status: what you have today
  baselineStatus: BaselineStatus;
  primaryOutputs: {
    extraMandatesDb: number;
    extraMandatesVisitLow: number;
    extraMandatesVisitHigh: number;
    // Revenue over time (uplift)
    extraRevenueDb12m: number;
    extraRevenueDbYear2Only: number;
    extraRevenueDb24m: number;
    extraRevenueDbYearSteady: number;
    extraRevenueVisit12mLow: number;
    extraRevenueVisit12mHigh: number;
    extraRevenueVisitYear2OnlyLow: number;
    extraRevenueVisitYear2OnlyHigh: number;
    extraRevenueVisit24mLow: number;
    extraRevenueVisit24mHigh: number;
    extraRevenueVisitYearSteadyLow: number;
    extraRevenueVisitYearSteadyHigh: number;
  };
  transparencyText: string;
  overlapWarning: string;
  detailOutputs: {
    database: DatabaseResults;
    visits: VisitsResults;
    acquisitionContext: AcquisitionContext;
  };
  rampMonths: number;
  inputs: CalculatorInputs;
}

/**
 * Build the view model for the calculator UI
 */
export function buildViewModel(
  inputs: CalculatorInputs,
  dbResults: DatabaseResults,
  visitsResults: VisitsResults
): CalculatorViewModel {
  const acquisitionContext = calculateAcquisitionContext(inputs);
  const baselineStatus = calculateBaselineStatus(inputs);
  
  return {
    heroCopy: {
      title: "De vergeten verkoper",
      subtitle: "Mini calculator",
      microcopy: "We schatten hoeveel kandidaat-kopers ook een potentiële verkoper zijn, en tonen wat je mist zonder automatische opvolging.",
    },
    baselineStatus,
    primaryOutputs: {
      extraMandatesDb: dbResults.extraMandatesDb,
      extraMandatesVisitLow: visitsResults.extraMandatesVisitLow,
      extraMandatesVisitHigh: visitsResults.extraMandatesVisitHigh,
      extraRevenueDb12m: dbResults.extraRevenueDb12m,
      extraRevenueDbYear2Only: dbResults.extraRevenueDbYear2Only,
      extraRevenueDb24m: dbResults.extraRevenueDb24m,
      extraRevenueDbYearSteady: dbResults.extraRevenueDbYearSteady,
      extraRevenueVisit12mLow: visitsResults.extraRevenueVisit12mLow,
      extraRevenueVisit12mHigh: visitsResults.extraRevenueVisit12mHigh,
      extraRevenueVisitYear2OnlyLow: visitsResults.extraRevenueVisitYear2OnlyLow,
      extraRevenueVisitYear2OnlyHigh: visitsResults.extraRevenueVisitYear2OnlyHigh,
      extraRevenueVisit24mLow: visitsResults.extraRevenueVisit24mLow,
      extraRevenueVisit24mHigh: visitsResults.extraRevenueVisit24mHigh,
      extraRevenueVisitYearSteadyLow: visitsResults.extraRevenueVisitYearSteadyLow,
      extraRevenueVisitYearSteadyHigh: visitsResults.extraRevenueVisitYearSteadyHigh,
    },
    transparencyText: `We rekenen conservatief met ${inputs.upliftRatePercent}% extra mandaten op de extra doelgroep die je dankzij nurture wél bereikt.`,
    overlapWarning: "Tel database en plaatsbezoeken niet op (mogelijke overlap).",
    detailOutputs: {
      database: dbResults,
      visits: visitsResults,
      acquisitionContext,
    },
    rampMonths: inputs.rampMonths,
    inputs,
  };
}

/**
 * Build CTA URL with all query parameters
 */
export function buildCtaUrl(
  inputs: CalculatorInputs,
  dbResults: DatabaseResults,
  visitsResults: VisitsResults
): string {
  const baseUrl = 'https://calendar.app.google/3XWQE71udWpKbLxLA';
  
  const params = new URLSearchParams({
    // Inputs
    dbBuyers: String(inputs.dbBuyers),
    visits12m: String(inputs.visits12m),
    sales12m: String(inputs.sales12m),
    periodUnit: inputs.periodUnit,
    manualFollowUpPercent: String(inputs.manualFollowUpPercent),
    upliftRatePercent: String(inputs.upliftRatePercent),
    workdaysPerMonth: String(inputs.workdaysPerMonth),
    ownershipRate: String(inputs.ownershipRate),
    avgSalePrice: String(inputs.avgSalePrice),
    commissionPercent: String(inputs.commissionPercent),
    rampMonths: String(inputs.rampMonths),
    // Dropoff settings
    bounceRate: String(inputs.bounceRate),
    unsubPerEmail: String(inputs.unsubPerEmail),
    emailsPerMonth: String(inputs.emailsPerMonth),
    // Baseline
    priorVisitShare: String(inputs.shareMandatesWithPriorVisit),
    // Visits mode
    visitsInputMode: inputs.visitsInputMode,
    uniqueVisitors12mLower: String(inputs.uniqueVisitors12mLower),
    uniqueVisitors12mUpper: String(inputs.uniqueVisitors12mUpper),
    ownerShareAmongVisitorsLow: String(inputs.ownerShareAmongVisitorsLow),
    ownerShareAmongVisitorsHigh: String(inputs.ownerShareAmongVisitorsHigh),
    // Database uplift outputs
    extraMandatesDb: String(dbResults.extraMandatesDb),
    extraRevenueDbYearSteady: String(Math.round(dbResults.extraRevenueDbYearSteady)),
    extraRevenueDb12m: String(Math.round(dbResults.extraRevenueDb12m)),
    extraRevenueDb24m: String(Math.round(dbResults.extraRevenueDb24m)),
    extraRevenueDbYear2Only: String(Math.round(dbResults.extraRevenueDbYear2Only)),
    // Visits uplift outputs
    extraMandatesVisitLow: String(visitsResults.extraMandatesVisitLow),
    extraMandatesVisitHigh: String(visitsResults.extraMandatesVisitHigh),
    extraRevenueVisitYearSteadyLow: String(Math.round(visitsResults.extraRevenueVisitYearSteadyLow)),
    extraRevenueVisitYearSteadyHigh: String(Math.round(visitsResults.extraRevenueVisitYearSteadyHigh)),
    extraRevenueVisit12mLow: String(Math.round(visitsResults.extraRevenueVisit12mLow)),
    extraRevenueVisit12mHigh: String(Math.round(visitsResults.extraRevenueVisit12mHigh)),
    extraRevenueVisit24mLow: String(Math.round(visitsResults.extraRevenueVisit24mLow)),
    extraRevenueVisit24mHigh: String(Math.round(visitsResults.extraRevenueVisit24mHigh)),
  });

  return `${baseUrl}?${params.toString()}`;
}
