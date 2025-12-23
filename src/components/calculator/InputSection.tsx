import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Settings, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CalculatorInputs, DEFAULT_INPUTS } from "@/lib/calculations";

interface InputSectionProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const InputSection = ({ inputs, onChange }: InputSectionProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    <section className="space-y-6">
      {/* Main Inputs */}
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Database Buyers */}
          <div className="space-y-2">
            <Label htmlFor="dbBuyers" className="text-sm font-medium">
              Kandidaat kopers in database
            </Label>
            <Input
              id="dbBuyers"
              type="number"
              min={0}
              value={inputs.dbBuyers}
              onChange={(e) => updateInput("dbBuyers", parseInt(e.target.value) || 0)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Enkel contacten met een zoekfiche, niet ouder dan 12 maanden, en budget ≥ €350.000.
            </p>
          </div>

          {/* Manual Follow-up Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Hoeveel % volg je vandaag manueel op? {inputs.manualFollowUpPercent}%
              </Label>
              <Badge variant="secondary" className="text-xs">
                Colibry: 100%
              </Badge>
            </div>
            <Slider
              value={[inputs.manualFollowUpPercent]}
              onValueChange={([value]) => updateInput("manualFollowUpPercent", value)}
              min={0}
              max={20}
              step={1}
              className="py-4"
            />
            <p className="text-xs text-muted-foreground">
              Manueel = beperkt door capaciteit
            </p>
          </div>

          {/* Period Unit Selector */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <Label className="text-sm font-medium">Invoer per:</Label>
              <Select
                value={inputs.periodUnit}
                onValueChange={(value: 'year' | 'month') => updateInput("periodUnit", value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Per jaar</SelectItem>
                  <SelectItem value="month">Per maand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visits */}
          <div className="space-y-2">
            <Label htmlFor="visits12m" className="text-sm font-medium">
              Plaatsbezoeken {inputs.periodUnit === 'month' ? 'per maand' : 'per jaar'}
            </Label>
            <Input
              id="visits12m"
              type="number"
              min={0}
              value={inputs.visits12m}
              onChange={(e) => updateInput("visits12m", parseInt(e.target.value) || 0)}
              className="text-lg"
            />
          </div>

          {/* Sales */}
          <div className="space-y-2">
            <Label htmlFor="sales12m" className="text-sm font-medium">
              Verkopen {inputs.periodUnit === 'month' ? 'per maand' : 'per jaar'}
            </Label>
            <Input
              id="sales12m"
              type="number"
              min={0}
              value={inputs.sales12m}
              onChange={(e) => updateInput("sales12m", parseInt(e.target.value) || 0)}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* Settings Collapsible */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Settings className="h-4 w-4" />
              Instellingen
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border mt-2">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Workdays per Month */}
              <div className="space-y-2">
                <Label htmlFor="workdaysPerMonth" className="text-sm font-medium">
                  Werkdagen per maand
                </Label>
                <Input
                  id="workdaysPerMonth"
                  type="number"
                  min={1}
                  max={31}
                  value={inputs.workdaysPerMonth}
                  onChange={(e) =>
                    updateInput("workdaysPerMonth", parseInt(e.target.value) || 22)
                  }
                />
              </div>

              {/* Ownership Rate */}
              <div className="space-y-2">
                <Label htmlFor="ownershipRate" className="text-sm font-medium">
                  Eigendomsgraad (%)
                </Label>
                <Input
                  id="ownershipRate"
                  type="number"
                  min={0}
                  max={100}
                  value={inputs.ownershipRate}
                  onChange={(e) =>
                    updateInput("ownershipRate", parseInt(e.target.value) || 71)
                  }
                />
              </div>

              {/* Average Sale Price */}
              <div className="space-y-2">
                <Label htmlFor="avgSalePrice" className="text-sm font-medium">
                  Gemiddelde verkoopprijs (€)
                </Label>
                <Input
                  id="avgSalePrice"
                  type="number"
                  min={0}
                  value={inputs.avgSalePrice}
                  onChange={(e) =>
                    updateInput("avgSalePrice", parseInt(e.target.value) || 367000)
                  }
                />
              </div>

              {/* Commission Percentage */}
              <div className="space-y-2">
                <Label htmlFor="commissionPercent" className="text-sm font-medium">
                  Gemiddelde commissie (%)
                </Label>
                <Input
                  id="commissionPercent"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={inputs.commissionPercent}
                  onChange={(e) =>
                    updateInput("commissionPercent", parseFloat(e.target.value) || 2.78)
                  }
                />
              </div>

              {/* Conversion Rate */}
              <div className="space-y-2">
                <Label htmlFor="conversionRatePercent" className="text-sm font-medium">
                  Conversieratio naar effectief inkoopmandaat (%)
                </Label>
                <Input
                  id="conversionRatePercent"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={inputs.conversionRatePercent}
                  onChange={(e) =>
                    updateInput("conversionRatePercent", parseFloat(e.target.value) || 2)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Conservatief automation-effect. Niet in maand 1.
                </p>
              </div>

              {/* Ramp Months */}
              <div className="space-y-2">
                <Label htmlFor="rampMonths" className="text-sm font-medium">
                  Inlooptijd (maanden tot 50% effect)
                </Label>
                <Input
                  id="rampMonths"
                  type="number"
                  min={0}
                  max={18}
                  value={inputs.rampMonths}
                  onChange={(e) =>
                    updateInput("rampMonths", Math.min(18, Math.max(0, parseInt(e.target.value) || 5)))
                  }
                />
              </div>
            </div>

            {/* Reset Link */}
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1 text-sm text-primary hover:underline mt-4"
            >
              <RotateCcw className="h-3 w-3" />
              Reset naar voorbeeld
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export default InputSection;
