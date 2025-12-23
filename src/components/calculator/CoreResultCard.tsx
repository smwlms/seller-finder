import { CalculatorViewModel, formatEuro, formatNumber } from "@/lib/calculations";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface CoreResultCardProps {
  viewModel: CalculatorViewModel;
}

const CoreResultCard = ({ viewModel }: CoreResultCardProps) => {
  const { primaryOutputs, transparencyText, overlapWarning } = viewModel;

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
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Gemist potentieel zonder Colibry
        </h2>
      </div>

      <div className="space-y-4">
        {/* Extra Deals */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Extra inkopen per jaar</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">Database</p>
              <p className="text-2xl font-bold text-primary">
                {formatNumber(primaryOutputs.extraDealsDb)}
              </p>
            </div>
            <div className="bg-primary/10 rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">Bezoeken</p>
              <p className="text-2xl font-bold text-primary">
                {formatRange(primaryOutputs.extraDealsVisitLow, primaryOutputs.extraDealsVisitHigh)}
              </p>
            </div>
          </div>
        </div>

        {/* Extra Revenue */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Extra commissie-omzet per jaar</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/10 rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">Database</p>
              <p className="text-xl font-bold text-primary">
                {formatEuro(primaryOutputs.extraRevenueDbYearSteady)}
              </p>
            </div>
            <div className="bg-primary/10 rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">Bezoeken</p>
              <p className="text-xl font-bold text-primary">
                {formatEuroRange(
                  primaryOutputs.extraRevenueVisitYearSteadyLow,
                  primaryOutputs.extraRevenueVisitYearSteadyHigh
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Transparency */}
        <p className="text-xs text-muted-foreground">
          {transparencyText}
        </p>

        {/* Overlap Warning */}
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
