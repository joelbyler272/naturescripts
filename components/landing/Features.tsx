import { MessageSquare, Brain, Leaf, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Share Your Symptoms',
    description:
      'Tell our AI about your health concerns. The more detail you provide, the more personalized your protocol.',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description:
      'Claude analyzes your symptoms using thousands of research papers and traditional herbal medicine principles.',
  },
  {
    icon: Leaf,
    title: 'Get Your Protocol',
    description:
      'Receive a detailed herbal protocol with dosages, timing, diet recommendations, and lifestyle guidance.',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description:
      'Pro members can track symptoms over time and receive updated protocols based on your progress.',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">How It Works</h2>
          <p className="text-lg text-charcoal/70">
            From symptoms to solutions in minutes
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">{feature.title}</h3>
              <p className="text-charcoal/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
