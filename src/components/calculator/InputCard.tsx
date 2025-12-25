import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { CalculatorInputs } from "@/lib/calculations";

interface InputCardProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}

const InputCard = ({ inputs, onChange }: InputCardProps) => {
  const updateInput = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    onChange({ ...inputs, [key]: value });
  };

  const periodLabel = inputs.periodUnit === 'month' ? '/maand' : '/jaar';

  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border h-fit">
      <div className="space-y-4">
        {/* Database Buyers */}
        <div className="space-y-1.5">
          <Label htmlFor="dbBuyers" className="text-sm font-medium">
            Kandidaat-kopers in database
          </Label>
          <Input
            id="dbBuyers"
            type="number"
            min={0}
            value={inputs.dbBuyers}
            onChange={(e) => updateInput("dbBuyers", parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-muted-foreground">
            Enkel contacten met een zoekfiche, niet ouder dan 12 maanden, en budget ≥ €350.000.
          </p>
        </div>

        {/* Visits & Sales with inline unit toggle */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Plaatsbezoeken & mandaten</Label>
            <Select
              value={inputs.periodUnit}
              onValueChange={(value: 'year' | 'month') => updateInput("periodUnit", value)}
            >
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">per jaar</SelectItem>
                <SelectItem value="month">per maand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1">
                <Label htmlFor="visits12m" className="text-xs text-muted-foreground">
                  VISIT tasks{periodLabel}
                </Label>
                <Info className="h-3 w-3 text-muted-foreground" />
              </div>
              <Input
                id="visits12m"
                type="number"
                min={0}
                value={inputs.visits12m}
                onChange={(e) => updateInput("visits12m", parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">Ruw, niet uniek</p>
            </div>
            <div>
              <Label htmlFor="sales12m" className="text-xs text-muted-foreground">
                Mandaten{periodLabel}
              </Label>
              <Input
                id="sales12m"
                type="number"
                min={0}
                value={inputs.sales12m}
                onChange={(e) => updateInput("sales12m", parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Manual Follow-up Slider */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Manuele opvolging: {inputs.manualFollowUpPercent}%
            </Label>
            <Badge variant="secondary" className="text-xs font-normal">
              Colibry: 100% nurture
            </Badge>
          </div>
          <Slider
            value={[inputs.manualFollowUpPercent]}
            onValueChange={([value]) => updateInput("manualFollowUpPercent", value)}
            min={0}
            max={20}
            step={1}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Hoeveel % kan je vandaag manueel opvolgen? (beperkt door tijd/capaciteit)
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputCard;
