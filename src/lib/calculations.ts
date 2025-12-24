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
  conversionRatePercent: number;
  rampMonths: number;
  // Deliverability & drop-off
  bounceRate: number; // as decimal (0.0233 = 2.33%)
  unsubPerEmail: number; // as decimal (0.002 = 0.20%)
  emailsPerMonth: number;
  // Acquisition context (for details/uitleg only)
  acquisitionConversationsPerYear: number;
  shareMandatesWithPriorVisit: number;
}

// Default values
export const DEFAULT_INPUTS: CalculatorInputs = {
  dbBuyers: 3648,
  visits12m: 1900,
  sales12m: 95,
  periodUnit: 'year',
  manualFollowUpPercent: 2,
  workdaysPerMonth: 22,
  ownershipRate: 71,
  avgSalePrice: 367000,
  commissionPercent: 2.78,
  conversionRatePercent: 2,
  rampMonths: 5,
  // Deliverability
  bounceRate: 0.0233, // 2.33%
  unsubPerEmail: 0.002, // 0.20%
  emailsPerMonth: 2,
  // Acquisition context
  acquisitionConversationsPerYear: 173,
  shareMandatesWithPriorVisit: 0.295, // 29.5%
};

// Database calculation results
export interface DatabaseResults {
  dbSellers: number;
  // Manual scenario
  dbWarmManual: number;
  dbDealsManual: number;
  revenueDbYearSteadyManual: number;
  revenueDb12mManual: number;
  revenueDb24mManual: number;
  revenueDbYear2OnlyManual: number;
  // Colibry scenario (with dropoff)
  dbWarmColibry: number;
  dbDealsColibry: number;
  revenueDbYearSteadyColibry: number;
  revenueDb12mColibry: number;
  revenueDb24mColibry: number;
  revenueDbYear2OnlyColibry: number;
  // Delta (Colibry - Manual)
  extraDealsDb: number;
  extraRevenueDbYearSteady: number;
  extraRevenueDb12m: number;
  extraRevenueDb24m: number;
  extraRevenueDbYear2Only: number;
  // Dropoff context
  effectiveReach12m: number; // average effective factor over 12 months
  effectiveReach24m: number;
}

