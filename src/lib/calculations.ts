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
 * Calculate the sigmoid ramp factor for a given month
 * Returns 1 if rampMonths is 0, otherwise a sigmoid curve
 * that reaches ~50% at rampMonths
 */
export function rampFactor(month: number, rampMonths: number): number {
  if (rampMonths === 0) return 1;
  const k = 4.394 / rampMonths;
  return 1 / (1 + Math.exp(-k * (month - rampMonths)));
}

/**
 * Calculate cumulative revenue over a period with sigmoid ramp-up
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

// Input types
export interface CalculatorInputs {
  dbBuyers: number;
  followUpPercent: number;
  visits12m: number;
  sales12m: number;
  workdaysPerMonth: number;
  ownershipRate: number;
  avgSalePrice: number;
  commissionPercent: number;
  rampMonths: number;
}

// Default values
export const DEFAULT_INPUTS: CalculatorInputs = {
  dbBuyers: 3648,
  followUpPercent: 2,
  visits12m: 1900,
  sales12m: 95,
  workdaysPerMonth: 22,
  ownershipRate: 71,
  avgSalePrice: 367000,
  commissionPercent: 2.78,
  rampMonths: 5,
};

// Database calculation results
export interface DatabaseResults {
  dbSellers: number;
  dbActivated: number;
  revenueDbYearSteady: number;
  revenueDb12m: number;
  revenueDb24m: number;
  revenueDbYear2Only: number;
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
  visitActivatedYearLow: number;
  visitActivatedYearHigh: number;
  visitSellersPerDayLow: number;
  visitSellersPerDayHigh: number;
  revenueYearSteadyLow: number;
  revenueYearSteadyHigh: number;
  revenue12mLow: number;
  revenue12mHigh: number;
  revenue24mLow: number;
  revenue24mHigh: number;
  revenueYear2OnlyLow: number;
  revenueYear2OnlyHigh: number;
}

/**
 * Calculate database potential
 */
export function calculateDatabaseResults(inputs: CalculatorInputs): DatabaseResults {
  const ownershipDecimal = inputs.ownershipRate / 100;
  const followUpDecimal = inputs.followUpPercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const dbSellers = inputs.dbBuyers * ownershipDecimal;
  const dbActivated = dbSellers * followUpDecimal;
  const revenueDbYearSteady = dbActivated * inputs.avgSalePrice * commissionDecimal;

  const monthlyDbSteady = revenueDbYearSteady / 12;
  const revenueDb12m = calculateCumulativeRevenue(monthlyDbSteady, 12, inputs.rampMonths);
  const revenueDb24m = calculateCumulativeRevenue(monthlyDbSteady, 24, inputs.rampMonths);
  const revenueDbYear2Only = revenueDb24m - revenueDb12m;

  return {
    dbSellers: Math.round(dbSellers),
    dbActivated: Math.round(dbActivated),
    revenueDbYearSteady,
    revenueDb12m,
    revenueDb24m,
    revenueDbYear2Only,
  };
}

/**
 * Calculate visits potential with 60-70% range
 */
