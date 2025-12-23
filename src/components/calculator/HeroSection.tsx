const HeroSection = () => {
  return (
    <section className="text-center py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        De vergeten verkoper.{" "}
        <span className="text-primary">Mini calculator</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Vul 2 cijfers in. Zie meteen hoeveel verkopers er nu al in je kopersflow zitten.
      </p>
    </section>
  );
};

export default HeroSection;
