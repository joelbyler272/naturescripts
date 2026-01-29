import { Remedy } from './types';

export const REMEDIES: Remedy[] = [
  // ============================================
  // ASHWAGANDHA
  // ============================================
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
    overview: `Ashwagandha is one of the most important herbs in Ayurveda, the traditional medicine system of India. The name comes from Sanskrit and roughly translates to "smell of the horse," which refers both to its unique smell and the traditional belief that consuming it gives you the strength and vitality of a horse. The root contains active compounds called withanolides, which are responsible for most of its health benefits.

What makes ashwagandha special is its ability to work in multiple directions. Unlike stimulants that push your body in one direction, adaptogens help your body find balance. If you're wound up and anxious, ashwagandha can help calm you down. If you're depleted and fatigued, it can help restore your energy. This balancing effect is why so many people find it helpful for a wide range of concerns.`,
    howItWorks: `Ashwagandha works primarily through the HPA axis, which is your body's central stress response system. When you experience stress, your hypothalamus signals your pituitary gland, which then tells your adrenal glands to release cortisol. Over time, chronic stress can dysregulate this system. Ashwagandha helps normalize cortisol levels, particularly in people with elevated stress.

It also modulates GABA receptors in the brain, which promotes a calming effect without sedation. The withanolides have anti-inflammatory and antioxidant properties, and may support thyroid function by influencing thyroid hormone production.`,
    benefits: [
      { name: 'Stress and Anxiety Reduction', description: 'Multiple clinical trials show significant reductions in perceived stress and anxiety scores. Works by lowering cortisol and supporting GABA activity.', evidenceLevel: 5 },
      { name: 'Sleep Quality', description: 'Helps improve sleep onset and quality, particularly in people whose sleep is disrupted by stress or an overactive mind at night.', evidenceLevel: 4 },
      { name: 'Energy and Fatigue', description: 'Supports sustained energy without the jitters of stimulants. Particularly helpful for fatigue related to chronic stress or adrenal dysfunction.', evidenceLevel: 4 },
      { name: 'Cognitive Function', description: 'May improve memory, reaction time, and task performance. Research suggests benefits for both healthy adults and those with mild cognitive concerns.', evidenceLevel: 3 },
      { name: 'Physical Performance', description: 'Some studies show improvements in strength, cardiorespiratory endurance, and recovery in athletes and active individuals.', evidenceLevel: 3 },
      { name: 'Thyroid Support', description: 'May help normalize thyroid hormone levels, particularly in people with subclinical hypothyroidism. Use with caution and monitoring.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Standardized Root Extract', amount: '300-600mg daily', timing: 'Once or twice daily with food', notes: 'Look for extracts standardized to 5% or more withanolides. KSM-66 and Sensoril are well-researched branded extracts.' },
      { form: 'Root Powder', amount: '3-6 grams daily', timing: 'Divided into 2-3 doses with meals', notes: 'Traditional form, but requires higher doses than concentrated extracts.' },
      { form: 'Tincture', amount: '2-4ml daily', timing: '1-2ml twice daily in water', notes: 'Good option if you have trouble with capsules. Taste is earthy and somewhat bitter.' },
    ],
    bestTimeToTake: 'Ashwagandha can be taken morning or evening depending on your goals. For stress and energy support, morning works well. For sleep support, take it 1-2 hours before bed. Some people do well splitting the dose between morning and evening.',
    howLongToWork: 'Most people notice effects within 2-4 weeks of consistent use. Full benefits for stress and cortisol regulation typically develop over 6-8 weeks. Some effects like improved sleep may be noticed sooner.',
    sideEffects: ['Mild digestive upset, especially on an empty stomach', 'Drowsiness in some people, particularly at higher doses', 'Headache (uncommon)', 'Vivid dreams when taken before bed'],
    whoShouldAvoid: ['Pregnant or breastfeeding women (insufficient safety data)', 'People with hyperthyroidism or Graves disease (may increase thyroid hormones)', 'Those with autoimmune conditions (may stimulate immune activity)', 'Anyone scheduled for surgery (stop 2 weeks before due to potential sedative interactions)', 'People taking immunosuppressant medications'],
    interactions: [
      { substance: 'Thyroid medications (levothyroxine)', severity: 'moderate', description: 'May enhance thyroid hormone levels. If you take thyroid medication, have your levels monitored and adjust dosing with your doctor.' },
      { substance: 'Sedatives and sleep medications', severity: 'moderate', description: 'May increase drowsiness when combined with benzodiazepines, sleep aids, or other sedating substances.' },
      { substance: 'Immunosuppressants', severity: 'moderate', description: 'May counteract medications designed to suppress immune function.' },
      { substance: 'Blood pressure medications', severity: 'mild', description: 'May have mild blood pressure lowering effects. Monitor if you take BP medication.' },
      { substance: 'Blood sugar medications', severity: 'mild', description: 'May lower blood sugar. Monitor levels if you take diabetes medication.' },
    ],
    faqs: [
      { question: 'Does ashwagandha help with sleep?', answer: 'Yes, ashwagandha can help improve sleep quality, particularly if your sleep issues are related to stress or an overactive mind. It works differently than sedatives. Rather than knocking you out, it helps calm your nervous system so sleep comes more naturally. Taking it 1-2 hours before bed tends to work best for sleep support.' },
      { question: 'Can I take ashwagandha every day?', answer: 'Yes, ashwagandha is generally safe for daily use and works best when taken consistently. Most studies showing benefits used daily dosing for 8-12 weeks. Some practitioners recommend cycling off for 1-2 weeks every few months, though this is not strictly necessary for most people.' },
      { question: 'How long does ashwagandha take to work?', answer: 'Most people notice initial effects within 2-4 weeks. These might include better sleep, feeling more resilient to stress, or improved energy. The full benefits, particularly for cortisol regulation and anxiety reduction, typically develop over 6-8 weeks of consistent use.' },
      { question: 'Can I take ashwagandha with coffee?', answer: 'Yes, you can take ashwagandha with coffee. In fact, some people find it takes the edge off coffee jitters while maintaining alertness. Just be aware that taking it with food generally improves absorption and reduces any chance of stomach upset.' },
      { question: 'Is ashwagandha safe for long-term use?', answer: 'Based on current research and traditional use, ashwagandha appears safe for long-term use in healthy adults at recommended doses. Studies up to 12 weeks show good safety profiles. If you plan to use it longer, periodic check-ins with a healthcare provider are reasonable, especially if you have thyroid concerns.' },
      { question: 'What is the difference between KSM-66 and Sensoril?', answer: 'Both are well-researched, standardized ashwagandha extracts. KSM-66 is a full-spectrum root extract standardized to 5% withanolides and tends to be more energizing. Sensoril uses both root and leaf, is standardized to 10% withanolides, and tends to be more calming. Choose KSM-66 for daytime energy and stress support, Sensoril for anxiety and sleep.' },
    ],
    qualityMarkers: ['Look for standardization to withanolides (5% or higher)', 'KSM-66 and Sensoril are clinically studied branded extracts', 'Organic certification indicates cleaner growing practices', 'Third-party testing for heavy metals is important (ashwagandha can accumulate heavy metals from soil)', 'Root extract is traditional; root + leaf extracts like Sensoril are also effective'],
    products: [
      { name: 'KSM-66 Ashwagandha', brand: 'Nootropics Depot', form: 'Capsules', size: '120 capsules, 300mg', affiliateUrl: '#', note: 'Highly regarded for quality and purity testing' },
      { name: 'Sensoril Ashwagandha', brand: 'Jarrow Formulas', form: 'Capsules', size: '60 capsules, 225mg', affiliateUrl: '#', note: 'Good choice for calming effects and sleep' },
      { name: 'Organic Ashwagandha Root Powder', brand: 'Banyan Botanicals', form: 'Powder', size: '1 lb', affiliateUrl: '#', note: 'Traditional powder form, USDA organic' },
    ],
    relatedRemedies: ['rhodiola', 'holy-basil', 'eleuthero'],
    oftenPairedWith: ['magnesium-glycinate', 'l-theanine', 'rhodiola'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // RHODIOLA
  // ============================================
  {
    id: 'rhodiola',
    slug: 'rhodiola',
    name: 'Rhodiola',
    botanicalName: 'Rhodiola rosea',
    aliases: ['Golden Root', 'Arctic Root', 'Roseroot'],
    category: 'Adaptogen',
    tags: ['energy', 'focus', 'fatigue', 'stress', 'mental performance', 'endurance', 'mood'],
    rating: 8.1,
    summary: 'A stimulating adaptogen from the Arctic regions that enhances mental performance, fights fatigue, and builds resilience to stress without causing jitteriness.',
    overview: `Rhodiola grows in the cold, mountainous regions of Europe, Asia, and North America. It has been used for centuries in Russia and Scandinavian countries to combat fatigue, enhance work performance, and help people adapt to the harsh climate. Soviet scientists studied it extensively during the Cold War to improve the performance of athletes, soldiers, and cosmonauts.

Unlike caffeine or other stimulants, rhodiola provides energy by improving how your body uses energy at the cellular level, not by pushing your nervous system into overdrive. This means you get sustained mental clarity and physical endurance without the crash or jitters that come with stimulants.`,
    howItWorks: `Rhodiola influences several neurotransmitters including serotonin, dopamine, and norepinephrine. It appears to help these neurotransmitters stay active in the brain longer by inhibiting their breakdown. This may explain its effects on mood, focus, and mental energy.

It also affects the stress response by modulating cortisol and supporting healthy adrenal function. At the cellular level, rhodiola helps mitochondria produce ATP more efficiently, which is your body's primary energy currency. This explains why people often report better physical and mental stamina.`,
    benefits: [
      { name: 'Mental Performance and Focus', description: 'Multiple studies show improvements in attention, cognitive function, and mental work capacity, especially during periods of stress or fatigue.', evidenceLevel: 5 },
      { name: 'Physical Fatigue', description: 'Reduces perceived fatigue and improves endurance during both mental and physical tasks. Well-studied in athletes and shift workers.', evidenceLevel: 4 },
      { name: 'Stress Resilience', description: 'Helps the body adapt to and recover from stress more quickly. Particularly useful during high-demand periods.', evidenceLevel: 4 },
      { name: 'Mood Support', description: 'Some research suggests benefits for mild to moderate depression and general mood enhancement.', evidenceLevel: 3 },
      { name: 'Exercise Performance', description: 'May improve endurance, reduce perceived exertion, and support recovery in athletes.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Standardized Extract', amount: '200-600mg daily', timing: 'Morning on an empty stomach, or before demanding tasks', notes: 'Look for extracts standardized to 3% rosavins and 1% salidroside. This reflects the natural ratio in the root.' },
      { form: 'Root Powder', amount: '1-2 grams daily', timing: 'Morning or early afternoon', notes: 'Less concentrated than extracts but provides full spectrum of compounds.' },
    ],
    bestTimeToTake: 'Take rhodiola in the morning or early afternoon. Avoid taking it in the evening as its stimulating effects may interfere with sleep. Many people take it before mentally or physically demanding tasks for an extra boost.',
    howLongToWork: 'Acute effects on energy and focus can be noticed within a few hours of the first dose. For stress adaptation and mood benefits, consistent use for 2-4 weeks typically shows the best results.',
    sideEffects: ['Mild jitteriness or restlessness, especially at higher doses', 'Difficulty sleeping if taken too late in the day', 'Dry mouth', 'Dizziness (rare)'],
    whoShouldAvoid: ['People with bipolar disorder (may trigger mania in susceptible individuals)', 'Those sensitive to stimulants', 'Pregnant or breastfeeding women (insufficient safety data)', 'People with autoimmune conditions (may stimulate immune function)'],
    interactions: [
      { substance: 'Stimulants (caffeine, ADHD medications)', severity: 'mild', description: 'May have additive stimulating effects. Start with lower doses when combining.' },
      { substance: 'Antidepressants (SSRIs, MAOIs)', severity: 'moderate', description: 'May interact with medications affecting serotonin. Consult your doctor before combining.' },
      { substance: 'Blood pressure medications', severity: 'mild', description: 'May affect blood pressure. Monitor when starting rhodiola.' },
      { substance: 'Diabetes medications', severity: 'mild', description: 'May lower blood sugar. Monitor levels if you have diabetes.' },
    ],
    faqs: [
      { question: 'Is rhodiola a stimulant?', answer: 'Rhodiola is stimulating but works differently than caffeine or other traditional stimulants. It improves how your body produces and uses energy at the cellular level rather than activating your fight-or-flight response. Most people find it provides clean, sustained energy without jitters or a crash.' },
      { question: 'Can I take rhodiola with coffee?', answer: 'Yes, but start with lower doses of both to assess how you respond. Some people find the combination too stimulating, while others appreciate the enhanced focus and energy. If you feel jittery or anxious, reduce one or both.' },
      { question: 'Should I cycle rhodiola?', answer: 'Some experts recommend cycling rhodiola, such as taking it for 6-8 weeks then taking a 1-2 week break. This may help maintain its effectiveness over time. However, many people use it continuously without issues.' },
      { question: 'Can rhodiola help with depression?', answer: 'Some studies suggest rhodiola may help with mild to moderate depression, possibly by influencing neurotransmitters like serotonin and dopamine. However, it should not replace conventional treatment for clinical depression. Talk to your doctor before using it for mood support.' },
    ],
    qualityMarkers: ['Standardized to 3% rosavins and 1% salidroside (natural root ratio)', 'Siberian or Altai mountain origin often considered highest quality', 'Third-party testing for purity', 'Avoid products that only list salidroside (may indicate synthetic addition)'],
    products: [
      { name: 'Rhodiola Rosea Extract', brand: 'Nootropics Depot', form: 'Capsules', size: '90 capsules, 300mg', affiliateUrl: '#', note: 'Standardized 3% rosavins, 1% salidroside' },
      { name: 'Rhodiola Extract', brand: 'Gaia Herbs', form: 'Liquid Phyto-Caps', size: '60 capsules', affiliateUrl: '#', note: 'Liquid extract in capsule form for absorption' },
    ],
    relatedRemedies: ['ashwagandha', 'eleuthero', 'cordyceps'],
    oftenPairedWith: ['ashwagandha', 'l-theanine', 'lions-mane'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // HOLY BASIL (TULSI)
  // ============================================
  {
    id: 'holy-basil',
    slug: 'holy-basil',
    name: 'Holy Basil',
    botanicalName: 'Ocimum sanctum (Ocimum tenuiflorum)',
    aliases: ['Tulsi', 'Sacred Basil', 'The Queen of Herbs'],
    category: 'Adaptogen',
    tags: ['stress', 'anxiety', 'blood sugar', 'inflammation', 'respiratory', 'digestion', 'immunity'],
    rating: 7.6,
    summary: 'A sacred herb in Ayurvedic tradition known as "The Queen of Herbs" for its ability to promote calm, support respiratory health, and help the body adapt to stress.',
    overview: `Holy basil has been revered in India for over 5,000 years, where it is considered sacred and often grown in household courtyards. Unlike culinary basil, holy basil has a more complex flavor profile with hints of clove, mint, and pepper. It is used both as a daily health tonic and for specific health concerns.

Three main varieties are used medicinally: Rama (green leaves, mild), Krishna (purple leaves, more pungent), and Vana (wild, most potent). All three have similar properties but varying strengths. Holy basil is gentle enough for daily use and works gradually to build resilience over time.`,
    howItWorks: `Holy basil contains eugenol, rosmarinic acid, and other compounds that give it anti-inflammatory, antioxidant, and adaptogenic properties. It helps regulate cortisol levels and supports a healthy stress response without causing sedation.

It also has mild effects on blood sugar regulation by improving insulin sensitivity. The essential oils in holy basil have antimicrobial properties, which explains some of its traditional uses for respiratory and immune support.`,
    benefits: [
      { name: 'Stress and Anxiety Relief', description: 'Clinical studies show reductions in stress symptoms, anxiety, and associated problems like forgetfulness and sleep issues.', evidenceLevel: 4 },
      { name: 'Blood Sugar Support', description: 'May help maintain healthy blood sugar levels by improving insulin sensitivity. Most studied in people with type 2 diabetes.', evidenceLevel: 4 },
      { name: 'Respiratory Health', description: 'Traditional use for coughs, colds, and respiratory congestion. The essential oils have antimicrobial properties.', evidenceLevel: 3 },
      { name: 'Anti-inflammatory', description: 'Contains compounds that reduce inflammation markers. May help with general inflammatory conditions.', evidenceLevel: 3 },
      { name: 'Cognitive Function', description: 'Some evidence for improved memory and cognitive function, possibly related to stress reduction.', evidenceLevel: 2 },
    ],
    dosages: [
      { form: 'Dried Leaf Tea', amount: '1-2 teaspoons per cup', timing: '2-3 cups daily', notes: 'The most traditional form. Steep covered for 5-10 minutes to preserve volatile oils.' },
      { form: 'Capsules/Extract', amount: '300-600mg daily', timing: 'Divided into 2-3 doses with meals', notes: 'Look for whole leaf extracts rather than isolated compounds.' },
      { form: 'Tincture', amount: '2-3ml daily', timing: '1ml two to three times daily', notes: 'Good option for acute stress or respiratory support.' },
    ],
    bestTimeToTake: 'Holy basil can be taken any time of day. For stress support, many people enjoy it as a morning or afternoon tea ritual. For blood sugar support, taking it with meals may be most effective.',
    howLongToWork: 'Some calming effects may be noticed immediately when drinking the tea. For adaptogenic benefits like improved stress resilience, consistent use for 4-6 weeks typically produces noticeable results.',
    sideEffects: ['Generally very well tolerated', 'May cause mild nausea in some people', 'Could theoretically affect fertility (based on animal studies, not confirmed in humans)'],
    whoShouldAvoid: ['Those trying to conceive (may have anti-fertility effects based on animal research)', 'Pregnant or breastfeeding women', 'People scheduled for surgery (stop 2 weeks before due to potential blood-thinning effects)'],
    interactions: [
      { substance: 'Blood thinners (warfarin, aspirin)', severity: 'moderate', description: 'Holy basil may have mild blood-thinning effects. Monitor closely if taking anticoagulants.' },
      { substance: 'Diabetes medications', severity: 'moderate', description: 'May enhance blood sugar lowering effects. Monitor glucose levels and adjust medications with your doctor.' },
      { substance: 'Sedatives', severity: 'mild', description: 'May have additive calming effects when combined with sedating medications.' },
    ],
    faqs: [
      { question: 'Is holy basil the same as regular basil?', answer: 'No, holy basil (Ocimum sanctum) is a different species from culinary basil (Ocimum basilicum). While they are related, holy basil has a more complex, peppery flavor and different medicinal properties. You cannot substitute regular basil for holy basil in health applications.' },
      { question: 'Can I grow holy basil at home?', answer: 'Yes, holy basil grows well in warm climates or as an annual in cooler regions. It is actually quite easy to grow from seed or starts. Growing your own ensures freshness and allows you to use it for both tea and cooking.' },
      { question: 'How does holy basil compare to ashwagandha?', answer: 'Both are Ayurvedic adaptogens but have different strengths. Ashwagandha is more grounding and better for sleep and deep fatigue. Holy basil is lighter, better for daily stress, respiratory support, and blood sugar. Many people use both together.' },
      { question: 'Does holy basil have caffeine?', answer: 'No, holy basil is naturally caffeine-free. It makes an excellent alternative to caffeinated beverages for people looking to reduce caffeine intake while still enjoying a flavorful, health-promoting drink.' },
    ],
    qualityMarkers: ['Look for products using leaf (not stem)', 'Organic certification helpful due to leaf consumption', 'Krishna or Vana varieties may be more potent', 'Should have characteristic clove-like aroma'],
    products: [
      { name: 'Organic Tulsi Tea', brand: 'Organic India', form: 'Tea bags', size: '18 bags', affiliateUrl: '#', note: 'Multiple flavor blends available, all with tulsi base' },
      { name: 'Holy Basil Extract', brand: 'Gaia Herbs', form: 'Liquid Phyto-Caps', size: '60 capsules', affiliateUrl: '#', note: 'Concentrated liquid extract in capsule form' },
    ],
    relatedRemedies: ['ashwagandha', 'lemon-balm', 'gotu-kola'],
    oftenPairedWith: ['ashwagandha', 'ginger', 'turmeric'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // ELEUTHERO
  // ============================================
  {
    id: 'eleuthero',
    slug: 'eleuthero',
    name: 'Eleuthero',
    botanicalName: 'Eleutherococcus senticosus',
    aliases: ['Siberian Ginseng', "Ci Wu Jia", 'Eleuthero Root'],
    category: 'Adaptogen',
    tags: ['energy', 'endurance', 'stress', 'immunity', 'athletic performance', 'fatigue', 'focus'],
    rating: 7.4,
    summary: 'A hardy adaptogen from Siberia that supports sustained energy, immune function, and physical endurance. Gentler than true ginseng but excellent for long-term use.',
    overview: `Eleuthero grows in the forests of Siberia, northern China, Korea, and Japan. It was extensively researched by Soviet scientists starting in the 1960s as a way to improve worker productivity, athletic performance, and stress tolerance. Though often called "Siberian ginseng," it is not a true ginseng but shares some adaptogenic properties.

What distinguishes eleuthero from other adaptogens is its balanced, gentle action. It provides support without being overly stimulating or sedating, making it well-suited for long-term daily use. It has been used by everyone from factory workers to Olympic athletes to cosmonauts.`,
    howItWorks: `Eleuthero contains compounds called eleutherosides that support the hypothalamic-pituitary-adrenal (HPA) axis, helping the body maintain balance during stress. It appears to improve the efficiency of the stress response rather than blocking it entirely.

It also supports immune function by increasing the activity of natural killer cells and other immune components. At the cellular level, eleuthero helps cells produce and use energy more efficiently, which contributes to its anti-fatigue effects.`,
    benefits: [
      { name: 'Physical Endurance', description: 'Multiple studies show improved exercise performance, reduced fatigue, and faster recovery. Popular with athletes for training support.', evidenceLevel: 4 },
      { name: 'Immune Support', description: 'Research suggests enhanced immune cell activity and potential reduction in cold and flu frequency and duration.', evidenceLevel: 4 },
      { name: 'Stress Adaptation', description: 'Helps the body cope with physical, mental, and environmental stress more effectively over time.', evidenceLevel: 4 },
      { name: 'Mental Performance', description: 'Some studies show improved concentration, focus, and mental work capacity, especially during stressful periods.', evidenceLevel: 3 },
      { name: 'General Vitality', description: 'Traditional use for overall energy, well-being, and longevity. Often used as a daily tonic.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Standardized Extract', amount: '300-400mg daily', timing: 'Morning or divided between morning and noon', notes: 'Look for products standardized to eleutherosides (0.8% or higher).' },
      { form: 'Dried Root', amount: '2-3 grams daily', timing: 'As tea or decoction, morning or early afternoon', notes: 'Traditional preparation involves simmering the root for 15-20 minutes.' },
      { form: 'Tincture', amount: '2-4ml daily', timing: 'Divided into 2-3 doses', notes: 'Convenient form that absorbs quickly.' },
    ],
    bestTimeToTake: 'Take eleuthero in the morning or early afternoon. While less stimulating than rhodiola, taking it too late may still affect sleep in sensitive individuals. Many people use it consistently for months at a time.',
    howLongToWork: 'Some energy effects may be noticed within the first week. For immune support and full adaptogenic benefits, consistent use for 6-8 weeks is typically recommended. Traditional use often involves 2-3 months of daily use.',
    sideEffects: ['Generally very well tolerated', 'Mild insomnia if taken too late', 'Occasional headache or nervousness', 'Rare: elevated blood pressure in sensitive individuals'],
    whoShouldAvoid: ['People with high blood pressure (may raise BP slightly)', 'Those with hormone-sensitive conditions', 'Pregnant or breastfeeding women', 'Children under 12 (insufficient safety data)'],
    interactions: [
      { substance: 'Blood thinners', severity: 'mild', description: 'May have mild anticoagulant effects. Use caution with blood-thinning medications.' },
      { substance: 'Diabetes medications', severity: 'mild', description: 'May affect blood sugar levels. Monitor if you have diabetes.' },
      { substance: 'Sedatives', severity: 'mild', description: 'May counteract sedative medications due to its mild stimulating effects.' },
      { substance: 'Digoxin', severity: 'moderate', description: 'May interfere with digoxin blood tests and potentially its effects. Avoid combining.' },
    ],
    faqs: [
      { question: 'Is eleuthero the same as ginseng?', answer: 'No, eleuthero is a different plant from true ginseng (Panax ginseng or Panax quinquefolius). It was called "Siberian ginseng" for marketing purposes but this term is now restricted in many countries because it causes confusion. Eleuthero is generally milder and better suited for long-term use.' },
      { question: 'Can I take eleuthero every day?', answer: 'Yes, eleuthero is considered safe for long-term daily use. In fact, its benefits tend to build over time with consistent use. Some practitioners recommend taking periodic breaks (such as one week off per month) but this is not strictly necessary.' },
      { question: 'Is eleuthero good for athletes?', answer: 'Yes, eleuthero has been popular with athletes since Soviet research showed improvements in endurance and recovery. It may help with both training adaptation and performance. It is not a banned substance in most sports.' },
      { question: 'How does eleuthero compare to rhodiola?', answer: 'Both are excellent adaptogens but have different characters. Rhodiola is more acutely stimulating and better for mental focus and fighting fatigue in the moment. Eleuthero is gentler, better for long-term use, and stronger for immune support and physical endurance.' },
    ],
    qualityMarkers: ['Standardized to eleutherosides (0.8% or higher)', 'Root extract (not leaf or stem)', 'Third-party tested for purity', 'Avoid products labeled "Siberian ginseng" as terminology regulations vary'],
    products: [
      { name: 'Eleuthero Root Extract', brand: "Nature's Way", form: 'Capsules', size: '100 capsules, 425mg', affiliateUrl: '#', note: 'Standardized extract at affordable price' },
      { name: 'Eleuthero', brand: 'Herb Pharm', form: 'Tincture', size: '1 fl oz', affiliateUrl: '#', note: 'Liquid extract for fast absorption' },
    ],
    relatedRemedies: ['ashwagandha', 'rhodiola', 'ginseng'],
    oftenPairedWith: ['rhodiola', 'reishi', 'cordyceps'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // MAGNESIUM GLYCINATE
  // ============================================
  {
    id: 'magnesium-glycinate',
    slug: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    botanicalName: 'Magnesium bound to glycine',
    aliases: ['Magnesium Bisglycinate', 'Chelated Magnesium'],
    category: 'Mineral',
    tags: ['sleep', 'relaxation', 'muscle cramps', 'stress', 'anxiety', 'heart health', 'bone health'],
    rating: 8.7,
    summary: 'One of the most absorbable and gentle forms of magnesium, particularly effective for sleep, relaxation, and muscle function without causing digestive upset.',
    overview: `Magnesium is involved in over 300 enzymatic reactions in your body, from energy production to muscle function to nervous system regulation. Despite its importance, an estimated 50% of Americans do not get enough magnesium from their diet. Modern farming practices have depleted soil magnesium, and processed foods are often low in this essential mineral.

Magnesium glycinate is magnesium bound to the amino acid glycine. This form is highly absorbable and particularly gentle on the digestive system. The glycine itself has calming properties, making this form especially popular for sleep and relaxation support.`,
    howItWorks: `Magnesium supports the GABA system in the brain, which is your body's primary "calming" neurotransmitter system. It helps regulate the stress response by modulating the HPA axis. At the muscular level, magnesium is essential for proper muscle relaxation after contraction.

The glycine component adds additional calming effects, as glycine itself is an inhibitory neurotransmitter. This combination makes magnesium glycinate particularly effective for promoting relaxation and sleep compared to other forms of magnesium.`,
    benefits: [
      { name: 'Sleep Quality', description: 'Helps with falling asleep and staying asleep by supporting GABA activity and muscle relaxation. Well-studied for insomnia.', evidenceLevel: 5 },
      { name: 'Muscle Relaxation', description: 'Relieves muscle tension, cramps, and spasms. Essential for proper muscle function after exercise.', evidenceLevel: 5 },
      { name: 'Stress and Anxiety', description: 'Supports a calm nervous system and may help reduce symptoms of anxiety. Works synergistically with adaptogens.', evidenceLevel: 4 },
      { name: 'Heart Health', description: 'Helps maintain normal heart rhythm and supports healthy blood pressure levels.', evidenceLevel: 4 },
      { name: 'Bone Health', description: 'Essential for calcium metabolism and bone mineralization. Works with vitamin D and calcium.', evidenceLevel: 4 },
      { name: 'Headache Prevention', description: 'Some evidence for reducing frequency of migraines and tension headaches.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Capsules or Tablets', amount: '200-400mg elemental magnesium', timing: 'Evening, 1-2 hours before bed', notes: 'Check the label for elemental magnesium content, not total magnesium glycinate weight.' },
      { form: 'Powder', amount: '200-400mg elemental magnesium', timing: 'Mixed in water, evening preferred', notes: 'Good option for those who have trouble swallowing pills. Often has a mild, slightly sweet taste.' },
    ],
    bestTimeToTake: 'For sleep support, take magnesium glycinate 1-2 hours before bed. For general health, it can be taken any time with food. Splitting into two doses (morning and evening) may help with absorption of larger amounts.',
    howLongToWork: 'Relaxation and sleep benefits are often noticed within the first few days to a week. For addressing a deficiency, it may take 4-6 weeks to fully restore magnesium levels. Muscle cramp relief is often noticed quickly.',
    sideEffects: ['Very well tolerated compared to other magnesium forms', 'Loose stools at high doses (less common than with other forms)', 'Drowsiness, especially when taken in the evening'],
    whoShouldAvoid: ['People with severe kidney disease (kidneys regulate magnesium excretion)', 'Those taking certain antibiotics (take several hours apart)', 'People with myasthenia gravis'],
    interactions: [
      { substance: 'Antibiotics (fluoroquinolones, tetracyclines)', severity: 'moderate', description: 'Magnesium can bind to these antibiotics and reduce their absorption. Take at least 2 hours apart.' },
      { substance: 'Bisphosphonates (osteoporosis drugs)', severity: 'moderate', description: 'Magnesium may interfere with absorption. Take at different times of day.' },
      { substance: 'Blood pressure medications', severity: 'mild', description: 'May enhance blood pressure lowering effects. Monitor blood pressure.' },
      { substance: 'Muscle relaxants', severity: 'mild', description: 'May have additive relaxing effects.' },
    ],
    faqs: [
      { question: 'Why magnesium glycinate over other forms?', answer: 'Magnesium glycinate is one of the most absorbable forms and rarely causes digestive upset. The glycine component adds calming benefits. Other forms like citrate are fine but may cause loose stools. Oxide is cheap but poorly absorbed.' },
      { question: 'How do I know if I need magnesium?', answer: 'Common signs of low magnesium include muscle cramps, poor sleep, anxiety, fatigue, and headaches. Since deficiency is so common and symptoms are nonspecific, many people benefit from supplementation. Blood tests only show severe deficiency.' },
      { question: 'Can I take too much magnesium?', answer: 'It is difficult to overdose on oral magnesium as excess is excreted by the kidneys. However, very high doses can cause digestive issues and, in people with kidney problems, more serious effects. Stick to recommended doses unless directed otherwise by a healthcare provider.' },
      { question: 'Can I take magnesium with ashwagandha?', answer: 'Yes, this is actually a popular combination. Both support relaxation and sleep through different mechanisms, so they work synergistically. Many people take ashwagandha during the day and magnesium in the evening, or both together before bed.' },
    ],
    qualityMarkers: ['Look for "elemental magnesium" content on the label', 'Chelated or bisglycinate forms indicate quality bonding', 'Third-party testing for purity', 'Avoid products with unnecessary fillers or additives'],
    products: [
      { name: 'Magnesium Glycinate', brand: 'Pure Encapsulations', form: 'Capsules', size: '180 capsules, 120mg elemental', affiliateUrl: '#', note: 'High quality, hypoallergenic formulation' },
      { name: 'Magnesium Bisglycinate', brand: "Doctor's Best", form: 'Tablets', size: '240 tablets, 100mg elemental', affiliateUrl: '#', note: 'Good value, TRAACS chelated form' },
      { name: 'Natural Calm', brand: 'Natural Vitality', form: 'Powder', size: '16 oz', affiliateUrl: '#', note: 'Popular powder form (note: this is citrate, not glycinate)' },
    ],
    relatedRemedies: ['l-theanine', 'valerian', 'passionflower'],
    oftenPairedWith: ['ashwagandha', 'l-theanine', 'vitamin-d'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // L-THEANINE
  // ============================================
  {
    id: 'l-theanine',
    slug: 'l-theanine',
    name: 'L-Theanine',
    botanicalName: 'Derived from Camellia sinensis',
    aliases: ['Theanine', 'Suntheanine', 'L-gamma-glutamylethylamide'],
    category: 'Amino Acid',
    tags: ['focus', 'calm', 'anxiety', 'sleep', 'stress', 'cognitive', 'relaxation'],
    rating: 8.5,
    summary: 'An amino acid found in tea that promotes calm focus without drowsiness. Excellent alone or combined with caffeine for alert, jitter-free concentration.',
    overview: `L-theanine is an amino acid found almost exclusively in tea leaves, particularly green tea. It is responsible for the unique "calm alertness" that tea provides compared to the jittery energy from coffee. Japanese researchers first isolated it in 1949 and have studied it extensively since.

What makes L-theanine unique is that it promotes relaxation without causing drowsiness. You stay alert and focused but without the tension or anxiety that often accompanies stimulant use. This makes it ideal for work, study, or any situation requiring calm concentration.`,
    howItWorks: `L-theanine crosses the blood-brain barrier and increases alpha brain wave activity, which is associated with a state of relaxed alertness similar to meditation. It also modulates neurotransmitters including GABA, serotonin, and dopamine, promoting calm without sedation.

When combined with caffeine, L-theanine smooths out caffeine's stimulating effects, reducing jitters and anxiety while preserving the alertness and focus benefits. This combination has been well-studied and explains why tea feels different from coffee despite both containing caffeine.`,
    benefits: [
      { name: 'Calm Focus', description: 'Promotes alpha brain waves associated with relaxed concentration. Ideal for work or study requiring sustained attention.', evidenceLevel: 5 },
      { name: 'Anxiety Reduction', description: 'Reduces symptoms of anxiety and stress without causing drowsiness. Works quickly, often within 30-60 minutes.', evidenceLevel: 4 },
      { name: 'Enhanced Cognition with Caffeine', description: 'Combined with caffeine, improves focus, attention, and task performance better than either alone.', evidenceLevel: 5 },
      { name: 'Sleep Quality', description: 'At higher doses, can help with relaxation before sleep. Does not cause sedation but promotes calm.', evidenceLevel: 3 },
      { name: 'Blood Pressure', description: 'May help reduce blood pressure increases associated with stress.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Capsules', amount: '100-400mg daily', timing: 'Any time; for sleep, take 1 hour before bed', notes: 'Start with 100-200mg to assess your response. Higher doses (400mg) are more relaxing.' },
      { form: 'Powder', amount: '100-400mg daily', timing: 'Can be added to beverages', notes: 'Has a mild, slightly savory taste. Often added to coffee to reduce jitters.' },
      { form: 'With Caffeine', amount: '100-200mg L-theanine + 50-100mg caffeine', timing: 'Morning or when focus is needed', notes: 'A 2:1 ratio of L-theanine to caffeine is commonly used.' },
    ],
    bestTimeToTake: 'L-theanine can be taken any time of day. For focus, take it in the morning or before demanding tasks. For sleep support, take a higher dose (200-400mg) about an hour before bed. It does not cause dependence and can be used as needed.',
    howLongToWork: 'Effects are typically felt within 30-60 minutes and last for several hours. There is no buildup period needed. Benefits are noticed from the first dose.',
    sideEffects: ['Very few side effects reported', 'Mild headache (rare)', 'Possible digestive upset (rare)', 'May lower blood pressure slightly'],
    whoShouldAvoid: ['Those on blood pressure medications (may enhance effects)', 'Pregnant or breastfeeding women (insufficient data, though tea consumption is generally considered safe)'],
    interactions: [
      { substance: 'Blood pressure medications', severity: 'mild', description: 'L-theanine may lower blood pressure. Monitor if you take antihypertensives.' },
      { substance: 'Stimulants', severity: 'mild', description: 'May moderate the effects of stimulants. This is often desirable but adjust doses accordingly.' },
    ],
    faqs: [
      { question: 'Can I just drink green tea instead?', answer: 'Green tea contains L-theanine but in smaller amounts (about 20-40mg per cup). To get therapeutic doses (100-400mg), you would need to drink many cups. Supplements provide more consistent, higher doses when needed.' },
      { question: 'Does L-theanine make you sleepy?', answer: 'At typical doses (100-200mg), L-theanine promotes relaxation without drowsiness. At higher doses (300-400mg), some people do feel sleepy, which is why it can be used for sleep support. It does not force sleep but makes it easier to relax.' },
      { question: 'Is L-theanine addictive?', answer: 'No, L-theanine is not addictive and does not cause dependence or withdrawal. You can use it daily or as needed without building tolerance. Many people use it situationally for stressful events or demanding work.' },
      { question: 'Can I take L-theanine with coffee?', answer: 'Yes, this is one of the most popular uses. Adding L-theanine to coffee (or taking them together as supplements) provides the alertness of caffeine without the jitters or anxiety. A typical ratio is 100-200mg L-theanine with your normal coffee.' },
    ],
    qualityMarkers: ['Suntheanine is a patented, well-researched form', 'Should be pure L-theanine (not D-theanine or mixed)', 'Third-party tested for purity', 'No unnecessary additives'],
    products: [
      { name: 'Suntheanine L-Theanine', brand: 'Sports Research', form: 'Softgels', size: '60 softgels, 200mg', affiliateUrl: '#', note: 'Patented Suntheanine form in coconut oil for absorption' },
      { name: 'L-Theanine', brand: 'NOW Foods', form: 'Capsules', size: '90 capsules, 200mg', affiliateUrl: '#', note: 'Good value, straightforward formulation' },
    ],
    relatedRemedies: ['magnesium-glycinate', 'ashwagandha', 'gaba'],
    oftenPairedWith: ['caffeine', 'ashwagandha', 'magnesium-glycinate'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // VALERIAN
  // ============================================
  {
    id: 'valerian',
    slug: 'valerian',
    name: 'Valerian',
    botanicalName: 'Valeriana officinalis',
    aliases: ['Valerian Root', 'Garden Valerian', 'All-Heal'],
    category: 'Nervine',
    tags: ['sleep', 'insomnia', 'anxiety', 'relaxation', 'nervous system', 'stress'],
    rating: 7.2,
    summary: 'A traditional European herb known for its sedative properties, commonly used for insomnia and nervous tension. Has a distinctive strong odor.',
    overview: `Valerian has been used as a medicinal herb since ancient Greek and Roman times. Hippocrates described its properties, and Galen prescribed it for insomnia. It became particularly popular in Europe during World War II when it was used to relieve stress caused by air raids.

The root has a very distinctive, pungent odor that many find unpleasant (often compared to dirty socks). This is caused by volatile oils that contribute to its sedative effects. Despite the smell, valerian remains one of the most popular natural sleep aids in Europe and increasingly in the United States.`,
    howItWorks: `Valerian contains compounds that interact with the GABA system in the brain, similar to how benzodiazepine medications work but much more gently. It appears to increase GABA levels and may also bind to GABA receptors, promoting relaxation and sleep.

The valerenic acid in valerian inhibits the breakdown of GABA in the brain, allowing this calming neurotransmitter to remain active longer. Other compounds in valerian may contribute to its sedative effects through additional mechanisms that are not fully understood.`,
    benefits: [
      { name: 'Sleep Improvement', description: 'May help reduce time to fall asleep and improve sleep quality. Most studied natural sleep aid.', evidenceLevel: 4 },
      { name: 'Anxiety Relief', description: 'Can help reduce nervous tension and anxiety, though less well-studied than its sleep effects.', evidenceLevel: 3 },
      { name: 'Relaxation', description: 'Promotes overall relaxation and calm. Often used for situational stress.', evidenceLevel: 3 },
      { name: 'Menstrual Support', description: 'Traditional use for menstrual cramps and related discomfort. Limited research.', evidenceLevel: 2 },
    ],
    dosages: [
      { form: 'Root Extract (capsules)', amount: '300-600mg', timing: '30 minutes to 2 hours before bed', notes: 'Look for extracts standardized to 0.8% valerenic acid.' },
      { form: 'Tincture', amount: '2-4ml', timing: '30-60 minutes before bed', notes: 'Strong taste. Can be mixed with juice or water.' },
      { form: 'Tea', amount: '1-2 teaspoons dried root', timing: '30-60 minutes before bed', notes: 'Steep covered for 10-15 minutes. Taste is strong and earthy.' },
    ],
    bestTimeToTake: 'Take valerian 30 minutes to 2 hours before bed for sleep. For daytime anxiety, lower doses may be used, but be aware it can cause drowsiness. Do not drive or operate machinery after taking valerian.',
    howLongToWork: 'Some people notice effects the first night, but valerian often works better with consistent use over 2-4 weeks. It may take time for the full benefits to develop.',
    sideEffects: ['Morning grogginess in some people', 'Headache', 'Digestive upset', 'Vivid dreams', 'Paradoxical stimulation in rare cases'],
    whoShouldAvoid: ['Pregnant or breastfeeding women', 'Children under 3', 'Those taking sedatives or sleep medications', 'People with liver disease', 'Anyone needing to drive or operate machinery'],
    interactions: [
      { substance: 'Sedatives and sleep medications', severity: 'moderate', description: 'May increase sedative effects. Do not combine without medical supervision.' },
      { substance: 'Alcohol', severity: 'moderate', description: 'May increase drowsiness and sedation. Avoid combining.' },
      { substance: 'Anesthesia', severity: 'moderate', description: 'May interact with anesthetic drugs. Stop 2 weeks before surgery.' },
      { substance: 'Anti-anxiety medications', severity: 'moderate', description: 'May have additive effects. Consult your doctor before combining.' },
    ],
    faqs: [
      { question: 'Why does valerian smell so bad?', answer: 'The strong odor comes from volatile compounds like isovaleric acid, which are actually part of what makes valerian work. The smell develops and intensifies as the root dries. Despite the odor, these compounds are important for its sedative effects.' },
      { question: 'Is valerian habit-forming?', answer: 'Valerian is not considered habit-forming and does not cause dependence like prescription sleep medications. You can stop taking it without withdrawal effects. However, like any sleep aid, it is best used to restore natural sleep patterns rather than indefinitely.' },
      { question: 'Can I take valerian every night?', answer: 'Valerian is generally considered safe for use up to 4-6 weeks. For chronic sleep issues, it is better to use valerian while also addressing underlying causes of poor sleep. Periodic breaks may help maintain effectiveness.' },
      { question: 'How does valerian compare to melatonin?', answer: 'They work differently. Melatonin signals to your body that it is time to sleep and is best for circadian rhythm issues like jet lag. Valerian promotes relaxation and is better for people who cannot fall asleep due to anxiety or racing thoughts. Some people use both together.' },
    ],
    qualityMarkers: ['Standardized to 0.8% valerenic acid', 'Root extract (not stems or leaves)', 'Fresh smell indicates poor quality (should smell strongly)', 'European-sourced often considered high quality'],
    products: [
      { name: 'Valerian Root Extract', brand: 'NOW Foods', form: 'Capsules', size: '90 capsules, 500mg', affiliateUrl: '#', note: 'Standardized extract at good value' },
      { name: 'Valerian', brand: 'Herb Pharm', form: 'Tincture', size: '1 fl oz', affiliateUrl: '#', note: 'Liquid extract from fresh root' },
    ],
    relatedRemedies: ['passionflower', 'hops', 'lemon-balm'],
    oftenPairedWith: ['hops', 'passionflower', 'magnesium-glycinate'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // PASSIONFLOWER
  // ============================================
  {
    id: 'passionflower',
    slug: 'passionflower',
    name: 'Passionflower',
    botanicalName: 'Passiflora incarnata',
    aliases: ['Maypop', 'Purple Passionflower', 'Wild Passion Vine'],
    category: 'Nervine',
    tags: ['anxiety', 'sleep', 'relaxation', 'stress', 'nervous system', 'calm'],
    rating: 7.0,
    summary: 'A gentle nervine herb native to North America that quiets an overactive mind, eases anxiety, and promotes restful sleep without morning grogginess.',
    overview: `Passionflower is native to the southeastern United States and was used by Native Americans for its calming properties long before European contact. Spanish explorers named it after the Passion of Christ, seeing religious symbolism in its intricate flower structure.

Unlike stronger sedatives, passionflower works gently to calm nervous tension without causing heavy sedation. It is particularly helpful for the type of anxiety that manifests as racing thoughts, making it useful for both daytime anxiety and sleep disturbances caused by an overactive mind.`,
    howItWorks: `Passionflower increases levels of GABA in the brain by inhibiting its breakdown. This is similar to how benzodiazepines work, but passionflower's effect is much gentler and does not carry the same risks of dependence.

The flavonoids in passionflower, particularly chrysin, appear to bind to benzodiazepine receptors in the brain, contributing to its calming effects. Unlike synthetic sedatives, passionflower contains multiple compounds that work together, which may explain its gentler action.`,
    benefits: [
      { name: 'Anxiety Relief', description: 'Clinical studies show effectiveness comparable to some anti-anxiety medications for generalized anxiety. Works without sedation at moderate doses.', evidenceLevel: 4 },
      { name: 'Sleep Support', description: 'Helps quiet racing thoughts that prevent sleep. Particularly useful for sleep onset insomnia.', evidenceLevel: 4 },
      { name: 'Nervous Tension', description: 'Calms nervous system overactivity, helpful for stress-related tension and restlessness.', evidenceLevel: 3 },
      { name: 'Pre-procedure Anxiety', description: 'Studies show effectiveness for reducing anxiety before medical or dental procedures.', evidenceLevel: 4 },
    ],
    dosages: [
      { form: 'Tea', amount: '1-2 teaspoons dried herb', timing: '2-3 cups daily, or 1 cup before bed', notes: 'Steep covered for 10-15 minutes. Has a mild, slightly grassy taste.' },
      { form: 'Tincture', amount: '1-2ml', timing: 'Up to 3 times daily or before bed', notes: 'Fast-acting. Good for acute anxiety situations.' },
      { form: 'Capsules', amount: '400-500mg', timing: '1-2 capsules daily or before bed', notes: 'Convenient form for consistent dosing.' },
    ],
    bestTimeToTake: 'For anxiety, take throughout the day as needed. For sleep, take 30-60 minutes before bed. Passionflower does not usually cause daytime drowsiness at normal doses, making it suitable for daytime use.',
    howLongToWork: 'Effects are usually noticed within 30-60 minutes. Unlike some herbs that require buildup, passionflower works relatively quickly. Consistent use may provide better results for chronic anxiety.',
    sideEffects: ['Generally very well tolerated', 'Mild drowsiness at higher doses', 'Rare: dizziness, confusion', 'Very rare: rapid heartbeat (paradoxical reaction)'],
    whoShouldAvoid: ['Pregnant women (may stimulate uterus)', 'Breastfeeding women (insufficient safety data)', 'Those scheduled for surgery (stop 2 weeks before)', 'People taking sedatives or MAOIs'],
    interactions: [
      { substance: 'Sedatives and sleep medications', severity: 'moderate', description: 'May enhance sedative effects. Use caution when combining.' },
      { substance: 'MAO inhibitors', severity: 'moderate', description: 'Passionflower may have mild MAOI activity. Avoid combining with MAOI medications.' },
      { substance: 'Blood thinners', severity: 'mild', description: 'May have mild blood-thinning effects. Monitor if taking anticoagulants.' },
    ],
    faqs: [
      { question: 'Is passionflower the same as passion fruit?', answer: 'They are related but different species. Passiflora incarnata is used medicinally for its leaves and flowers. Passiflora edulis produces the edible passion fruit. The medicinal species does produce small, edible fruits, but these are not commonly used.' },
      { question: 'Can passionflower be used during the day?', answer: 'Yes, at moderate doses passionflower provides calm without significant drowsiness. Many people use it throughout the day for anxiety. Higher doses are more sedating and better reserved for evening use.' },
      { question: 'Is passionflower safe for children?', answer: 'Passionflower is sometimes used for children with anxiety or sleep issues, but dosing should be adjusted by weight and supervised by a healthcare provider. It is generally considered gentle, but safety data in children is limited.' },
      { question: 'How does passionflower compare to valerian?', answer: 'Passionflower is generally milder and better for anxiety-related sleep issues. Valerian is more sedating and better for general insomnia. Passionflower rarely causes morning grogginess, while valerian sometimes does. Many people combine them for enhanced effect.' },
    ],
    qualityMarkers: ['Look for aerial parts (leaves and flowers)', 'Passiflora incarnata species specifically', 'Organic preferred as it is typically leaf material', 'Third-party tested for purity'],
    products: [
      { name: 'Passionflower Extract', brand: 'Gaia Herbs', form: 'Capsules', size: '60 capsules', affiliateUrl: '#', note: 'Liquid phyto-cap for absorption' },
      { name: 'Passionflower', brand: 'Traditional Medicinals', form: 'Tea', size: '16 bags', affiliateUrl: '#', note: 'Organic tea blend' },
    ],
    relatedRemedies: ['valerian', 'lemon-balm', 'chamomile'],
    oftenPairedWith: ['valerian', 'magnesium-glycinate', 'l-theanine'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // TURMERIC
  // ============================================
  {
    id: 'turmeric',
    slug: 'turmeric',
    name: 'Turmeric',
    botanicalName: 'Curcuma longa',
    aliases: ['Curcumin', 'Indian Saffron', 'Golden Spice'],
    category: 'Anti-inflammatory',
    tags: ['inflammation', 'joint pain', 'digestion', 'antioxidant', 'brain health', 'liver'],
    rating: 8.6,
    summary: 'A golden spice with powerful anti-inflammatory and antioxidant properties. The active compound curcumin has been extensively studied for joint, brain, and overall health.',
    overview: `Turmeric has been used in India for thousands of years as both a spice and medicine. It gives curry its characteristic yellow color and has been central to Ayurvedic medicine for treating inflammation, digestive issues, and wounds. Modern research has validated many traditional uses and uncovered new applications.

The main active compound is curcumin, which makes up about 3% of turmeric by weight. Curcumin is responsible for most of turmeric's health benefits but is poorly absorbed on its own. This is why supplements often include black pepper extract (piperine) or other absorption enhancers.`,
    howItWorks: `Curcumin works on multiple pathways in the body. It inhibits NF-kB, a molecule that travels into the nuclei of cells and turns on genes related to inflammation. It also neutralizes free radicals directly and stimulates the body's own antioxidant enzymes.

For joint health, curcumin reduces inflammatory markers like COX-2, similar to how NSAIDs work but through different mechanisms. In the brain, it may cross the blood-brain barrier and has been studied for its potential neuroprotective effects.`,
    benefits: [
      { name: 'Joint Pain and Inflammation', description: 'Multiple studies show effectiveness comparable to some anti-inflammatory drugs for osteoarthritis and rheumatoid arthritis.', evidenceLevel: 5 },
      { name: 'Antioxidant Protection', description: 'Potent antioxidant that neutralizes free radicals and boosts the body own antioxidant capacity.', evidenceLevel: 5 },
      { name: 'Digestive Health', description: 'Supports healthy digestion, may help with IBS symptoms, and stimulates bile production.', evidenceLevel: 4 },
      { name: 'Brain Health', description: 'May support cognitive function and has been studied for potential neuroprotective effects. Crosses the blood-brain barrier.', evidenceLevel: 3 },
      { name: 'Heart Health', description: 'May improve endothelial function and has anti-inflammatory effects relevant to cardiovascular health.', evidenceLevel: 3 },
      { name: 'Mood Support', description: 'Some studies suggest benefits for depression, possibly through anti-inflammatory effects on the brain.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Curcumin Extract', amount: '500-2000mg daily', timing: 'With meals containing fat', notes: 'Look for extracts with piperine (black pepper) or other absorption enhancers like phospholipids.' },
      { form: 'Turmeric Powder', amount: '1-3 grams daily', timing: 'With food, especially with black pepper and fat', notes: 'Culinary use provides lower doses but consistent exposure. Add black pepper to enhance absorption.' },
      { form: 'Golden Milk/Paste', amount: 'Variable', timing: 'Daily as a beverage', notes: 'Traditional preparation with milk, black pepper, and fat. Delicious way to consume turmeric regularly.' },
    ],
    bestTimeToTake: 'Take turmeric or curcumin with meals containing fat for better absorption. Splitting doses throughout the day may provide more consistent blood levels. Some people prefer taking it with their largest meal.',
    howLongToWork: 'Anti-inflammatory effects may be noticed within 4-8 weeks of consistent use. For joint pain, studies typically show significant improvement at 8-12 weeks. Acute digestive benefits may be noticed sooner.',
    sideEffects: ['Generally well tolerated', 'May cause digestive upset at high doses', 'Can stain teeth and skin yellow', 'Rare: allergic reactions'],
    whoShouldAvoid: ['Those with gallbladder problems or gallstones (stimulates bile)', 'People with bleeding disorders', 'Those scheduled for surgery (stop 2 weeks before)', 'Pregnant women in medicinal doses (culinary use is fine)'],
    interactions: [
      { substance: 'Blood thinners (warfarin, aspirin)', severity: 'moderate', description: 'Turmeric may enhance blood-thinning effects. Monitor INR if taking warfarin.' },
      { substance: 'Diabetes medications', severity: 'mild', description: 'May lower blood sugar. Monitor levels if taking diabetes medication.' },
      { substance: 'Stomach acid reducers', severity: 'mild', description: 'Turmeric increases stomach acid. May counteract these medications.' },
      { substance: 'Chemotherapy drugs', severity: 'moderate', description: 'May interact with certain chemotherapy agents. Consult oncologist before use.' },
    ],
    faqs: [
      { question: 'Why do I need black pepper with turmeric?', answer: 'Curcumin is poorly absorbed on its own. Piperine from black pepper inhibits the enzymes that break down curcumin in the gut and liver, increasing absorption by up to 2000%. Always look for turmeric products with piperine or take with black pepper.' },
      { question: 'Is turmeric from food enough?', answer: 'Culinary amounts provide benefits over time but deliver much lower doses than supplements. For therapeutic effects like joint pain relief, supplements are usually necessary. However, cooking with turmeric regularly is still beneficial for overall health.' },
      { question: 'What is the best form of turmeric supplement?', answer: 'Look for curcumin extracts with enhanced absorption. Options include: curcumin with piperine, phytosome forms (bound to phospholipids), or newer formulations like Longvida or Theracurmin. Standard curcumin without enhancers is poorly absorbed.' },
      { question: 'Can turmeric stain my teeth?', answer: 'Yes, turmeric can temporarily stain teeth yellow if used frequently. Brush your teeth after consuming turmeric, or use a straw for liquid preparations. The staining is temporary and can be removed with regular brushing.' },
    ],
    qualityMarkers: ['Standardized to 95% curcuminoids', 'Contains piperine or other absorption enhancer', 'Third-party tested for heavy metals', 'Look for patented forms: BCM-95, Meriva, Longvida, Theracurmin'],
    products: [
      { name: 'Theracurmin HP', brand: 'Integrative Therapeutics', form: 'Capsules', size: '60 capsules', affiliateUrl: '#', note: 'Highly bioavailable form, well-researched' },
      { name: 'Curcumin Phytosome', brand: 'Thorne', form: 'Capsules', size: '60 capsules', affiliateUrl: '#', note: 'Meriva phytosome form for absorption' },
      { name: 'Organic Turmeric Powder', brand: 'Simply Organic', form: 'Powder', size: '2.38 oz', affiliateUrl: '#', note: 'For culinary use and golden milk' },
    ],
    relatedRemedies: ['ginger', 'boswellia', 'fish-oil'],
    oftenPairedWith: ['ginger', 'black-pepper', 'boswellia'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // GINGER
  // ============================================
  {
    id: 'ginger',
    slug: 'ginger',
    name: 'Ginger',
    botanicalName: 'Zingiber officinale',
    aliases: ['Ginger Root', 'Sheng Jiang', 'Adrak'],
    category: 'Digestive',
    tags: ['nausea', 'digestion', 'inflammation', 'circulation', 'pain', 'cold and flu', 'motion sickness'],
    rating: 8.8,
    summary: 'A warming root with powerful digestive and anti-inflammatory properties. One of the most effective natural remedies for nausea and a cornerstone of both Eastern and Western herbal medicine.',
    overview: `Ginger has been used medicinally for over 5,000 years and is one of the most widely consumed spices in the world. It originated in Southeast Asia and spread along ancient trade routes to become essential in cuisines and medicine cabinets globally. Its warming, spicy character makes it versatile for both culinary and therapeutic use.

The root (technically a rhizome) contains gingerols and shogaols, which are responsible for its characteristic taste and most health benefits. Fresh ginger has more gingerols, while dried ginger has more shogaols. Both are effective but may have slightly different properties.`,
    howItWorks: `Ginger affects the digestive system in multiple ways. It speeds gastric emptying, helping food move through the stomach faster. It also appears to work on serotonin receptors in the gut, which are involved in nausea signaling. This is why it is so effective for motion sickness and morning sickness.

For inflammation, gingerols inhibit the same COX enzymes that NSAID medications target, plus they affect other inflammatory pathways. Ginger also has warming, circulation-enhancing properties that make it useful for cold extremities and cold-type conditions in traditional medicine.`,
    benefits: [
      { name: 'Nausea Relief', description: 'Highly effective for motion sickness, morning sickness, and post-operative nausea. One of the best-studied natural anti-nausea remedies.', evidenceLevel: 5 },
      { name: 'Digestive Support', description: 'Stimulates digestion, reduces bloating and gas, and helps with stomach discomfort. Traditional carminative herb.', evidenceLevel: 5 },
      { name: 'Anti-inflammatory', description: 'Reduces inflammation and pain, particularly helpful for muscle pain after exercise and menstrual cramps.', evidenceLevel: 4 },
      { name: 'Cold and Flu Support', description: 'Warming properties help with cold symptoms. May have mild antiviral effects.', evidenceLevel: 3 },
      { name: 'Circulation', description: 'Promotes blood flow to extremities. Traditional remedy for cold hands and feet.', evidenceLevel: 3 },
    ],
    dosages: [
      { form: 'Fresh Root', amount: '1-2 inches daily', timing: 'With or before meals', notes: 'Can be grated into food, juiced, or made into tea. Fresh is most potent for nausea.' },
      { form: 'Dried Powder', amount: '1-2 grams daily', timing: 'With meals', notes: 'More warming than fresh. Good for cooking and tea.' },
      { form: 'Capsules', amount: '250-500mg', timing: '2-3 times daily', notes: 'Convenient for travel and consistent dosing.' },
      { form: 'Tea', amount: '1-2 inches fresh root or 1 tsp dried', timing: 'As needed', notes: 'Simmer fresh ginger 10-15 minutes for stronger tea.' },
    ],
    bestTimeToTake: 'For nausea prevention, take ginger 30-60 minutes before travel or potential triggers. For digestive support, take with or shortly before meals. For inflammation, consistent daily intake is most effective.',
    howLongToWork: 'For nausea, effects can be felt within 30 minutes. For digestive issues, relief is often immediate. For anti-inflammatory effects, consistent use for 2-4 weeks shows best results.',
    sideEffects: ['Heartburn or stomach irritation at high doses', 'Mouth or throat irritation from fresh ginger', 'May increase bleeding tendency', 'Rarely: allergic reactions'],
    whoShouldAvoid: ['Those with gallstones (stimulates bile)', 'People with bleeding disorders', 'Those on blood thinners at high doses', 'People scheduled for surgery (stop 1-2 weeks before)'],
    interactions: [
      { substance: 'Blood thinners', severity: 'moderate', description: 'Ginger may enhance blood-thinning effects at high doses. Culinary amounts are generally fine.' },
      { substance: 'Diabetes medications', severity: 'mild', description: 'May lower blood sugar slightly. Monitor if diabetic.' },
      { substance: 'Blood pressure medications', severity: 'mild', description: 'May have mild blood pressure effects. Monitor when starting.' },
    ],
    faqs: [
      { question: 'Is fresh or dried ginger better?', answer: 'Both are effective but have slightly different properties. Fresh ginger is better for nausea and acute digestive issues. Dried ginger is more warming and may be better for circulation and chronic inflammation. For general health, use whichever is more convenient.' },
      { question: 'Can pregnant women take ginger?', answer: 'Yes, ginger is one of the safest natural remedies for morning sickness and has been well-studied in pregnancy. Stick to culinary amounts or up to 1 gram daily in supplements. Very high doses should be avoided.' },
      { question: 'How do I use ginger for motion sickness?', answer: 'Take ginger 30-60 minutes before travel. Capsules or crystallized ginger are convenient. You can also sip ginger tea during travel. Some people find fresh ginger works best, while others prefer standardized capsules for consistent dosing.' },
      { question: 'Can ginger help with muscle pain?', answer: 'Yes, studies show ginger can reduce muscle pain after exercise, though it works gradually rather than immediately. Taking ginger daily for several days before and after intense exercise may reduce soreness by 25% or more.' },
    ],
    qualityMarkers: ['Fresh root should be firm with smooth skin', 'Dried should have strong aroma', 'Supplements: look for standardized gingerol content', 'Organic preferred for teas and frequent use'],
    products: [
      { name: 'Ginger Extract', brand: 'NOW Foods', form: 'Capsules', size: '90 capsules, 250mg', affiliateUrl: '#', note: 'Standardized 5% gingerols' },
      { name: 'Organic Ginger Tea', brand: 'Traditional Medicinals', form: 'Tea', size: '16 bags', affiliateUrl: '#', note: 'Strong, warming ginger tea' },
      { name: 'Crystallized Ginger', brand: "Reed's", form: 'Candy', size: '3.5 oz', affiliateUrl: '#', note: 'Convenient for travel nausea' },
    ],
    relatedRemedies: ['turmeric', 'peppermint', 'fennel'],
    oftenPairedWith: ['turmeric', 'lemon', 'honey'],
    lastUpdated: '2026-01-28',
  },

  // ============================================
  // LEMON BALM
  // ============================================
  {
    id: 'lemon-balm',
    slug: 'lemon-balm',
    name: 'Lemon Balm',
    botanicalName: 'Melissa officinalis',
    aliases: ['Melissa', 'Balm Mint', 'Sweet Balm'],
    category: 'Nervine',
    tags: ['anxiety', 'sleep', 'digestion', 'stress', 'calm', 'herpes', 'cognitive'],
    rating: 7.3,
    summary: 'A gentle, lemon-scented herb from the mint family that calms the nervous system, supports digestion, and may help with cold sores. Safe enough for daily use as tea.',
    overview: `Lemon balm has been cultivated for over 2,000 years. The name "Melissa" comes from the Greek word for honeybee, as the plant is highly attractive to bees. In medieval times, it was used to treat melancholy and was considered a valuable medicinal herb by famous physicians like Paracelsus and Avicenna.

The leaves have a pleasant lemon scent due to citral and other volatile oils. It is one of the gentlest nervine herbs, suitable for children and the elderly, and can be enjoyed as a daily tea without concern. Its calming effects are subtle but effective, especially for stress-related digestive issues.`,
    howItWorks: `Lemon balm works primarily through the GABA system, inhibiting the enzyme that breaks down GABA and allowing more of this calming neurotransmitter to remain active. It also appears to have effects on acetylcholine receptors, which may explain some of its cognitive benefits.

The rosmarinic acid in lemon balm has antiviral properties, particularly against herpes simplex virus, which is why it is traditionally used for cold sores. It also has mild antispasmodic effects on the digestive tract, relieving cramping and nervous stomach.`,
    benefits: [
      { name: 'Anxiety and Stress Relief', description: 'Promotes calm without sedation. Studies show reduced anxiety and improved mood with regular use.', evidenceLevel: 4 },
      { name: 'Sleep Support', description: 'Helps with sleep onset, especially when combined with valerian. Good for restless, anxious sleepers.', evidenceLevel: 4 },
      { name: 'Cognitive Function', description: 'Some studies show improved memory and attention. May work partly by reducing anxiety that impairs focus.', evidenceLevel: 3 },
      { name: 'Digestive Calm', description: 'Relieves nervous stomach, bloating, and digestive spasms. Traditional carminative herb.', evidenceLevel: 3 },
      { name: 'Cold Sore Support', description: 'Topical application may shorten healing time for cold sores. Has antiviral properties against herpes.', evidenceLevel: 4 },
    ],
    dosages: [
      { form: 'Tea', amount: '1.5-4.5 grams dried leaf', timing: '2-3 cups daily', notes: 'Steep covered for 5-10 minutes to preserve volatile oils. Delicious hot or iced.' },
      { form: 'Tincture', amount: '2-3ml', timing: 'Up to 3 times daily', notes: 'Convenient for consistent dosing or acute anxiety.' },
      { form: 'Capsules', amount: '300-500mg', timing: '2-3 times daily', notes: 'Look for standardized extracts for consistent potency.' },
      { form: 'Topical (for cold sores)', amount: 'As directed', timing: 'At first sign of outbreak', notes: 'Look for products with at least 1% lemon balm extract.' },
    ],
    bestTimeToTake: 'Lemon balm can be taken any time of day. For sleep, take 1-2 hours before bed. For anxiety, take as needed or regularly for consistent effect. As a tea, it makes an excellent afternoon relaxation ritual.',
    howLongToWork: 'Calming effects are usually noticed within 30-60 minutes. For chronic anxiety or sleep issues, regular use for 2-4 weeks shows best results. Cold sore applications work best when started at the first sign of an outbreak.',
    sideEffects: ['Very well tolerated', 'Possible mild sedation at higher doses', 'May affect thyroid hormone levels at very high doses', 'Rare: increased appetite'],
    whoShouldAvoid: ['Those with hypothyroidism (may affect thyroid hormones at high doses)', 'People taking thyroid medications', 'Pregnant or breastfeeding women should limit to culinary amounts'],
    interactions: [
      { substance: 'Thyroid medications', severity: 'moderate', description: 'May interfere with thyroid hormone. Avoid high doses if you have thyroid issues.' },
      { substance: 'Sedatives', severity: 'mild', description: 'May enhance sedative effects. Usually not problematic but monitor for excess drowsiness.' },
      { substance: 'Glaucoma medications', severity: 'mild', description: 'May affect intraocular pressure. Consult your doctor if you have glaucoma.' },
    ],
    faqs: [
      { question: 'Can children take lemon balm?', answer: 'Yes, lemon balm is one of the safest herbs for children. It is gentle and well-tolerated. Many parents use lemon balm tea for anxious or restless children. Adjust the dose based on the child age and weight.' },
      { question: 'Does lemon balm affect thyroid function?', answer: 'At very high doses, lemon balm may inhibit thyroid hormone. Normal tea consumption is unlikely to cause issues. However, if you have hypothyroidism or take thyroid medication, consult your doctor before using concentrated supplements.' },
      { question: 'Can I grow lemon balm at home?', answer: 'Absolutely! Lemon balm is easy to grow and actually spreads aggressively. It is a perennial in most climates. Growing your own ensures freshness and provides an abundant supply for tea. Just give it room to spread or contain it in pots.' },
      { question: 'How does lemon balm compare to chamomile?', answer: 'Both are gentle, safe, and good for anxiety and digestion. Lemon balm is slightly more uplifting and better for daytime use. Chamomile is more sedating and traditionally better for sleep. Many people enjoy both and choose based on the situation.' },
    ],
    qualityMarkers: ['Should have strong lemon scent', 'Look for leaf (not stem)', 'Organic is preferable as leaves are consumed', 'Standardized extracts ensure consistent potency'],
    products: [
      { name: 'Lemon Balm Liquid Extract', brand: 'Herb Pharm', form: 'Tincture', size: '1 fl oz', affiliateUrl: '#', note: 'Made from fresh herb' },
      { name: 'Organic Lemon Balm Tea', brand: 'Traditional Medicinals', form: 'Tea', size: '16 bags', affiliateUrl: '#', note: 'Relaxing and delicious' },
    ],
    relatedRemedies: ['chamomile', 'passionflower', 'holy-basil'],
    oftenPairedWith: ['valerian', 'chamomile', 'lavender'],
    lastUpdated: '2026-01-28',
  },
];

export function getRemedyBySlug(slug: string): Remedy | undefined {
  return REMEDIES.find(r => r.slug === slug);
}

export function searchRemedies(query: string): Remedy[] {
  const lowerQuery = query.toLowerCase();
  
  return REMEDIES.filter(remedy => {
    if (remedy.name.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.botanicalName.toLowerCase().includes(lowerQuery)) return true;
    if (remedy.aliases.some(a => a.toLowerCase().includes(lowerQuery))) return true;
    if (remedy.tags.some(t => t.toLowerCase().includes(lowerQuery))) return true;
    if (remedy.faqs.some(faq => 
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    )) return true;
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
