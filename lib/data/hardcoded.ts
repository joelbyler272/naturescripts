import { User, Consultation, HerbDatabase, Message, Protocol } from '@/types';

// Hardcoded User (for skeleton - assuming logged in)
export const MOCK_USER: User = {
  id: 'user-123',
  email: 'demo@naturescripts.com',
  first_name: 'Jordan',
  email_verified: true,
  tier: 'free',
  created_at: '2025-01-01T00:00:00Z',
};

// Hardcoded Past Consultations
export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'consult-1',
    user_id: 'user-123',
    initial_input: 'I have been experiencing fatigue, bloating after meals, and difficulty sleeping',
    conversation_log: [],
    protocol_data: {
      analysis: {
        patterns: ['Digestive dysfunction', 'Adrenal fatigue', 'Sleep disruption'],
        explanation: 'Your symptoms suggest a combination of digestive stress and HPA axis dysregulation. Bloating indicates possible low stomach acid or enzyme deficiency, while fatigue and sleep issues point to adrenal and cortisol rhythm imbalances.',
      },
      phase1: {
        herbs: [
          {
            name: 'Ashwagandha',
            botanical_name: 'Withania somnifera',
            why: 'Adaptogen to support adrenal function and cortisol rhythm',
            dosage: '300-500mg standardized extract',
            timing: 'Morning and early afternoon',
            safety: 'Avoid if pregnant. May increase thyroid hormone in some individuals.',
            product_link: 'https://example.com/ashwagandha',
          },
          {
            name: 'Gentian Root',
            botanical_name: 'Gentiana lutea',
            why: 'Bitter to stimulate digestive enzyme and HCl production',
            dosage: '1-2 dropperfuls tincture',
            timing: '15 minutes before meals',
            safety: 'Avoid with active ulcers or GERD',
          },
        ],
        diet: {
          add: ['Warm cooked foods', 'Bone broth', 'Fermented vegetables'],
          remove: ['Raw/cold foods', 'Processed sugars', 'Late-night eating'],
        },
        lifestyle: ['10pm bedtime', 'Morning sunlight exposure', 'Gentle movement (yoga/walking)'],
      },
      testing_recommendations: ['Comprehensive stool test', 'Cortisol awakening response (CAR)'],
      red_flags: [],
    },
    protocol_version: 1,
    tier_at_creation: 'free',
    status: 'completed',
    created_at: '2025-01-16T10:00:00Z',
    updated_at: '2025-01-16T10:30:00Z',
  },
  {
    id: 'consult-2',
    user_id: 'user-123',
    initial_input: 'Anxiety and brain fog throughout the day',
    conversation_log: [],
    protocol_data: {
      analysis: {
        patterns: ['Nervous system dysregulation', 'Possible neurotransmitter imbalance'],
        explanation: 'Anxiety combined with brain fog may indicate blood sugar instability, gut-brain axis dysfunction, or nutrient deficiencies affecting neurotransmitter production.',
      },
      phase1: {
        herbs: [
          {
            name: 'Rhodiola',
            botanical_name: 'Rhodiola rosea',
            why: 'Adaptogen for mental clarity and stress resilience',
            dosage: '200-400mg standardized extract',
            timing: 'Morning',
            safety: 'May be stimulating for some; start low',
          },
        ],
        diet: {
          add: ['Protein-rich breakfast', 'Omega-3 rich foods', 'Complex carbohydrates'],
          remove: ['Caffeine after noon', 'Refined sugars', 'Alcohol'],
        },
        lifestyle: ['5-minute breathing exercises', 'Regular meal timing', 'Reduce screen time'],
      },
      red_flags: [],
    },
    protocol_version: 1,
    tier_at_creation: 'free',
    status: 'completed',
    created_at: '2025-01-10T14:30:00Z',
    updated_at: '2025-01-10T15:00:00Z',
  },
];