// Visits calculation results (with range)
export interface VisitsResults {
  visitsPerMonth: number;
  salesPerMonth: number;
  nonBuyersPerMonth: number;
  visitSellersMonthLow: number;
  visitSellersMonthHigh: number;
  visitSellersYearLow: number;
  visitSellersYearHigh: number;
  visitSellersPerDayLow: number;
  visitSellersPerDayHigh: number;
  // Manual scenario
  visitWarmManualLow: number;
  visitWarmManualHigh: number;
  visitDealsManualLow: number;
  visitDealsManualHigh: number;
  revenueVisitYearSteadyManualLow: number;
  revenueVisitYearSteadyManualHigh: number;
  revenueVisit12mManualLow: number;
  revenueVisit12mManualHigh: number;
  revenueVisit24mManualLow: number;
  revenueVisit24mManualHigh: number;
  revenueVisitYear2OnlyManualLow: number;
  revenueVisitYear2OnlyManualHigh: number;
  // Colibry scenario (with dropoff)
  visitWarmColibryLow: number;
  visitWarmColibryHigh: number;
  visitDealsColibryLow: number;
  visitDealsColibryHigh: number;
  revenueVisitYearSteadyColibryLow: number;
  revenueVisitYearSteadyColibryHigh: number;
  revenueVisit12mColibryLow: number;
  revenueVisit12mColibryHigh: number;
  revenueVisit24mColibryLow: number;
  revenueVisit24mColibryHigh: number;
  revenueVisitYear2OnlyColibryLow: number;
  revenueVisitYear2OnlyColibryHigh: number;
  // Delta (Colibry - Manual)
  extraDealsVisitLow: number;
  extraDealsVisitHigh: number;
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
 * Calculate average effective factor over a period
 */
function calculateAverageEffectiveFactor(
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
 * Calculate database potential with Manual vs Colibry scenarios
 * Colibry includes dropoff from bounces/unsubs
 */
export function calculateDatabaseResults(inputs: CalculatorInputs): DatabaseResults {
  const ownershipDecimal = inputs.ownershipRate / 100;
  const manualCoverage = inputs.manualFollowUpPercent / 100;
  const colibryCoverage = 1.0; // 100%
  const conversionRate = inputs.conversionRatePercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const dbSellers = inputs.dbBuyers * ownershipDecimal;

  // Manual scenario (no dropoff)
  const dbWarmManual = dbSellers * manualCoverage;
  const dbDealsManual = dbWarmManual * conversionRate;
  const revenueDbYearSteadyManual = dbDealsManual * inputs.avgSalePrice * commissionDecimal;
  const monthlyDbSteadyManual = revenueDbYearSteadyManual / 12;
  const revenueDb12mManual = calculateCumulativeRevenue(monthlyDbSteadyManual, 12, inputs.rampMonths);
  const revenueDb24mManual = calculateCumulativeRevenue(monthlyDbSteadyManual, 24, inputs.rampMonths);
  const revenueDbYear2OnlyManual = revenueDb24mManual - revenueDb12mManual;

  // Colibry scenario (with dropoff)
  const dbWarmColibry = dbSellers * colibryCoverage;
  const dbDealsColibry = dbWarmColibry * conversionRate;
  const revenueDbYearSteadyColibry = dbDealsColibry * inputs.avgSalePrice * commissionDecimal;
  const monthlyDbSteadyColibry = revenueDbYearSteadyColibry / 12;
  
  // Apply dropoff to Colibry cumulative revenue
  const revenueDb12mColibry = calculateCumulativeRevenueWithDropoff(
    monthlyDbSteadyColibry, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueDb24mColibry = calculateCumulativeRevenueWithDropoff(
    monthlyDbSteadyColibry, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueDbYear2OnlyColibry = revenueDb24mColibry - revenueDb12mColibry;

  // Delta
  const extraDealsDb = dbDealsColibry - dbDealsManual;
  const extraRevenueDbYearSteady = revenueDbYearSteadyColibry - revenueDbYearSteadyManual;
  const extraRevenueDb12m = revenueDb12mColibry - revenueDb12mManual;
  const extraRevenueDb24m = revenueDb24mColibry - revenueDb24mManual;
  const extraRevenueDbYear2Only = revenueDbYear2OnlyColibry - revenueDbYear2OnlyManual;

  // Dropoff context
  const effectiveReach12m = calculateAverageEffectiveFactor(12, inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth);
  const effectiveReach24m = calculateAverageEffectiveFactor(24, inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth);

  return {
    dbSellers: Math.round(dbSellers),
    dbWarmManual: Math.round(dbWarmManual),
    dbDealsManual: Math.round(dbDealsManual),
    revenueDbYearSteadyManual,
    revenueDb12mManual,
    revenueDb24mManual,
    revenueDbYear2OnlyManual,
    dbWarmColibry: Math.round(dbWarmColibry),
    dbDealsColibry: Math.round(dbDealsColibry),
    revenueDbYearSteadyColibry,
    revenueDb12mColibry,
    revenueDb24mColibry,
    revenueDbYear2OnlyColibry,
    extraDealsDb: Math.round(extraDealsDb),
    extraRevenueDbYearSteady,
    extraRevenueDb12m,
    extraRevenueDb24m,
    extraRevenueDbYear2Only,
    effectiveReach12m,
    effectiveReach24m,
  };
}

/**
 * Calculate visits potential with 60-70% range and Manual vs Colibry scenarios
 * Colibry includes dropoff from bounces/unsubs
 */
export function calculateVisitsResults(inputs: CalculatorInputs): VisitsResults {
  const { visits12m, sales12m } = normalizeInputs(inputs);
  const manualCoverage = inputs.manualFollowUpPercent / 100;
  const colibryCoverage = 1.0; // 100%
  const conversionRate = inputs.conversionRatePercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const visitsPerMonth = visits12m / 12;
  const salesPerMonth = sales12m / 12;
  const nonBuyersPerMonth = Math.max(visitsPerMonth - salesPerMonth, 0);

  // 60-70% range of non-buyers are potential sellers
  const visitSellersMonthLow = nonBuyersPerMonth * 0.60;
  const visitSellersMonthHigh = nonBuyersPerMonth * 0.70;
  const visitSellersYearLow = visitSellersMonthLow * 12;
  const visitSellersYearHigh = visitSellersMonthHigh * 12;

  // Per day calculation
  const visitSellersPerDayLow = visitSellersMonthLow / inputs.workdaysPerMonth;
  const visitSellersPerDayHigh = visitSellersMonthHigh / inputs.workdaysPerMonth;

  // Manual scenario (no dropoff)
  const visitWarmManualLow = visitSellersYearLow * manualCoverage;
  const visitWarmManualHigh = visitSellersYearHigh * manualCoverage;
  const visitDealsManualLow = visitWarmManualLow * conversionRate;
  const visitDealsManualHigh = visitWarmManualHigh * conversionRate;
  const revenueVisitYearSteadyManualLow = visitDealsManualLow * inputs.avgSalePrice * commissionDecimal;
  const revenueVisitYearSteadyManualHigh = visitDealsManualHigh * inputs.avgSalePrice * commissionDecimal;
  const monthlyManualLow = revenueVisitYearSteadyManualLow / 12;
  const monthlyManualHigh = revenueVisitYearSteadyManualHigh / 12;
  const revenueVisit12mManualLow = calculateCumulativeRevenue(monthlyManualLow, 12, inputs.rampMonths);
  const revenueVisit12mManualHigh = calculateCumulativeRevenue(monthlyManualHigh, 12, inputs.rampMonths);
  const revenueVisit24mManualLow = calculateCumulativeRevenue(monthlyManualLow, 24, inputs.rampMonths);
  const revenueVisit24mManualHigh = calculateCumulativeRevenue(monthlyManualHigh, 24, inputs.rampMonths);
  const revenueVisitYear2OnlyManualLow = revenueVisit24mManualLow - revenueVisit12mManualLow;
  const revenueVisitYear2OnlyManualHigh = revenueVisit24mManualHigh - revenueVisit12mManualHigh;

  // Colibry scenario (with dropoff)
  const visitWarmColibryLow = visitSellersYearLow * colibryCoverage;
  const visitWarmColibryHigh = visitSellersYearHigh * colibryCoverage;
  const visitDealsColibryLow = visitWarmColibryLow * conversionRate;
  const visitDealsColibryHigh = visitWarmColibryHigh * conversionRate;
  const revenueVisitYearSteadyColibryLow = visitDealsColibryLow * inputs.avgSalePrice * commissionDecimal;
  const revenueVisitYearSteadyColibryHigh = visitDealsColibryHigh * inputs.avgSalePrice * commissionDecimal;
  const monthlyColibryLow = revenueVisitYearSteadyColibryLow / 12;
  const monthlyColibryHigh = revenueVisitYearSteadyColibryHigh / 12;
  
  // Apply dropoff to Colibry cumulative revenue
  const revenueVisit12mColibryLow = calculateCumulativeRevenueWithDropoff(
    monthlyColibryLow, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueVisit12mColibryHigh = calculateCumulativeRevenueWithDropoff(
    monthlyColibryHigh, 12, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueVisit24mColibryLow = calculateCumulativeRevenueWithDropoff(
    monthlyColibryLow, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueVisit24mColibryHigh = calculateCumulativeRevenueWithDropoff(
    monthlyColibryHigh, 24, inputs.rampMonths,
    inputs.bounceRate, inputs.unsubPerEmail, inputs.emailsPerMonth
  );
  const revenueVisitYear2OnlyColibryLow = revenueVisit24mColibryLow - revenueVisit12mColibryLow;
  const revenueVisitYear2OnlyColibryHigh = revenueVisit24mColibryHigh - revenueVisit12mColibryHigh;

  // Delta
  const extraDealsVisitLow = visitDealsColibryLow - visitDealsManualLow;
  const extraDealsVisitHigh = visitDealsColibryHigh - visitDealsManualHigh;
  const extraRevenueVisitYearSteadyLow = revenueVisitYearSteadyColibryLow - revenueVisitYearSteadyManualLow;
  const extraRevenueVisitYearSteadyHigh = revenueVisitYearSteadyColibryHigh - revenueVisitYearSteadyManualHigh;
  const extraRevenueVisit12mLow = revenueVisit12mColibryLow - revenueVisit12mManualLow;
  const extraRevenueVisit12mHigh = revenueVisit12mColibryHigh - revenueVisit12mManualHigh;
  const extraRevenueVisit24mLow = revenueVisit24mColibryLow - revenueVisit24mManualLow;
  const extraRevenueVisit24mHigh = revenueVisit24mColibryHigh - revenueVisit24mManualHigh;
  const extraRevenueVisitYear2OnlyLow = revenueVisitYear2OnlyColibryLow - revenueVisitYear2OnlyManualLow;
  const extraRevenueVisitYear2OnlyHigh = revenueVisitYear2OnlyColibryHigh - revenueVisitYear2OnlyManualHigh;

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
    visitWarmManualLow: Math.round(visitWarmManualLow),
    visitWarmManualHigh: Math.round(visitWarmManualHigh),
    visitDealsManualLow: Math.round(visitDealsManualLow),
    visitDealsManualHigh: Math.round(visitDealsManualHigh),
    revenueVisitYearSteadyManualLow,
    revenueVisitYearSteadyManualHigh,
    revenueVisit12mManualLow,
    revenueVisit12mManualHigh,
    revenueVisit24mManualLow,
    revenueVisit24mManualHigh,
    revenueVisitYear2OnlyManualLow,
    revenueVisitYear2OnlyManualHigh,
    visitWarmColibryLow: Math.round(visitWarmColibryLow),
    visitWarmColibryHigh: Math.round(visitWarmColibryHigh),
    visitDealsColibryLow: Math.round(visitDealsColibryLow),
    visitDealsColibryHigh: Math.round(visitDealsColibryHigh),
    revenueVisitYearSteadyColibryLow,
    revenueVisitYearSteadyColibryHigh,
    revenueVisit12mColibryLow,
    revenueVisit12mColibryHigh,
    revenueVisit24mColibryLow,
    revenueVisit24mColibryHigh,
    revenueVisitYear2OnlyColibryLow,
    revenueVisitYear2OnlyColibryHigh,
    extraDealsVisitLow: Math.round(extraDealsVisitLow),
    extraDealsVisitHigh: Math.round(extraDealsVisitHigh),
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
  primaryOutputs: {
    extraDealsDb: number;
    extraDealsVisitLow: number;
    extraDealsVisitHigh: number;
    // Revenue over time (Colibry scenario)
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
  
  return {
    heroCopy: {
      title: "De vergeten verkoper",
      subtitle: "Mini calculator",
      microcopy: "We schatten hoeveel kandidaat-kopers ook een potentiële verkoper zijn, en tonen wat je mist zonder automatische opvolging.",
    },
    primaryOutputs: {
      extraDealsDb: dbResults.extraDealsDb,
      extraDealsVisitLow: visitsResults.extraDealsVisitLow,
      extraDealsVisitHigh: visitsResults.extraDealsVisitHigh,
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
    transparencyText: `Colibry volgt 100% op. Extra succesratio blijft ${inputs.conversionRatePercent}%; het verschil komt door bereik.`,
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
    conversionRatePercent: String(inputs.conversionRatePercent),
    workdaysPerMonth: String(inputs.workdaysPerMonth),
    ownershipRate: String(inputs.ownershipRate),
    avgSalePrice: String(inputs.avgSalePrice),
    commissionPercent: String(inputs.commissionPercent),
    rampMonths: String(inputs.rampMonths),
    // Dropoff settings
    bounceRate: String(inputs.bounceRate),
    unsubPerEmail: String(inputs.unsubPerEmail),
    emailsPerMonth: String(inputs.emailsPerMonth),
    // Database delta outputs
    extraDealsDb: String(dbResults.extraDealsDb),
    extraRevenueDbYearSteady: String(Math.round(dbResults.extraRevenueDbYearSteady)),
    extraRevenueDb12m: String(Math.round(dbResults.extraRevenueDb12m)),
    extraRevenueDb24m: String(Math.round(dbResults.extraRevenueDb24m)),
    extraRevenueDbYear2Only: String(Math.round(dbResults.extraRevenueDbYear2Only)),
    // Visits delta outputs
    extraDealsVisitLow: String(visitsResults.extraDealsVisitLow),
    extraDealsVisitHigh: String(visitsResults.extraDealsVisitHigh),
    extraRevenueVisitYearSteadyLow: String(Math.round(visitsResults.extraRevenueVisitYearSteadyLow)),
    extraRevenueVisitYearSteadyHigh: String(Math.round(visitsResults.extraRevenueVisitYearSteadyHigh)),
    extraRevenueVisit12mLow: String(Math.round(visitsResults.extraRevenueVisit12mLow)),
    extraRevenueVisit12mHigh: String(Math.round(visitsResults.extraRevenueVisit12mHigh)),
    extraRevenueVisit24mLow: String(Math.round(visitsResults.extraRevenueVisit24mLow)),
    extraRevenueVisit24mHigh: String(Math.round(visitsResults.extraRevenueVisit24mHigh)),
  });

  return `${baseUrl}?${params.toString()}`;
}
