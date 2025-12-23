import { VisitsResults, formatEuro, formatNumber } from "@/lib/calculations";

interface VisitsResultsCardProps {
  results: VisitsResults;
  rampMonths: number;
}

const VisitsResultsCard = ({ results, rampMonths }: VisitsResultsCardProps) => {
  const formatRange = (low: number, high: number) => {
    return `${formatNumber(low)} - ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    return `${formatEuro(low)} (conservatief) tot ${formatEuro(high)} (optimistisch)`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Plaatsbezoeken potentieel
      </h3>

      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Per dag</p>
            <p className="text-xl font-bold text-foreground">
              {results.visitSellersPerDayLow.toFixed(1)} - {results.visitSellersPerDayHigh.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">potentiële verkopers</p>
          </div>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Per maand</p>
            <p className="text-xl font-bold text-foreground">
              {formatRange(results.visitSellersMonthLow, results.visitSellersMonthHigh)}
            </p>
            <p className="text-xs text-muted-foreground">potentiële verkopers</p>
          </div>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Per jaar</p>
            <p className="text-xl font-bold text-foreground">
              {formatRange(results.visitSellersYearLow, results.visitSellersYearHigh)}
            </p>
            <p className="text-xs text-muted-foreground">potentiële verkopers</p>
          </div>
        </div>

        {/* Activated Conversations */}
        <div className="bg-secondary/50 rounded-md p-3">
          <p className="text-sm text-muted-foreground">Activeerbare gesprekken per jaar</p>
          <p className="text-2xl font-bold text-foreground">
            {formatRange(results.visitActivatedYearLow, results.visitActivatedYearHigh)}
          </p>
        </div>

        {/* Revenue Results */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Geschatte commissie-omzet
          </h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground mb-1">Cumulatief na 12 maanden:</p>
              <p className="text-lg font-semibold text-primary">
                {formatEuroRange(results.revenue12mLow, results.revenue12mHigh)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-foreground mb-1">Alleen jaar 2:</p>
              <p className="text-lg font-semibold text-primary">
                {formatEuroRange(results.revenueYear2OnlyLow, results.revenueYear2OnlyHigh)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-foreground mb-1">Cumulatief na 24 maanden:</p>
              <p className="text-lg font-semibold text-primary">
                {formatEuroRange(results.revenue24mLow, results.revenue24mHigh)}
              </p>
            </div>
          </div>

          {/* Steady-state reference */}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            Jaaromzet op kruissnelheid (steady-state): {formatEuro(results.revenueYearSteadyLow)} tot {formatEuro(results.revenueYearSteadyHigh)}
          </p>
        </div>

        {/* Ramp-up Note */}
        <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
          Deze omzet bouwt geleidelijk op. We rekenen met {rampMonths} maanden tot 50% effect.
        </p>
      </div>
    </div>
  );
};

export default VisitsResultsCard;
