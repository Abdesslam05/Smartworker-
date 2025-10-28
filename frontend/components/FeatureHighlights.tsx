import { ShieldCheckIcon, BoltIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Verified professionals',
    description: 'Every worker is identity-verified and manually reviewed by our operations team.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Smart matching',
    description: 'Our recommendation engine ranks experts by experience, rating, and proximity.',
    icon: BoltIcon,
  },
  {
    title: 'In-app collaboration',
    description: 'Chat, share files, approve milestones, and pay with ease in one workspace.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

export const FeatureHighlights = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900">Why SmartWorker Connect?</h2>
          <p className="text-lg text-slate-600">
            Designed with Moroccan homeowners, contractors, and facility managers in mind. From solar to smart security, we make
            it simple to find the right expert.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="card space-y-4 p-6">
              <feature.icon className="h-8 w-8 text-brand-accent" />
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
