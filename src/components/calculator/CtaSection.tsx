import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface CtaSectionProps {
  ctaUrl: string;
}

const CtaSection = ({ ctaUrl }: CtaSectionProps) => {
  return (
    <section className="text-center py-8 space-y-4">
      <Button
        size="lg"
        className="text-lg px-8 py-6 h-auto"
        asChild
      >
        <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
          Plan een demo
          <ExternalLink className="ml-2 h-5 w-5" />
        </a>
      </Button>

      <div className="pt-4">
        <Link
          to="/uitleg"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Hoe berekenen we dit?
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
