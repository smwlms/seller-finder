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

  const { database, visits, acquisitionContext } = viewModel.detailOutputs;
  const { rampMonths, inputs, baselineStatus } = viewModel;

  const formatRange = (low: number, high: number) => {
    if (low === high) return formatNumber(low);
    return `${formatNumber(low)} – ${formatNumber(high)}`;
  };

  const formatEuroRange = (low: number, high: number) => {
    if (Math.round(low) === Math.round(high)) return formatEuro(low);
    return `${formatEuro(low)} – ${formatEuro(high)}`;
  };

  const formatPercent = (decimal: number) => `${(decimal * 100).toFixed(1)}%`;

  return (
    <div className="space-y-3">
      {/* Database Details */}
      <Collapsible open={dbOpen} onOpenChange={setDbOpen}>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/30 transition-colors">
            <span className="text-sm font-medium text-foreground">Toon details: Database</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${dbOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Pool */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Potentiële verkopers</p>
                  <p className="text-lg font-bold text-foreground">{formatNumber(database.dbSellers)}</p>
                  <p className="text-[10px] text-muted-foreground">= kandidaat-kopers × {inputs.ownershipRate}%</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Effectief bereik (gem.)</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPercent(database.effectiveReach12m)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">na 12m (incl. dropoff)</p>
                </div>
              </div>

              {/* Comparison: Manual vs Colibry */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bereik (contacten):</span>
                    <span className="text-foreground">
                      {formatNumber(database.dbWarmManual)} vs {formatNumber(database.dbWarmColibry)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra mandaten:</span>
                    <span className="text-foreground">
                      {formatNumber(database.dbDealsManual)} vs {formatNumber(database.dbDealsColibry)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Omzet steady-state:</span>
                    <span className="text-foreground">
                      {formatEuro(database.revenueDbYearSteadyManual)} vs {formatEuro(database.revenueDbYearSteadyColibry)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full revenue timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Colibry omzet over tijd</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12m:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDb12mColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDbYear2OnlyColibry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24m:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.revenueDb24mColibry)}</span>
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
            <span className="text-sm font-medium text-foreground">Toon details: Plaatsbezoeken</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${visitsOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Baseline status */}
              <div className="bg-secondary/30 rounded-md p-3 space-y-1">
                <h4 className="text-xs font-medium text-foreground">Vandaag-status (baseline)</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{baselineStatus.baselinePercentFormatted}</strong> van je mandaten 
                  (= {formatNumber(baselineStatus.baselineMandatesFromPriorContact)}) komt al uit eerdere contacten
                </p>
              </div>

              {/* Pool metrics with untapped */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Stille verkopers (pool)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-secondary/50 rounded-md p-2">
                    <p className="text-xs text-muted-foreground">Per dag</p>
                    <p className="text-sm font-bold text-foreground">
                      {visits.visitSellersPerDayLow.toFixed(1)} – {visits.visitSellersPerDayHigh.toFixed(1)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-md p-2">
                    <p className="text-xs text-muted-foreground">Per maand</p>
                    <p className="text-sm font-bold text-foreground">
                      {formatRange(visits.visitSellersMonthLow, visits.visitSellersMonthHigh)}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-md p-2">
                    <p className="text-xs text-muted-foreground">Per jaar</p>
                    <p className="text-sm font-bold text-foreground">
                      {formatRange(visits.visitSellersYearLow, visits.visitSellersYearHigh)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Untapped pool */}
              <div className="bg-primary/5 rounded-md p-3 border border-primary/20">
                <h4 className="text-xs font-medium text-foreground mb-1">Untapped pool (wat nog op tafel ligt)</h4>
                <p className="text-lg font-bold text-primary">
                  {formatRange(visits.untappedSellersYearLow, visits.untappedSellersYearHigh)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  = stille verkopers − baseline mandaten uit eerdere contacten
                </p>
              </div>

              {/* Comparison: Manual vs Colibry */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Manueel vs Colibry</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bereik (contacten):</span>
                    <span className="text-foreground">
                      {formatRange(visits.visitWarmManualLow, visits.visitWarmManualHigh)} vs {formatRange(visits.visitWarmColibryLow, visits.visitWarmColibryHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra mandaten:</span>
                    <span className="text-foreground">
                      {formatRange(visits.visitDealsManualLow, visits.visitDealsManualHigh)} vs {formatRange(visits.visitDealsColibryLow, visits.visitDealsColibryHigh)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full revenue timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Colibry omzet over tijd</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12m:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.revenueVisit12mColibryLow, visits.revenueVisit12mColibryHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.revenueVisitYear2OnlyColibryLow, visits.revenueVisitYear2OnlyColibryHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24m:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.revenueVisit24mColibryLow, visits.revenueVisit24mColibryHigh)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acquisition context */}
              <div className="space-y-2 pt-2 border-t border-border">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Businesscase context</h4>
                <div className="grid gap-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Baseline mandaten met voorafgaand bezoek:</span>
                    <span>{acquisitionContext.baselineMandatesFromVisits.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Close rate na gesprek:</span>
                    <span>{(acquisitionContext.closeRateOnceConversation * 100).toFixed(1)}%</span>
                  </div>
                  <p className="text-[10px] mt-1">
                    Referentiecijfers uit businesscase ({baselineStatus.baselinePercentFormatted} van mandaten had voorafgaand bezoek).
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Ramp-up note */}
      <p className="text-xs text-muted-foreground text-center">
        Deze omzet bouwt geleidelijk op. We rekenen met {rampMonths} maanden tot 50% effect.
        Colibry bereik daalt licht door bounces ({(inputs.bounceRate * 100).toFixed(1)}%) en uitschrijvingen.
      </p>
    </div>
  );
};

export default DetailsAccordion;
