import { Remedy } from './types';

export const REMEDIES: Remedy[] = [
  {
    id: 'ashwagandha',
    slug: 'ashwagandha',
    name: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    aliases: ['Indian Ginseng', 'Winter Cherry', 'Withania'],
    category: 'Adaptogen',
    tags: ['stress', 'anxiety', 'sleep', 'energy', 'thyroid', 'hormones', 'cortisol'],
    rating: 8.4,
    summary: 'A powerful adaptogenic herb used for over 3,000 years in Ayurvedic medicine to help the body manage stress, support energy levels, and promote restful sleep.',
    overview: `Ashwagandha is one of the most important herbs in Ayurveda, the traditional medicine system of India. The name comes from Sanskrit and roughly translates to "smell of the horse," which refers both to its unique smell and the traditional belief that consuming it gives you the strength and vitality of a horse.

The root is the primary part used medicinally. It contains active compounds called withanolides, which are responsible for most of its health benefits. Modern research has validated many of the traditional uses, making ashwagandha one of the most studied adaptogens available today.

What makes ashwagandha special is its ability to work in multiple directions. Unlike stimulants that push your body in one direction, adaptogens help your body find balance. If you're wound up and anxious, ashwagandha can help calm you down. If you're depleted and fatigued, it can help restore your energy. This balancing effect is why so many people find it helpful for a wide range of concerns.`,
    howItWorks: `Ashwagandha works primarily through the HPA axis, which is your body's central stress response system. When you experience stress, your hypothalamus signals your pituitary gland, which then tells your adrenal glands to release cortisol. Over time, chronic stress can dysregulate this system.

Ashwagandha helps normalize cortisol levels, particularly in people with elevated stress. It also appears to modulate GABA receptors in the brain, which promotes a calming effect without sedation. Additionally, it has antioxidant properties and may support thyroid function by influencing thyroid hormone production.

The withanolides in ashwagandha also have anti-inflammatory effects and may support the immune system, though these benefits are secondary to its stress-modulating effects.`,
    benefits: [
      {
        name: 'Stress and Anxiety Reduction',
        description: 'Multiple clinical trials show significant reductions in perceived stress and anxiety scores. Works by lowering cortisol and supporting GABA activity.',
        evidenceLevel: 5,
      },
      {
        name: 'Sleep Quality',
        description: 'Helps improve sleep onset and quality, particularly in people whose sleep is disrupted by stress or an overactive mind at night.',
        evidenceLevel: 4,
      },
      {
        name: 'Energy and Fatigue',
        description: 'Supports sustained energy without the jitters of stimulants. Particularly helpful for fatigue related to chronic stress or adrenal dysfunction.',
        evidenceLevel: 4,
      },
      {
        name: 'Cognitive Function',
        description: 'May improve memory, reaction time, and task performance. Research suggests benefits for both healthy adults and those with mild cognitive concerns.',
        evidenceLevel: 3,
      },
      {
        name: 'Physical Performance',
        description: 'Some studies show improvements in strength, cardiorespiratory endurance, and recovery in athletes and active individuals.',
        evidenceLevel: 3,
      },
      {
        name: 'Thyroid Support',
        description: 'May help normalize thyroid hormone levels, particularly in people with subclinical hypothyroidism. Use with caution and monitoring.',
        evidenceLevel: 3,
      },
    ],
    dosages: [
      {
        form: 'Standardized Root Extract',
        amount: '300-600mg daily',
        timing: 'Once or twice daily with food',
        notes: 'Look for extracts standardized to 5% or more withanolides. KSM-66 and Sensoril are well-researched branded extracts.',
      },
      {
        form: 'Root Powder',
        amount: '3-6 grams daily',
        timing: 'Divided into 2-3 doses with meals',
        notes: 'Traditional form, but requires higher doses than concentrated extracts.',
      },
      {
        form: 'Tincture',
        amount: '2-4ml daily',
        timing: '1-2ml twice daily in water',
        notes: 'Good option if you have trouble with capsules. Taste is earthy and somewhat bitter.',
      },
    ],
    bestTimeToTake: 'Ashwagandha can be taken morning or evening depending on your goals. For stress and energy support, morning works well. For sleep support, take it 1-2 hours before bed. Some people do well splitting the dose between morning and evening.',
    howLongToWork: 'Most people notice effects within 2-4 weeks of consistent use. Full benefits for stress and cortisol regulation typically develop over 6-8 weeks. Some effects like improved sleep may be noticed sooner.',
    sideEffects: [
      'Mild digestive upset, especially on an empty stomach',
      'Drowsiness in some people, particularly at higher doses',
      'Headache (uncommon)',
      'Vivid dreams when taken before bed',
    ],
    whoShouldAvoid: [
      'Pregnant or breastfeeding women (insufficient safety data)',
      'People with hyperthyroidism or Graves disease (may increase thyroid hormones)',
      'Those with autoimmune conditions (may stimulate immune activity)',
      'Anyone scheduled for surgery (stop 2 weeks before due to potential sedative interactions)',
      'People taking immunosuppressant medications',
    ],
    interactions: [
      {
        substance: 'Thyroid medications (levothyroxine)',
        severity: 'moderate',
        description: 'May enhance thyroid hormone levels. If you take thyroid medication, have your levels monitored and adjust dosing with your doctor.',
      },
      {
        substance: 'Sedatives and sleep medications',
        severity: 'moderate',
        description: 'May increase drowsiness when combined with benzodiazepines, sleep aids, or other sedating substances.',
      },
      {
        substance: 'Immunosuppressants',
        severity: 'moderate',
        description: 'May counteract medications designed to suppress immune function.',
      },
      {
        substance: 'Blood pressure medications',
        severity: 'mild',
        description: 'May have mild blood pressure lowering effects. Monitor if you take BP medication.',
      },
      {
        substance: 'Blood sugar medications',
        severity: 'mild',
        description: 'May lower blood sugar. Monitor levels if you take diabetes medication.',
      },
    ],
    faqs: [
      {
        question: 'Does ashwagandha help with sleep?',
        answer: 'Yes, ashwagandha can help improve sleep quality, particularly if your sleep issues are related to stress or an overactive mind. It works differently than sedatives. Rather than knocking you out, it helps calm your nervous system so sleep comes more naturally. Taking it 1-2 hours before bed tends to work best for sleep support.',
      },
      {
        question: 'Can I take ashwagandha every day?',
        answer: 'Yes, ashwagandha is generally safe for daily use and works best when taken consistently. Most studies showing benefits used daily dosing for 8-12 weeks. Some practitioners recommend cycling off for 1-2 weeks every few months, though this is not strictly necessary for most people.',
      },
      {
        question: 'How long does ashwagandha take to work?',
        answer: 'Most people notice initial effects within 2-4 weeks. These might include better sleep, feeling more resilient to stress, or improved energy. The full benefits, particularly for cortisol regulation and anxiety reduction, typically develop over 6-8 weeks of consistent use.',
      },
      {
        question: 'Can I take ashwagandha with coffee?',
        answer: 'Yes, you can take ashwagandha with coffee. In fact, some people find it takes the edge off coffee jitters while maintaining alertness. Just be aware that taking it with food generally improves absorption and reduces any chance of stomach upset.',
      },
      {
        question: 'Is ashwagandha safe for long-term use?',
        answer: 'Based on current research and traditional use, ashwagandha appears safe for long-term use in healthy adults at recommended doses. Studies up to 12 weeks show good safety profiles. If you plan to use it longer, periodic check-ins with a healthcare provider are reasonable, especially if you have thyroid concerns.',
      },
      {
        question: 'What is the difference between KSM-66 and Sensoril?',
        answer: 'Both are well-researched, standardized ashwagandha extracts. KSM-66 is a full-spectrum root extract standardized to 5% withanolides and tends to be more energizing. Sensoril uses both root and leaf, is standardized to 10% withanolides, and tends to be more calming. Choose KSM-66 for daytime energy and stress support, Sensoril for anxiety and sleep.',
      },
    ],
    qualityMarkers: [
      'Look for standardization to withanolides (5% or higher)',
      'KSM-66 and Sensoril are clinically studied branded extracts',
      'Organic certification indicates cleaner growing practices',
      'Third-party testing for heavy metals is important (ashwagandha can accumulate heavy metals from soil)',
      'Root extract is traditional; root + leaf extracts like Sensoril are also effective',
    ],
    products: [
      {
        name: 'KSM-66 Ashwagandha',
        brand: 'Nootropics Depot',
        form: 'Capsules',
        size: '120 capsules, 300mg',
        affiliateUrl: '#',
        note: 'Highly regarded for quality and purity testing',
      },
      {
        name: 'Sensoril Ashwagandha',
        brand: 'Jarrow Formulas',
        form: 'Capsules',
        size: '60 capsules, 225mg',
        affiliateUrl: '#',
        note: 'Good choice for calming effects and sleep',
      },
      {
        name: 'Organic Ashwagandha Root Powder',
        brand: 'Banyan Botanicals',
        form: 'Powder',
        size: '1 lb',
        affiliateUrl: '#',
        note: 'Traditional powder form, USDA organic',
      },
    ],
    relatedRemedies: ['rhodiola', 'holy-basil', 'eleuthero'],
    oftenPairedWith: ['magnesium-glycinate', 'l-theanine', 'rhodiola'],
    lastUpdated: '2026-01-28',
  },
];

export function getRemedyBySlug(slug: string): Remedy | undefined {
  return REMEDIES.find(r => r.slug === slug);
}

export function searchRemedies(query: string): Remedy[] {
  const lowerQuery = query.toLowerCase();
  
  return REMEDIES.filter(remedy => {
    // Search in name, botanical name, aliases
    if (remedy.name.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.botanicalName.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.aliases.some(a => a.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in tags
    if (remedy.tags.some(t => t.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in FAQ questions and answers
    if (remedy.faqs.some(faq => 
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    )) return true;
    
    // Search in benefits
    if (remedy.benefits.some(b => 
      b.name.toLowerCase().includes(lowerQuery) ||
      b.description.toLowerCase().includes(lowerQuery)
    )) return true;
    
    return false;
  });
}

export function getAllRemedies(): Remedy[] {
  return REMEDIES;
}