// Hardcoded Chat Messages (for consultation interface)
export const MOCK_CHAT_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "Hello! I'm your AI naturopathic consultant. I'll ask you a few questions to create a personalized herbal protocol. Let's start: What are your primary health concerns right now?",
    timestamp: '2025-01-22T10:00:00Z',
  },
  {
    role: 'user',
    content: 'I have been dealing with chronic fatigue and digestive issues',
    timestamp: '2025-01-22T10:01:00Z',
  },
  {
    role: 'assistant',
    content: 'Thank you for sharing. Can you describe the digestive issues more specifically? For example: bloating, gas, constipation, diarrhea, or pain? And when do they typically occur?',
    timestamp: '2025-01-22T10:01:30Z',
  },
];

// Hardcoded Herbal Database
export const MOCK_HERBS: HerbDatabase[] = [
  {
    id: 'herb-1',
    name: 'Ashwagandha',
    botanical_name: 'Withania somnifera',
    overview: 'A powerful adaptogenic herb used in Ayurvedic medicine for over 3,000 years. Known as "Indian Ginseng," it helps the body adapt to stress and supports overall vitality.',
    benefits: [
      'Reduces cortisol and stress',
      'Improves sleep quality',
      'Enhances cognitive function',
      'Supports thyroid function',
      'Increases energy and stamina',
      'Balances blood sugar',
    ],
    dosage: '300-500mg standardized extract (5% withanolides) twice daily, or 3-6g powdered root daily',
    contraindications: [
      'Pregnancy and breastfeeding',
      'Autoimmune conditions (may stimulate immune system)',
      'Hyperthyroidism (may increase thyroid hormone)',
    ],
    drug_interactions: [
      'Thyroid medications (may enhance effects)',
      'Sedatives (may increase drowsiness)',
      'Immunosuppressants (may interfere)',
    ],
    side_effects: ['Mild drowsiness', 'Stomach upset (rare)', 'Diarrhea (high doses)'],
    evidence_level: 4,
    image_url: '/herbs/ashwagandha.jpg',
  },
  {
    id: 'herb-2',
    name: 'Rhodiola',
    botanical_name: 'Rhodiola rosea',
    overview: 'An adaptogenic herb native to cold regions of Europe and Asia. Known for enhancing mental performance, reducing fatigue, and improving stress resilience.',
    benefits: [
      'Increases mental clarity and focus',
      'Reduces physical and mental fatigue',
      'Enhances exercise performance',
      'Supports mood and reduces anxiety',
      'Improves stress adaptation',
    ],
    dosage: '200-600mg standardized extract (3% rosavins, 1% salidroside) daily, taken in morning or early afternoon',
    contraindications: ['Bipolar disorder', 'Pregnancy and breastfeeding'],
    drug_interactions: ['Antidepressants (monitor closely)', 'Stimulants (may enhance effects)'],
    side_effects: ['Mild jitteriness', 'Insomnia if taken late in day'],
    evidence_level: 4,
    image_url: '/herbs/rhodiola.jpg',
  },
  {
    id: 'herb-3',
    name: 'Turmeric',
    botanical_name: 'Curcuma longa',
    overview: 'A bright yellow spice used in traditional medicine and cooking. The active compound curcumin has powerful anti-inflammatory and antioxidant properties.',
    benefits: [
      'Reduces inflammation',
      'Supports joint health',
      'Enhances liver detoxification',
      'Improves cognitive function',
      'Supports cardiovascular health',
      'May reduce depression symptoms',
    ],
    dosage: '500-2000mg curcumin extract daily (with black pepper or fat for absorption)',
    contraindications: ['Gallbladder disease', 'Bleeding disorders'],
    drug_interactions: ['Blood thinners (increases bleeding risk)', 'Diabetes medications (may lower blood sugar)'],
    side_effects: ['Stomach upset', 'Nausea (high doses)', 'Diarrhea'],
    evidence_level: 5,
    image_url: '/herbs/turmeric.jpg',
  },
  {
    id: 'herb-4',
    name: 'Ginger',
    botanical_name: 'Zingiber officinale',
    overview: 'A warming, aromatic root used for thousands of years in cooking and medicine. Excellent for digestive support and inflammation.',
    benefits: [
      'Relieves nausea and vomiting',
      'Reduces inflammation and pain',
      'Supports digestion',
      'Improves circulation',
      'Eases menstrual cramps',
    ],
    dosage: '1-3g fresh or dried root daily, or 250-500mg extract',
    contraindications: ['Gallstones (use caution)'],
    drug_interactions: ['Blood thinners (may increase bleeding risk)'],
    side_effects: ['Heartburn (rare)', 'Stomach upset with high doses'],
    evidence_level: 5,
    image_url: '/herbs/ginger.jpg',
  },
  {
    id: 'herb-5',
    name: 'Milk Thistle',
    botanical_name: 'Silybum marianum',
    overview: 'A flowering herb with potent liver-protective properties. The active compound silymarin supports liver regeneration and detoxification.',
    benefits: [
      'Protects and regenerates liver cells',
      'Supports liver detoxification',
      'May improve insulin resistance',
      'Antioxidant properties',
      'Supports bile production',
    ],
    dosage: '200-400mg standardized extract (70-80% silymarin) daily',
    contraindications: ['Hormone-sensitive conditions (use caution)'],
    drug_interactions: [
      'Medications metabolized by liver (may alter levels)',
      'Diabetes medications (may lower blood sugar)',
    ],
    side_effects: ['Mild laxative effect', 'Allergic reactions (rare)'],
    evidence_level: 4,
    image_url: '/herbs/milk-thistle.jpg',
  },
];

