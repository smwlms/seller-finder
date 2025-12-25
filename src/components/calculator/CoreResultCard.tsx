import { CalculatorViewModel, formatEuro, formatNumber } from "@/lib/calculations";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";

interface CoreResultCardProps {
  viewModel: CalculatorViewModel;
}

const CoreResultCard = ({ viewModel }: CoreResultCardProps) => {
  const { primaryOutputs, transparencyText, overlapWarning, baselineStatus } = viewModel;

  const formatRange = (low: number, high: number) => {
    if (low === high) return formatNumber(low);
    return `${formatNumber(low)} – ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    if (Math.round(low) === Math.round(high)) return formatEuro(low);
    return `${formatEuro(low)} – ${formatEuro(high)}`;
  };

  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border-2 border-primary/40 h-fit">
      {/* Baseline Status - "Vandaag" */}
      <div className="flex items-start gap-2 mb-4 p-3 bg-secondary/50 rounded-md">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground">
            <strong>Vandaag:</strong> ~{baselineStatus.baselinePercentFormatted} (= {formatNumber(baselineStatus.baselineMandatesFromPriorContact)}) 
            {" "}van je mandaten komt uit eerdere contacten
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Baseline zonder Colibry, gebaseerd op {formatNumber(baselineStatus.salesPerYear)} mandaten/jaar
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Gemist potentieel zonder Colibry
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Database Subsection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">
            Database
          </h3>
          
          {/* Key metric: Extra mandates */}
          <div className="bg-primary/10 rounded-md p-3">
            <p className="text-xs text-muted-foreground">Extra mandaten/jaar (gemist)</p>
            <p className="text-2xl font-bold text-primary">
              {formatNumber(primaryOutputs.extraMandatesDb)}
            </p>
          </div>

          {/* Revenue over time - 3 lines */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cumulatief 12m:</span>
              <span className="font-medium text-foreground">{formatEuro(primaryOutputs.extraRevenueDb12m)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alleen jaar 2:</span>
              <span className="font-medium text-foreground">{formatEuro(primaryOutputs.extraRevenueDbYear2Only)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cumulatief 24m:</span>
              <span className="font-medium text-foreground">{formatEuro(primaryOutputs.extraRevenueDb24m)}</span>
            </div>
          </div>

          {/* Steady-state context */}
          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            Kruissnelheid: {formatEuro(primaryOutputs.extraRevenueDbYearSteady)}/jaar
          </p>
        </div>

        {/* Visits Subsection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-1">
            Plaatsbezoeken
          </h3>
          
          {/* Key metric: Extra mandates (range) */}
          <div className="bg-primary/10 rounded-md p-3">
            <p className="text-xs text-muted-foreground">Extra mandaten/jaar (gemist)</p>
            <p className="text-2xl font-bold text-primary">
              {formatRange(primaryOutputs.extraMandatesVisitLow, primaryOutputs.extraMandatesVisitHigh)}
            </p>
          </div>

          {/* Revenue over time - 3 lines (range) */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cumulatief 12m:</span>
              <span className="font-medium text-foreground">
                {formatEuroRange(primaryOutputs.extraRevenueVisit12mLow, primaryOutputs.extraRevenueVisit12mHigh)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Alleen jaar 2:</span>
              <span className="font-medium text-foreground">
                {formatEuroRange(primaryOutputs.extraRevenueVisitYear2OnlyLow, primaryOutputs.extraRevenueVisitYear2OnlyHigh)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cumulatief 24m:</span>
              <span className="font-medium text-foreground">
                {formatEuroRange(primaryOutputs.extraRevenueVisit24mLow, primaryOutputs.extraRevenueVisit24mHigh)}
              </span>
            </div>
          </div>

          {/* Steady-state context */}
          <p className="text-xs text-muted-foreground pt-1 border-t border-border">
            Kruissnelheid: {formatEuroRange(primaryOutputs.extraRevenueVisitYearSteadyLow, primaryOutputs.extraRevenueVisitYearSteadyHigh)}/jaar
          </p>
        </div>
      </div>

      {/* Transparency & Overlap */}
      <div className="mt-4 pt-3 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground">
          {transparencyText}
        </p>
        <div className="flex items-start gap-2 p-2 bg-accent/10 rounded-md">
          <AlertTriangle className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            {overlapWarning}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoreResultCard;
