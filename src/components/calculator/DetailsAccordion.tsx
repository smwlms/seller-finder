import { CalculatorViewModel, formatEuro, formatNumber } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle } from "lucide-react";
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
                  <p className="text-xs text-muted-foreground">Potentiële verkopers (pool)</p>
                  <p className="text-lg font-bold text-foreground">{formatNumber(database.dbSellers)}</p>
                  <p className="text-[10px] text-muted-foreground">= {formatNumber(inputs.dbBuyers)} × {inputs.ownershipRate}%</p>
                </div>
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground">Colibry effectief bereik</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPercent(database.colibryEffectiveCoverageSteady)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">steady-state (na dropoff)</p>
                </div>
              </div>

              {/* Incremental uplift breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Extra reach & uplift</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manueel bereik:</span>
                    <span className="text-foreground">{inputs.manualFollowUpPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra reach (Colibry - manueel):</span>
                    <span className="font-medium text-foreground">{formatNumber(database.extraReachDb)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra mandaten ({inputs.upliftRatePercent}% uplift):</span>
                    <span className="font-medium text-primary">{formatNumber(database.extraMandatesDb)}</span>
                  </div>
                </div>
              </div>

              {/* Revenue over time */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Extra omzet over tijd</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12m:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.extraRevenueDb12m)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.extraRevenueDbYear2Only)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24m:</span>
                    <span className="font-medium text-foreground">{formatEuro(database.extraRevenueDb24m)}</span>
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
              {/* Data quality warning for tasks mode */}
              {visits.isTasksMode && (
                <div className="flex items-start gap-2 p-2 bg-accent/10 rounded-md border border-accent/20">
                  <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Data-kwaliteit:</strong> Berekening op basis van VISIT tasks (ruw). 
                    Dit zijn geen unieke bezoekers. 60–70% heuristiek toegepast.
                  </p>
                </div>
              )}

              {/* Baseline status */}
              <div className="bg-secondary/30 rounded-md p-3 space-y-1">
                <h4 className="text-xs font-medium text-foreground">Vandaag-status (baseline)</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{baselineStatus.baselinePercentFormatted}</strong> van je mandaten 
                  (= {formatNumber(baselineStatus.baselineMandatesFromPriorContact)}) komt al uit eerdere contacten
                </p>
              </div>

              {/* Pool metrics */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Potentiële verkopers (pool)</h4>
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

              {/* Incremental uplift breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Extra reach & uplift</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra reach (Colibry - manueel):</span>
                    <span className="font-medium text-foreground">
                      {formatRange(visits.extraReachVisitLow, visits.extraReachVisitHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra mandaten ({inputs.upliftRatePercent}% uplift):</span>
                    <span className="font-medium text-primary">
                      {formatRange(visits.extraMandatesVisitLow, visits.extraMandatesVisitHigh)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Revenue over time */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Extra omzet over tijd</h4>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 12m:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.extraRevenueVisit12mLow, visits.extraRevenueVisit12mHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alleen jaar 2:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.extraRevenueVisitYear2OnlyLow, visits.extraRevenueVisitYear2OnlyHigh)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cumulatief 24m:</span>
                    <span className="font-medium text-foreground">
                      {formatEuroRange(visits.extraRevenueVisit24mLow, visits.extraRevenueVisit24mHigh)}
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
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Ramp-up note */}
      <p className="text-xs text-muted-foreground text-center">
        Omzet bouwt geleidelijk op ({rampMonths} maanden tot 50% effect).
        Colibry bereik daalt licht door bounces ({(inputs.bounceRate * 100).toFixed(1)}%) en uitschrijvingen.
      </p>
    </div>
  );
};

export default DetailsAccordion;
