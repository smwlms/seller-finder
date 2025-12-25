import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

const BusinesscaseDataModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Businesscase & data-onderzoek
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Businesscase & data-onderzoek
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-sm">
          {/* Whitepaper Link */}
          <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
            <a 
              href="https://spice-relation-1cc.notion.site/De-vergeten-verkoper-2d116e8366e580239706f47696b29cf5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              Bekijk volledige whitepaper →
            </a>
          </div>

          {/* Section 1: Core Numbers */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">1</span>
              Businesscase kerncijfers
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between">
                <span>Database pool (12m, zoekfiche ≤12m, budget ≥350k):</span>
                <span className="font-medium text-foreground">1.109 unieke contacten</span>
              </li>
              <li className="flex justify-between">
                <span>Baseline (mandaten uit eerder contact):</span>
                <span className="font-medium text-foreground">29,5%</span>
              </li>
              <li className="flex justify-between">
                <span>Acquisitiegesprekken/jaar (context):</span>
                <span className="font-medium text-foreground">173</span>
              </li>
            </ul>
          </section>

          {/* Section 2: CRM Data Quality */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">2</span>
              CRM datakwaliteit (VISIT tasks, 12m)
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between">
                <span>VISIT tasks totaal:</span>
                <span className="font-medium text-foreground">2.081</span>
              </li>
              <li className="flex justify-between">
                <span>Geen persoon gekoppeld:</span>
                <span className="font-medium text-foreground">914 (43,9%)</span>
              </li>
              <li className="flex justify-between">
                <span>Geen pand gekoppeld:</span>
                <span className="font-medium text-foreground">894 (43,0%)</span>
              </li>
              <li className="flex justify-between">
                <span>Missing beiden:</span>
                <span className="font-medium text-foreground">870 (41,8%)</span>
              </li>
              <li className="flex justify-between">
                <span>Volledig bruikbaar (persoon + pand):</span>
                <span className="font-medium text-foreground">1.143 (54,9%)</span>
              </li>
              <li className="flex justify-between">
                <span>Slots met pand (no-person maar wél property_id):</span>
                <span className="font-medium text-foreground">44 (2,1%)</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              ⚠️ Unmatched slots (~43) → realistische upper bound unieke bezoekers is ~+43 bovenop lower bound
            </p>
          </section>

          {/* Section 3: Listing History */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">3</span>
              Listing_history owner completeness (12m)
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between">
                <span>For_sale rows:</span>
                <span className="font-medium text-foreground">4.172</span>
              </li>
              <li className="flex justify-between">
                <span>Missing owner_ids:</span>
                <span className="font-medium text-foreground">2.678 (64,2%)</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              ⚠️ Analyses op owners zijn lower bounds wanneer owner_id ontbreekt.
            </p>
          </section>

          {/* Section 4: Prior Visits */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">4</span>
              Prior visits vóór "for sale" (2025 YTD, lower bound)
            </h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex justify-between">
                <span>Owners die in 2025 for sale gingen (uniek):</span>
                <span className="font-medium text-foreground">137</span>
              </li>
              <li className="flex justify-between">
                <span>Owners met prior visit aan ander pand:</span>
                <span className="font-medium text-foreground">31</span>
              </li>
              <li className="flex justify-between">
                <span>Share:</span>
                <span className="font-medium text-foreground">22,63% (lower bound)</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 italic">
              ⚠️ Door missing links is dit een lower bound.
            </p>
          </section>

          {/* Section 5: Implications */}
          <section>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded">5</span>
              Wat betekent dit voor de calculator?
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Visit-cijfers op basis van tasks zijn <strong className="text-foreground">niet gelijk aan unieke bezoekers</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Daarom ondersteunen we "unieke bezoekers"-modus (lower + realistische upper)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong className="text-foreground">Tel Database en Visits niet op</strong> (mogelijke overlap)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>De 2% "uplift" is <strong className="text-foreground">incrementeel</strong> op de extra doelgroep die Colibry bereikt (niet absoluut op hele pool)</span>
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinesscaseDataModal;
