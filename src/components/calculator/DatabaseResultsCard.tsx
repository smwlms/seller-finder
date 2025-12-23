import { DatabaseResults, formatEuro, formatNumber } from "@/lib/calculations";
import { AlertTriangle } from "lucide-react";

interface DatabaseResultsCardProps {
  results: DatabaseResults;
  rampMonths: number;
}

const DatabaseResultsCard = ({ results, rampMonths }: DatabaseResultsCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Database potentieel
      </h3>

      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Potentiële verkopers</p>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(results.dbSellers)}
            </p>
          </div>
          <div className="bg-secondary/50 rounded-md p-3">
            <p className="text-sm text-muted-foreground">Activeerbare gesprekken</p>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(results.dbActivated)}
            </p>
          </div>
        </div>

        {/* Revenue Results */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Geschatte omzet
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground">Cumulatief na 12 maanden:</span>
              <span className="text-lg font-semibold text-primary">
                {formatEuro(results.revenueDb12m)}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground">Alleen jaar 2:</span>
              <span className="text-lg font-semibold text-primary">
                {formatEuro(results.revenueDbYear2Only)}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-foreground">Cumulatief na 24 maanden:</span>
              <span className="text-lg font-semibold text-primary">
                {formatEuro(results.revenueDb24m)}
              </span>
            </div>
          </div>

          {/* Steady-state reference */}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            Jaaromzet op kruissnelheid (steady-state): {formatEuro(results.revenueDbYearSteady)}
          </p>
        </div>

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