// Testimonials for Landing Page
export const MOCK_TESTIMONIALS = [
  {
    initials: 'S.M.',
    text: 'The protocol I received helped me finally address my gut issues. So much more thorough than anything I got from my doctor.',
    condition: 'Digestive Health',
  },
  {
    initials: 'J.L.',
    text: 'As someone skeptical of AI, I was impressed by how personalized and evidence-based the recommendations were.',
    condition: 'Chronic Fatigue',
  },
  {
    initials: 'K.R.',
    text: "The tracking feature helps me see what's actually working. Game changer for managing my anxiety naturally.",
    condition: 'Anxiety & Sleep',
    isPro: true,
  },
];

// FAQ for Landing Page
export const MOCK_FAQ = [
  {
    question: 'Is this a replacement for seeing a doctor?',
    answer: 'No. NatureScripts is an educational tool for exploring natural health approaches. Always consult with a licensed healthcare provider before making changes to your health regimen, especially if you have a medical condition or take medications.',
  },
  {
    question: 'How is the AI trained?',
    answer: 'Our AI is powered by Claude (Anthropic) and trained on peer-reviewed research, traditional herbal medicine texts, and clinical guidelines. All recommendations are evidence-based and include safety information.',
  },
  {
    question: 'Can I use this if I take medications?',
    answer: 'The protocols include drug interaction warnings, but you must consult your doctor or pharmacist before combining herbs with medications. Some interactions can be serious.',
  },
  {
    question: "What's the difference between Free and Pro?",
    answer: 'Free tier gives you 5 consultations per week and access to the herbal database. Pro ($12.99/month) includes unlimited consultations, progress tracking with charts, and personalized insights based on your history.',
  },
  {
    question: 'How accurate are the recommendations?',
    answer: 'Our AI provides evidence-based suggestions, but individual responses to herbs vary. We recommend working with a qualified herbalist or naturopath to personalize and monitor your protocol.',
  },
];

// Symptom Tracking Chart Data (Pro feature)
export const MOCK_SYMPTOM_DATA = [
  { date: '2025-01-16', fatigue: 8, bloating: 7, sleep: 4 },
  { date: '2025-01-17', fatigue: 7, bloating: 6, sleep: 5 },
  { date: '2025-01-18', fatigue: 7, bloating: 5, sleep: 6 },
  { date: '2025-01-19', fatigue: 6, bloating: 5, sleep: 6 },
  { date: '2025-01-20', fatigue: 5, bloating: 4, sleep: 7 },
  { date: '2025-01-21', fatigue: 5, bloating: 4, sleep: 7 },
  { date: '2025-01-22', fatigue: 4, bloating: 3, sleep: 8 },
];
