import { CalculatorViewModel, formatEuro, formatNumber } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface DetailsAccordionProps {
  viewModel: CalculatorViewModel;
}

const DetailsAccordion = ({ viewModel }: DetailsAccordionProps) => {
  const [dbOpen, setDbOpen] = useState(false);
  const [visitsOpen, setVisitsOpen] = useState(false);

  const { database, visits } = viewModel.detailOutputs;
  const { rampMonths } = viewModel;

  const formatRange = (low: number, high: number) => {
    if (low === high) return formatNumber(low);
    return `${formatNumber(low)} – ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    if (Math.round(low) === Math.round(high)) return formatEuro(low);
    return `${formatEuro(low)} – ${formatEuro(high)}`;
  };

  return (
    <div className="space-y-3">
      {/* Database Details */}
      <Collapsible open={dbOpen} onOpenChange={setDbOpen}>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-medium text-foreground">Database details</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${dbOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Revenue over time */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Omzet met Colibry</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12 maanden:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDb12mColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDbYear2OnlyColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24 maanden:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDb24mColibry)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-border">
                    <span className="text-muted-foreground">Jaaromzet kruissnelheid:</span>
                    <span className="text-muted-foreground">{formatEuro(database.revenueDbYearSteadyColibry)}</span>
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Potentiële verkopers</p>
                  <p className="text-lg font-bold text-foreground">{formatNumber(database.dbSellers)}</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Extra deals</p>
                  <p className="text-lg font-bold text-foreground">{formatNumber(database.extraDealsDb)}</p>
                </div>
              </div>

              {/* Comparison */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacten bereikt:</span>
                    <span className="text-foreground">{formatNumber(database.dbWarmManual)} vs {formatNumber(database.dbWarmColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deals:</span>
                    <span className="text-foreground">{formatNumber(database.dbDealsManual)} vs {formatNumber(database.dbDealsColibry)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Visits Details */}
      <Collapsible open={visitsOpen} onOpenChange={setVisitsOpen}>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-medium text-foreground">Plaatsbezoeken details</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${visitsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Revenue over time */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Omzet met Colibry</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12 maanden:</span>
                    <span className="font-medium text-foreground">{formatEuroRange(visits.revenueVisit12mColibryLow, visits.revenueVisit12mColibryHigh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">{formatEuroRange(visits.revenueVisitYear2OnlyColibryLow, visits.revenueVisitYear2OnlyColibryHigh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24 maanden:</span>
                    <span className="font-medium text-foreground">{formatEuroRange(visits.revenueVisit24mColibryLow, visits.revenueVisit24mColibryHigh)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-border">
                    <span className="text-muted-foreground">Jaaromzet kruissnelheid:</span>
                    <span className="text-muted-foreground">{formatEuroRange(visits.revenueVisitYearSteadyColibryLow, visits.revenueVisitYearSteadyColibryHigh)}</span>
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-secondary/50 rounded-md p-2">
                  <p className="text-xs text-muted-foreground">Per dag</p>
                  <p className="text-sm font-bold text-foreground">{visits.visitSellersPerDayLow.toFixed(1)} – {visits.visitSellersPerDayHigh.toFixed(1)}</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-2">
                  <p className="text-xs text-muted-foreground">Per maand</p>
                  <p className="text-sm font-bold text-foreground">{formatRange(visits.visitSellersMonthLow, visits.visitSellersMonthHigh)}</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-2">
                  <p className="text-xs text-muted-foreground">Per jaar</p>
                  <p className="text-sm font-bold text-foreground">{formatRange(visits.visitSellersYearLow, visits.visitSellersYearHigh)}</p>
                </div>
              </div>

              {/* Comparison */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacten bereikt:</span>
                    <span className="text-foreground">{formatRange(visits.visitWarmManualLow, visits.visitWarmManualHigh)} vs {formatRange(visits.visitWarmColibryLow, visits.visitWarmColibryHigh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deals:</span>
                    <span className="text-foreground">{formatRange(visits.visitDealsManualLow, visits.visitDealsManualHigh)} vs {formatRange(visits.visitDealsColibryLow, visits.visitDealsColibryHigh)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Ramp-up note */}
      <p className="text-xs text-muted-foreground text-center">
        Deze omzet bouwt geleidelijk op. We rekenen met {rampMonths} maanden tot 50% effect.
      </p>
    </div>
  );
};

export default DetailsAccordion;
