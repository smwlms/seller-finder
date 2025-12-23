import { VisitsResults, formatEuro, formatNumber } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface VisitsResultsCardProps {
  results: VisitsResults;
  rampMonths: number;
}

const VisitsResultsCard = ({ results, rampMonths }: VisitsResultsCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formatRange = (low: number, high: number) => {
    return `${formatNumber(low)} - ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    return `${formatEuro(low)} (cons.) tot ${formatEuro(high)} (opt.)`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Plaatsbezoeken potentieel (met Colibry)
      </h3>

      <div className="space-y-4">
        {/* Revenue Results - Default visible */}
        <div className="space-y-3">
          <div>
            <p className="text-sm text-foreground mb-1">Cumulatief na 12 maanden:</p>
            <p className="text-lg font-semibold text-primary">
              {formatEuroRange(results.revenueVisit12mColibryLow, results.revenueVisit12mColibryHigh)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-foreground mb-1">Alleen jaar 2:</p>
            <p className="text-lg font-semibold text-primary">
              {formatEuroRange(results.revenueVisitYear2OnlyColibryLow, results.revenueVisitYear2OnlyColibryHigh)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-foreground mb-1">Cumulatief na 24 maanden:</p>
            <p className="text-lg font-semibold text-primary">
              {formatEuroRange(results.revenueVisit24mColibryLow, results.revenueVisit24mColibryHigh)}
            </p>
          </div>

          {/* Steady-state reference */}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            Jaaromzet op kruissnelheid: {formatEuro(results.revenueVisitYearSteadyColibryLow)} tot {formatEuro(results.revenueVisitYearSteadyColibryHigh)}
          </p>
        </div>

        {/* Ramp-up Note */}
        <p className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded-md">
          Deze omzet bouwt geleidelijk op. We rekenen met {rampMonths} maanden tot 50% effect.
        </p>

        {/* Details Accordion */}
        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform ${detailsOpen ? "rotate-180" : ""}`} />
            Toon details
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 space-y-4 pt-4 border-t border-border">
              {/* Key Metrics */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Per dag</p>
                  <p className="text-lg font-bold text-foreground">
                    {results.visitSellersPerDayLow.toFixed(1)} - {results.visitSellersPerDayHigh.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">pot. verkopers</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Per maand</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatRange(results.visitSellersMonthLow, results.visitSellersMonthHigh)}
                  </p>
                  <p className="text-xs text-muted-foreground">pot. verkopers</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Per jaar</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatRange(results.visitSellersYearLow, results.visitSellersYearHigh)}
                  </p>
                  <p className="text-xs text-muted-foreground">pot. verkopers</p>
                </div>
              </div>

              {/* Manual vs Colibry comparison */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warm gemaakte contacten:</span>
                    <span className="text-foreground">
                      {formatRange(results.visitWarmManualLow, results.visitWarmManualHigh)} vs {formatRange(results.visitWarmColibryLow, results.visitWarmColibryHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversies naar deal:</span>
                    <span className="text-foreground">
                      {formatRange(results.visitDealsManualLow, results.visitDealsManualHigh)} vs {formatRange(results.visitDealsColibryLow, results.visitDealsColibryHigh)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default VisitsResultsCard;
