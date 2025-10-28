export const CTASection = () => {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to power up your next project?</h2>
        <p className="max-w-2xl text-lg text-slate-300">
          Join thousands of Moroccan homeowners and businesses who trust SmartWorker Connect for solar, smart-home automation,
          EV charging, and more.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a href="/(auth)/register" className="button-primary">
            Create a free client account
          </a>
          <a href="/workers" className="rounded-lg border border-white/30 px-4 py-2 font-semibold text-white transition hover:bg-white/10">
            Explore worker marketplace
          </a>
        </div>
      </div>
    </section>
  );
};
