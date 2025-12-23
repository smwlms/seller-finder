import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Uitleg = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[900px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar calculator
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Hoe berekenen we dit?
          </h1>
          <p className="text-muted-foreground mt-2">
            Transparante uitleg van alle formules en aannames.
          </p>
        </div>

        {/* Section A: Input Fields */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            A. Inputvelden
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-foreground">dbBuyers</strong>
              <p className="text-muted-foreground">
                Aantal actieve kandidaat kopers ≤ 24 maanden oud en budget &gt; €350.000
              </p>
            </div>
            <div>
              <strong className="text-foreground">followUpPercent</strong>
              <p className="text-muted-foreground">
                Percentage van de doelgroep dat je automatisch laat opvolgen
              </p>
            </div>
            <div>
              <strong className="text-foreground">visits12m en sales12m</strong>
              <p className="text-muted-foreground">
                Plaatsbezoeken en verkopen in de laatste 12 maanden
              </p>
            </div>
            <div>
              <strong className="text-foreground">Instellingen</strong>
              <p className="text-muted-foreground">
                workdaysPerMonth, ownershipRate, avgSalePrice, commissionPercent, rampMonths
              </p>
            </div>
          </div>
        </section>

        {/* Section B: Assumptions */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            B. Assumpties
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              <strong className="text-foreground">ownershipRate</strong> default 71% — het aandeel kandidaat kopers dat al een eigendom bezit
            </li>
            <li>
              <strong className="text-foreground">Plaatsbezoeken</strong> — we rekenen met niet-kopers per maand
            </li>
            <li>
              Voor plaatsbezoeken gebruiken we een <strong className="text-foreground">range 60% tot 70%</strong> van de niet-kopers als potentiële verkopers
            </li>
            <li>
              <strong className="text-foreground">commissionPercent</strong> en <strong className="text-foreground">avgSalePrice</strong> zijn aanpasbaar
            </li>
            <li>
              <strong className="text-foreground">followUpPercent</strong> is automation coverage — niet manuele opvolging
            </li>
          </ul>
        </section>

        {/* Section C: Core Calculations */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            C. Kernberekeningen
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Database</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`dbSellers = dbBuyers × ownershipRate
dbActivated = dbSellers × (followUpPercent / 100)
revenueDbYearSteady = dbActivated × avgSalePrice × (commissionPercent / 100)`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Plaatsbezoeken</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`visitsPerMonth = visits12m / 12
salesPerMonth = sales12m / 12
nonBuyersPerMonth = max(visitsPerMonth - salesPerMonth, 0)

visitSellersMonthLow = nonBuyersPerMonth × 0.60
visitSellersMonthHigh = nonBuyersPerMonth × 0.70

visitActivatedYearLow = (visitSellersMonthLow × 12) × (followUpPercent / 100)
visitActivatedYearHigh = (visitSellersMonthHigh × 12) × (followUpPercent / 100)

revenueYearSteadyLow = visitActivatedYearLow × avgSalePrice × (commissionPercent / 100)
revenueYearSteadyHigh = visitActivatedYearHigh × avgSalePrice × (commissionPercent / 100)`}</pre>
          </div>
        </section>

        {/* Section D: Ramp-up */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            D. Inloop en omzet na 12 en 24 maanden
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Het effect van automatische opvolging bouwt geleidelijk op. We rekenen daarom met maandfactoren die bepalen hoeveel van het steady-state effect je in elke maand realiseert.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Ramp-factor per maand m</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`Als rampMonths = 0:
  rampFactor(m) = 1

Anders:
  k = 4.394 / rampMonths
  rampFactor(m) = 1 / (1 + exp(-k × (m - rampMonths)))`}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Met deze keuze ligt de overgang van ongeveer 10% naar 90% effect over ongeveer rampMonths maanden, met het middenpunt op rampMonths.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Cumulatieve omzet (plaatsbezoeken)</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`monthlySteadyLow = revenueYearSteadyLow / 12
monthlySteadyHigh = revenueYearSteadyHigh / 12

revenue12mLow = sum(m=1..12) monthlySteadyLow × rampFactor(m)
revenue12mHigh = sum(m=1..12) monthlySteadyHigh × rampFactor(m)

revenue24mLow = sum(m=1..24) monthlySteadyLow × rampFactor(m)
revenue24mHigh = sum(m=1..24) monthlySteadyHigh × rampFactor(m)

year2OnlyLow = revenue24mLow - revenue12mLow
year2OnlyHigh = revenue24mHigh - revenue12mHigh`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Cumulatieve omzet (database)</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`monthlyDbSteady = revenueDbYearSteady / 12

revenueDb12m = sum(m=1..12) monthlyDbSteady × rampFactor(m)
revenueDb24m = sum(m=1..24) monthlyDbSteady × rampFactor(m)

revenueDbYear2Only = revenueDb24m - revenueDb12m`}</pre>
          </div>
        </section>

        {/* Section E: Disclaimer */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            E. Disclaimer
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              Dit is een rekenmodel op basis van aannames en voorbeelddata. Geen sectorbenchmark.
            </li>
            <li>
              Database en plaatsbezoeken kunnen overlappen. Tel ze niet blind op.
            </li>
          </ul>
        </section>

        {/* Back Button */}
        <div className="text-center pb-8">
          <Button size="lg" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar calculator
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Uitleg;