export function calculateVisitsResults(inputs: CalculatorInputs): VisitsResults {
  const followUpDecimal = inputs.followUpPercent / 100;
  const commissionDecimal = inputs.commissionPercent / 100;

  const visitsPerMonth = inputs.visits12m / 12;
  const salesPerMonth = inputs.sales12m / 12;
  const nonBuyersPerMonth = Math.max(visitsPerMonth - salesPerMonth, 0);

  // 60-70% range of non-buyers are potential sellers
  const visitSellersMonthLow = nonBuyersPerMonth * 0.60;
  const visitSellersMonthHigh = nonBuyersPerMonth * 0.70;

  const visitSellersYearLow = visitSellersMonthLow * 12;
  const visitSellersYearHigh = visitSellersMonthHigh * 12;

  const visitActivatedYearLow = visitSellersYearLow * followUpDecimal;
  const visitActivatedYearHigh = visitSellersYearHigh * followUpDecimal;

  // Per day calculation
  const visitSellersPerDayLow = visitSellersMonthLow / inputs.workdaysPerMonth;
  const visitSellersPerDayHigh = visitSellersMonthHigh / inputs.workdaysPerMonth;

  // Steady-state revenue
  const revenueYearSteadyLow = visitActivatedYearLow * inputs.avgSalePrice * commissionDecimal;
  const revenueYearSteadyHigh = visitActivatedYearHigh * inputs.avgSalePrice * commissionDecimal;

  // Monthly steady for cumulative calculations
  const monthlySteadyLow = revenueYearSteadyLow / 12;
  const monthlySteadyHigh = revenueYearSteadyHigh / 12;

  // Cumulative with sigmoid ramp-up
  const revenue12mLow = calculateCumulativeRevenue(monthlySteadyLow, 12, inputs.rampMonths);
  const revenue12mHigh = calculateCumulativeRevenue(monthlySteadyHigh, 12, inputs.rampMonths);
  const revenue24mLow = calculateCumulativeRevenue(monthlySteadyLow, 24, inputs.rampMonths);
  const revenue24mHigh = calculateCumulativeRevenue(monthlySteadyHigh, 24, inputs.rampMonths);

  const revenueYear2OnlyLow = revenue24mLow - revenue12mLow;
  const revenueYear2OnlyHigh = revenue24mHigh - revenue12mHigh;

  return {
    visitsPerMonth: Math.round(visitsPerMonth),
    salesPerMonth: Math.round(salesPerMonth),
    nonBuyersPerMonth: Math.round(nonBuyersPerMonth),
    visitSellersMonthLow: Math.round(visitSellersMonthLow),
    visitSellersMonthHigh: Math.round(visitSellersMonthHigh),
    visitSellersYearLow: Math.round(visitSellersYearLow),
    visitSellersYearHigh: Math.round(visitSellersYearHigh),
    visitActivatedYearLow: Math.round(visitActivatedYearLow),
    visitActivatedYearHigh: Math.round(visitActivatedYearHigh),
    visitSellersPerDayLow,
    visitSellersPerDayHigh,
    revenueYearSteadyLow,
    revenueYearSteadyHigh,
    revenue12mLow,
    revenue12mHigh,
    revenue24mLow,
    revenue24mHigh,
    revenueYear2OnlyLow,
    revenueYear2OnlyHigh,
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
    followUpPercent: String(inputs.followUpPercent),
    visits12m: String(inputs.visits12m),
    sales12m: String(inputs.sales12m),
    workdaysPerMonth: String(inputs.workdaysPerMonth),
    ownershipRate: String(inputs.ownershipRate),
    avgSalePrice: String(inputs.avgSalePrice),
    commissionPercent: String(inputs.commissionPercent),
    rampMonths: String(inputs.rampMonths),
    // Database outputs
    dbSellers: String(dbResults.dbSellers),
    dbActivated: String(dbResults.dbActivated),
    revenueDbYearSteady: String(Math.round(dbResults.revenueDbYearSteady)),
    revenueDb12m: String(Math.round(dbResults.revenueDb12m)),
    revenueDb24m: String(Math.round(dbResults.revenueDb24m)),
    revenueDbYear2Only: String(Math.round(dbResults.revenueDbYear2Only)),
    // Visits outputs
    revenue12mLow: String(Math.round(visitsResults.revenue12mLow)),
    revenue12mHigh: String(Math.round(visitsResults.revenue12mHigh)),
    revenue24mLow: String(Math.round(visitsResults.revenue24mLow)),
    revenue24mHigh: String(Math.round(visitsResults.revenue24mHigh)),
    revenueYear2OnlyLow: String(Math.round(visitsResults.revenueYear2OnlyLow)),
    revenueYear2OnlyHigh: String(Math.round(visitsResults.revenueYear2OnlyHigh)),
  });

  return `${baseUrl}?${params.toString()}`;
}
