import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import InputCard from "@/components/calculator/InputCard";
import CoreResultCard from "@/components/calculator/CoreResultCard";
import DetailsAccordion from "@/components/calculator/DetailsAccordion";
import SettingsCollapsible from "@/components/calculator/SettingsCollapsible";
import {
  CalculatorInputs,
  DEFAULT_INPUTS,
  calculateDatabaseResults,
  calculateVisitsResults,
  buildCtaUrl,
  buildViewModel,
} from "@/lib/calculations";

const Calculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const dbResults = useMemo(() => calculateDatabaseResults(inputs), [inputs]);
  const visitsResults = useMemo(() => calculateVisitsResults(inputs), [inputs]);
  const viewModel = useMemo(() => buildViewModel(inputs, dbResults, visitsResults), [inputs, dbResults, visitsResults]);
  const ctaUrl = useMemo(() => buildCtaUrl(inputs, dbResults, visitsResults), [inputs, dbResults, visitsResults]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1000px] mx-auto px-4 py-6">
        {/* Compact Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {viewModel.heroCopy.title}{" "}
            <span className="text-primary">{viewModel.heroCopy.subtitle}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            {viewModel.heroCopy.microcopy}
          </p>
          <Link
            to="/uitleg"
            className="text-xs text-primary hover:underline mt-1 inline-block"
          >
            Hoe berekenen we dit? →
          </Link>
        </header>

        {/* Above the fold: Inputs + Core Result */}
        <div className="grid gap-4 lg:grid-cols-2 mb-4">
          <InputCard inputs={inputs} onChange={setInputs} />
          <CoreResultCard viewModel={viewModel} />
        </div>

        {/* CTA - Above fold */}
        <div className="text-center py-4 mb-6">
          <Button size="lg" className="px-8" asChild>
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              Plan een demo
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Gratis, vrijblijvend, 30 minuten
          </p>
        </div>

        {/* Settings */}
        <SettingsCollapsible inputs={inputs} onChange={setInputs} />

        {/* Details Accordion - Below fold */}
        <section className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Details</h3>
          <DetailsAccordion viewModel={viewModel} />
        </section>
      </div>
    </div>
  );
};

export default Calculator;
