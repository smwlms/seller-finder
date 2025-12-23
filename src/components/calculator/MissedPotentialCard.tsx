import { DatabaseResults, VisitsResults, formatEuro, formatNumber } from "@/lib/calculations";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface MissedPotentialCardProps {
  dbResults: DatabaseResults;
  visitsResults: VisitsResults;
}

const MissedPotentialCard = ({ dbResults, visitsResults }: MissedPotentialCardProps) => {
  const formatRange = (low: number, high: number) => {
    if (low === high) return formatNumber(low);
    return `${formatNumber(low)} - ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    if (Math.round(low) === Math.round(high)) return formatEuro(low);
    return `${formatEuro(low)} - ${formatEuro(high)}`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border-2 border-primary/50">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Gemist potentieel zonder Colibry
        </h3>
      </div>

      <div className="space-y-6">
        {/* Extra Deals */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Extra inkopen per jaar (steady-state)
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-primary/10 rounded-md p-4">
              <p className="text-sm text-muted-foreground">Database</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(dbResults.extraDealsDb)}
              </p>
              <p className="text-xs text-muted-foreground">deals</p>
            </div>
            <div className="bg-primary/10 rounded-md p-4">
              <p className="text-sm text-muted-foreground">Plaatsbezoeken</p>
              <p className="text-2xl font-bold text-primary">
                {formatRange(visitsResults.extraDealsVisitLow, visitsResults.extraDealsVisitHigh)}
              </p>
              <p className="text-xs text-muted-foreground">deals</p>
            </div>
          </div>
        </div>

        {/* Extra Revenue */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Extra commissie-omzet per jaar (steady-state)
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-primary/10 rounded-md p-4">
              <p className="text-sm text-muted-foreground">Database</p>
              <p className="text-2xl font-bold text-primary">
                {formatEuro(dbResults.extraRevenueDbYearSteady)}
              </p>
            </div>
            <div className="bg-primary/10 rounded-md p-4">
              <p className="text-sm text-muted-foreground">Plaatsbezoeken</p>
              <p className="text-2xl font-bold text-primary">
                {formatEuroRange(
                  visitsResults.extraRevenueVisitYearSteadyLow,
                  visitsResults.extraRevenueVisitYearSteadyHigh
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Overlap Warning */}
        <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-md border border-accent/30">
          <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Tel deze bedragen niet op wegens mogelijke overlap tussen database en bezoekersstroom.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissedPotentialCard;
