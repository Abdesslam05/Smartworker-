import { SearchHero } from '../components/SearchHero';
import { FeatureHighlights } from '../components/FeatureHighlights';
import { TopWorkers } from '../features/home/TopWorkers';
import { CTASection } from '../components/CTASection';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <SearchHero />
      <FeatureHighlights />
      <TopWorkers />
      <CTASection />
    </div>
  );
}
