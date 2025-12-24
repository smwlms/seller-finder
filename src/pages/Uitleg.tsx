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

        {/* Section A: What do we measure */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            A. Wat meten we?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            We schatten hoeveel kandidaat-kopers in je database en bezoekersstroom óók een potentiële verkoper zijn.
            Vervolgens berekenen we hoeveel "extra mandaten" je mist zonder automatische nurture (Colibry) 
            versus wat je vandaag manueel aankan.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Kernvraag:</strong> Wat is het verschil in bereik en dus in resultaten 
            tussen manuele opvolging (beperkt door capaciteit) en Colibry (100% automatische nurture)?
          </p>
        </section>

        {/* Section B: Input Fields */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            B. Inputvelden
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-foreground">Kandidaat-kopers in database</strong>
              <p className="text-muted-foreground">
                Enkel contacten met een zoekfiche, niet ouder dan 12 maanden, en budget ≥ €350.000.
              </p>
            </div>
            <div>
              <strong className="text-foreground">Manuele opvolging (%)</strong>
              <p className="text-muted-foreground">
                Hoeveel procent van de doelgroep kan je vandaag manueel opvolgen? (beperkt door tijd/capaciteit)
              </p>
            </div>
            <div>
              <strong className="text-foreground">Plaatsbezoeken & verkopen</strong>
              <p className="text-muted-foreground">
                Kies of je per maand of per jaar invoert. Beide velden delen dezelfde periode-eenheid.
              </p>
            </div>
            <div>
              <strong className="text-foreground">Extra succesratio nurture (%)</strong>
              <p className="text-muted-foreground">
                Conservatieve schatting: welk percentage van de geïdentificeerde "stille verkopers" 
                levert extra inkoopmandaten op dankzij consistente opvolging? Default: 2%.
              </p>
            </div>
            <div>
              <strong className="text-foreground">Overige instellingen</strong>
              <p className="text-muted-foreground">
                werkdagen/maand, eigendomsgraad, gem. verkoopprijs, commissie, inlooptijd (maanden), 
                deliverability parameters, acquisitiecontext.
              </p>
            </div>
          </div>
        </section>

        {/* Section C: Assumptions */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            C. Aannames
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              <strong className="text-foreground">Colibry coverage = 100%</strong> — 
              Colibry volgt automatisch iedereen op (maar effectief bereik daalt door dropoff).
            </li>
            <li>
              <strong className="text-foreground">Eigendomsgraad</strong> default 71% — 
              het aandeel kandidaat-kopers dat al een eigendom bezit (potentiële verkopers).
            </li>
            <li>
              <strong className="text-foreground">Extra succesratio</strong> default 2% — 
              conservatieve conversie naar effectief inkoopmandaat door nurture.
            </li>
            <li>
              Voor plaatsbezoeken gebruiken we een <strong className="text-foreground">range 60% tot 70%</strong> 
              van de niet-kopers als potentiële verkopers.
            </li>
            <li>
              <strong className="text-foreground">Overlap waarschuwing</strong> — 
              Database en plaatsbezoeken kunnen overlappen. Tel ze niet op tot één totaal.
            </li>
          </ul>
        </section>

        {/* Section D: Core Calculations */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            D. Kernberekeningen
          </h2>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Manueel vs Colibry</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`manualCoverage = manualFollowUpPercent / 100
colibryCoverage = 1.0  // 100% (maar effectief bereik daalt door dropoff)
conversionRate = conversionRatePercent / 100`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Database</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`dbSellers = dbBuyers × ownershipRate

// Manueel scenario
dbWarmManual = dbSellers × manualCoverage
dbDealsManual = dbWarmManual × conversionRate

// Colibry scenario
dbWarmColibry = dbSellers × colibryCoverage
dbDealsColibry = dbWarmColibry × conversionRate

// Delta = Gemist potentieel
extraDealsDb = dbDealsColibry - dbDealsManual`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Plaatsbezoeken</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`visitsPerMonth = visits12m / 12
salesPerMonth = sales12m / 12
nonBuyersPerMonth = max(visitsPerMonth - salesPerMonth, 0)

// Range 60-70% zijn potentiële verkopers
visitSellersMonthLow = nonBuyersPerMonth × 0.60
visitSellersMonthHigh = nonBuyersPerMonth × 0.70

// Per scenario (manual of colibry)
warmContacts = visitSellersYear × coverage
extraDeals = warmContacts × conversionRate
revenue = extraDeals × avgSalePrice × commissionPercent`}</pre>
          </div>
        </section>

        {/* Section E: Ramp-up */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            E. Inloop (ramp-up)
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Het effect van automatische opvolging bouwt geleidelijk op. We rekenen daarom met 
            maandfactoren die bepalen hoeveel van het steady-state effect je in elke maand realiseert.
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
            Met deze keuze ligt de overgang van ongeveer 10% naar 90% effect over ongeveer rampMonths maanden, 
            met het middenpunt (50%) op rampMonths.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Cumulatieve omzet</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`monthlySteady = revenueYearSteady / 12

// Manueel (zonder dropoff)
revenue12m = sum(m=1..12) monthlySteady × rampFactor(m)

// Colibry (met dropoff)
revenue12m = sum(m=1..12) monthlySteady × rampFactor(m) × effectiveFactor(m)

revenue24m = sum(m=1..24) ...
year2Only = revenue24m - revenue12m`}</pre>
          </div>
        </section>

        {/* Section F: Deliverability & Drop-off */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            F. Deliverability & drop-off
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Colibry = 100% nurture, maar het effectieve bereik daalt licht door bounces en uitschrijvingen.
            Dit model past alleen op het Colibry scenario (manueel is niet "email-heavy").
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Model</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`deliveredFactor = 1 - bounceRate

// Retentie daalt exponentieel door unsubs
retention(m) = (1 - unsubPerEmail)^(emailsPerMonth × m)

effectiveFactor(m) = deliveredFactor × retention(m)`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Waarom geen open rates?</h3>
          <p className="text-sm text-muted-foreground">
            Open rates zijn onbetrouwbaar door privacy-maatregelen (Apple Mail Privacy Protection, etc.) 
            en meten niet of iemand je mail ontvangt of leest. Bounces en unsubs zijn objectief meetbaar 
            en beïnvloeden direct het bereik.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Defaults</h3>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            <li>Bounce rate: 2,33%</li>
            <li>Uitschrijving per mail: 0,20%</li>
            <li>E-mails per maand: 2 (instelbaar 0-8)</li>
          </ul>
        </section>

        {/* Section G: Disclaimer */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            G. Disclaimer
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>
              Dit is een rekenmodel op basis van aannames en voorbeelddata. Geen sectorbenchmark.
            </li>
            <li>
              Database en plaatsbezoeken kunnen overlappen. Tel ze niet blind op.
            </li>
            <li>
              Acquisitiecontext (29,5% mandaten met voorafgaand bezoek, 173 gesprekken/jaar) 
              is enkel referentie-informatie uit de originele businesscase.
            </li>
          </ul>
        </section>

        {/* Section H: Baseline Status */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            H. Baseline status (vandaag)
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            We tonen expliciet wat je vandaag al haalt uit eerdere contacten, zonder Colibry.
            Dit geeft context aan de "gemist potentieel" berekening.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Formule</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`priorVisitShare = 0.295  // 29,5% default (instelbaar)
baselineMandatesFromPriorContact = salesPerYear × priorVisitShare`}</pre>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            In de businesscase had 29,5% van de mandaten een voorafgaand plaatsbezoek. 
            Dit is de baseline: wat je vandaag al haalt zonder Colibry.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Interpretatie</h3>
          <p className="text-sm text-muted-foreground">
            Deze baseline wordt getoond boven de fold als context: 
            "Vandaag: ~29,5% (= X) mandaten uit eerdere contacten".
            Het helpt de gebruiker begrijpen wat hun huidige situatie is voordat ze de extra opbrengst zien.
          </p>
        </section>

        {/* Section I: Untapped Pool */}
        <section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            I. Untapped pool
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            De "untapped pool" toont hoeveel stille verkopers nog op tafel liggen, 
            na aftrek van wat je vandaag al haalt.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Formule</h3>
          <div className="bg-secondary/30 rounded-md p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">{`// Stille verkopers uit bezoekersstroom (range 60-70%)
visitSellersYearLow = nonBuyersYear × 0.60
visitSellersYearHigh = nonBuyersYear × 0.70

// Untapped pool = stille verkopers − wat je al haalt
untappedSellersYearLow = max(visitSellersYearLow - baselineMandatesFromPriorContact, 0)
untappedSellersYearHigh = max(visitSellersYearHigh - baselineMandatesFromPriorContact, 0)`}</pre>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Waarom dit nuttig is</h3>
          <p className="text-sm text-muted-foreground">
            De untapped pool geeft een concreet beeld van de opportuniteit. 
            Het is niet het aantal extra mandaten (dat hangt af van conversie), 
            maar het potentieel dat nog niet benut wordt met de huidige aanpak.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6 mb-2">Beperking</h3>
          <p className="text-sm text-muted-foreground">
            We trekken alleen de baseline van de bezoekersstroom af. 
            Voor database is er geen directe "baseline" omdat die stroom anders werkt 
            (geen directe relatie met verkopen via plaatsbezoek).
          </p>
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
