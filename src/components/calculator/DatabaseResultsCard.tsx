import { DatabaseResults, formatEuro, formatNumber } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DatabaseResultsCardProps {
  results: DatabaseResults;
  rampMonths: number;
}

const DatabaseResultsCard = ({ results, rampMonths }: DatabaseResultsCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Database potentieel (met Colibry)
      </h3>

      <div className="space-y-4">
        {/* Revenue Results - Default visible */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-foreground">Cumulatief na 12 maanden:</span>
            <span className="text-lg font-semibold text-primary">
              {formatEuro(results.revenueDb12mColibry)}
            </span>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-foreground">Alleen jaar 2:</span>
            <span className="text-lg font-semibold text-primary">
              {formatEuro(results.revenueDbYear2OnlyColibry)}
            </span>
          </div>
          
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-foreground">Cumulatief na 24 maanden:</span>
            <span className="text-lg font-semibold text-primary">
              {formatEuro(results.revenueDb24mColibry)}
            </span>
          </div>

          {/* Steady-state reference */}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            Jaaromzet op kruissnelheid: {formatEuro(results.revenueDbYearSteadyColibry)}
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Potentiële verkopers</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatNumber(results.dbSellers)}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Deals (Colibry)</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatNumber(results.dbDealsColibry)}
                  </p>
                </div>
              </div>

              {/* Manual vs Colibry comparison */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warm gemaakte contacten:</span>
                    <span className="text-foreground">{formatNumber(results.dbWarmManual)} vs {formatNumber(results.dbWarmColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversies naar deal:</span>
                    <span className="text-foreground">{formatNumber(results.dbDealsManual)} vs {formatNumber(results.dbDealsColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jaaromzet steady-state:</span>
                    <span className="text-foreground">{formatEuro(results.revenueDbYearSteadyManual)} vs {formatEuro(results.revenueDbYearSteadyColibry)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Overlap Warning */}
        <div className="flex items-start gap-2 p-3 bg-accent/10 rounded-md border border-accent/30">
          <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Let op: mogelijk overlap met bezoekersstroom
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseResultsCard;
