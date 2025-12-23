import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalculatorInputs, DEFAULT_INPUTS } from "@/lib/calculations";

interface SettingsCollapsibleProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const SettingsCollapsible = ({ inputs, onChange }: SettingsCollapsibleProps) => {
  const [open, setOpen] = useState(false);

  const updateInput = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({ ...inputs, [key]: value });
  };

  const resetToDefaults = () => {
    onChange(DEFAULT_INPUTS);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            Instellingen
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="bg-card rounded-lg p-4 shadow-sm border border-border mt-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="workdaysPerMonth" className="text-xs">Werkdagen/maand</Label>
              <Input
                id="workdaysPerMonth"
                type="number"
                min={1}
                max={31}
                value={inputs.workdaysPerMonth}
                onChange={(e) => updateInput("workdaysPerMonth", parseInt(e.target.value) || 22)}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ownershipRate" className="text-xs">Eigendomsgraad (%)</Label>
              <Input
                id="ownershipRate"
                type="number"
                min={0}
                max={100}
                value={inputs.ownershipRate}
                onChange={(e) => updateInput("ownershipRate", parseInt(e.target.value) || 71)}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="avgSalePrice" className="text-xs">Gem. verkoopprijs (€)</Label>
              <Input
                id="avgSalePrice"
                type="number"
                min={0}
                value={inputs.avgSalePrice}
                onChange={(e) => updateInput("avgSalePrice", parseInt(e.target.value) || 367000)}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="commissionPercent" className="text-xs">Commissie (%)</Label>
              <Input
                id="commissionPercent"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={inputs.commissionPercent}
                onChange={(e) => updateInput("commissionPercent", parseFloat(e.target.value) || 2.78)}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="conversionRatePercent" className="text-xs">Conversieratio (%)</Label>
              <Input
                id="conversionRatePercent"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={inputs.conversionRatePercent}
                onChange={(e) => updateInput("conversionRatePercent", parseFloat(e.target.value) || 2)}
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rampMonths" className="text-xs">Inlooptijd (maanden)</Label>
              <Input
                id="rampMonths"
                type="number"
                min={0}
                max={18}
                value={inputs.rampMonths}
                onChange={(e) => updateInput("rampMonths", Math.min(18, Math.max(0, parseInt(e.target.value) || 5)))}
                className="h-8"
              />
            </div>
          </div>

          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1 text-xs text-primary hover:underline mt-3"
          >
            <RotateCcw className="h-3 w-3" />
            Reset naar voorbeeld
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsCollapsible;
