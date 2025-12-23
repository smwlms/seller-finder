import { useState, useMemo } from "react";
import HeroSection from "@/components/calculator/HeroSection";
import InputSection from "@/components/calculator/InputSection";
import MissedPotentialCard from "@/components/calculator/MissedPotentialCard";
import DatabaseResultsCard from "@/components/calculator/DatabaseResultsCard";
import VisitsResultsCard from "@/components/calculator/VisitsResultsCard";
import CtaSection from "@/components/calculator/CtaSection";
import {
  CalculatorInputs,
  DEFAULT_INPUTS,
  calculateDatabaseResults,
  calculateVisitsResults,
  buildCtaUrl,
} from "@/lib/calculations";

const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const dbResults = useMemo(() => calculateDatabaseResults(inputs), [inputs]);
  const visitsResults = useMemo(() => calculateVisitsResults(inputs), [inputs]);
  const ctaUrl = useMemo(
    () => buildCtaUrl(inputs, dbResults, visitsResults),
    [inputs, dbResults, visitsResults]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1100px] mx-auto px-4 py-8">
        <HeroSection />

        <InputSection inputs={inputs} onChange={setInputs} />

        {/* Missed Potential Card - Prominent */}
        <section className="mt-8">
          <MissedPotentialCard dbResults={dbResults} visitsResults={visitsResults} />
        </section>

        {/* Results Section */}
        <section className="grid gap-6 md:grid-cols-2 mt-6">
          <DatabaseResultsCard results={dbResults} rampMonths={inputs.rampMonths} />
          <VisitsResultsCard results={visitsResults} rampMonths={inputs.rampMonths} />
        </section>

        <CtaSection ctaUrl={ctaUrl} />
      </div>
    </div>
  );
};

export default Calculator;
