// Health Quiz Types and Data

export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; points: number }[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: QuizQuestion[];
  getResult: (score: number, maxScore: number) => QuizResult;
}

export interface QuizResult {
  title: string;
  description: string;
  suggestions: string[];
  score: number;
  maxScore: number;
}

// Quiz Data

export const QUIZZES: Quiz[] = [
  {
    id: 'stress',
    title: 'Stress Assessment',
    description: 'Evaluate your current stress levels and discover natural ways to manage them.',
    icon: 'brain',
    questions: [
      {
        id: 's1',
        question: 'How often do you feel overwhelmed by your responsibilities?',
        options: [
          { label: 'Rarely', value: 'rarely', points: 1 },
          { label: 'Sometimes', value: 'sometimes', points: 2 },
          { label: 'Often', value: 'often', points: 3 },
          { label: 'Almost always', value: 'always', points: 4 },
        ],
      },
      {
        id: 's2',
        question: 'How well do you sleep on most nights?',
        options: [
          { label: 'Very well, 7-9 hours', value: 'great', points: 1 },
          { label: 'Okay, but I wake up sometimes', value: 'okay', points: 2 },
          { label: 'Poorly, I struggle to fall or stay asleep', value: 'poor', points: 3 },
          { label: 'I regularly get less than 5 hours', value: 'terrible', points: 4 },
        ],
      },
      {
        id: 's3',
        question: 'Do you experience physical symptoms of stress (headaches, muscle tension, stomach issues)?',
        options: [
          { label: 'No', value: 'no', points: 1 },
          { label: 'Occasionally', value: 'occasionally', points: 2 },
          { label: 'Frequently', value: 'frequently', points: 3 },
          { label: 'Daily', value: 'daily', points: 4 },
        ],
      },
      {
        id: 's4',
        question: 'How often do you take time for relaxation or hobbies?',
        options: [
          { label: 'Daily', value: 'daily', points: 1 },
          { label: 'A few times a week', value: 'weekly', points: 2 },
          { label: 'Rarely', value: 'rarely', points: 3 },
          { label: 'Almost never', value: 'never', points: 4 },
        ],
      },
      {
        id: 's5',
        question: 'How would you rate your overall energy levels?',
        options: [
          { label: 'High and consistent', value: 'high', points: 1 },
          { label: 'Moderate with some dips', value: 'moderate', points: 2 },
          { label: 'Low, I rely on caffeine', value: 'low', points: 3 },
          { label: 'Exhausted most of the time', value: 'exhausted', points: 4 },
        ],
      },
    ],
    getResult: (score, maxScore) => {
      const pct = score / maxScore;
      if (pct <= 0.35) return {
        title: 'Low Stress',
        description: 'Your stress levels appear well-managed. Keep up your healthy habits!',
        suggestions: ['Continue your current routines', 'Consider ashwagandha for extra resilience', 'Maintain regular sleep schedule'],
        score, maxScore,
      };
      if (pct <= 0.6) return {
        title: 'Moderate Stress',
        description: 'You have some stress that could benefit from natural support.',
        suggestions: ['Try ashwagandha or rhodiola for stress resilience', 'Practice 10 minutes of daily deep breathing', 'Reduce caffeine after 2 PM', 'Consider magnesium glycinate before bed'],
        score, maxScore,
      };
      return {
        title: 'High Stress',
        description: 'Your stress levels are elevated. Natural remedies and lifestyle changes could help significantly.',
        suggestions: ['Ashwagandha (300-600mg/day) for cortisol regulation', 'L-theanine for calm focus without drowsiness', 'Establish a wind-down routine 1 hour before bed', 'Consider starting a meditation practice', 'Limit screen time in the evening'],
        score, maxScore,
      };
    },
  },
  {
    id: 'sleep',
    title: 'Sleep Quality Check',
    description: 'Assess your sleep patterns and learn natural ways to improve rest.',
    icon: 'moon',
    questions: [
      {
        id: 'sl1',
        question: 'How long does it usually take you to fall asleep?',
        options: [
          { label: 'Less than 15 minutes', value: 'quick', points: 1 },
          { label: '15-30 minutes', value: 'normal', points: 2 },
          { label: '30-60 minutes', value: 'slow', points: 3 },
          { label: 'Over an hour', value: 'very-slow', points: 4 },
        ],
      },
      {
        id: 'sl2',
        question: 'How often do you wake up during the night?',
        options: [
          { label: 'Rarely or never', value: 'rarely', points: 1 },
          { label: 'Once', value: 'once', points: 2 },
          { label: '2-3 times', value: 'several', points: 3 },
          { label: 'More than 3 times', value: 'many', points: 4 },
        ],
      },
      {
        id: 'sl3',
        question: 'How do you feel when you wake up in the morning?',
        options: [
          { label: 'Refreshed and energized', value: 'great', points: 1 },
          { label: 'Okay, takes a bit to get going', value: 'okay', points: 2 },
          { label: 'Groggy and tired', value: 'tired', points: 3 },
          { label: 'Exhausted, like I barely slept', value: 'exhausted', points: 4 },
        ],
      },
      {
        id: 'sl4',
        question: 'Do you use screens (phone, TV, computer) within an hour of bedtime?',
        options: [
          { label: 'No, I avoid screens before bed', value: 'no', points: 1 },
          { label: 'Sometimes', value: 'sometimes', points: 2 },
          { label: 'Usually', value: 'usually', points: 3 },
          { label: 'Always, I fall asleep with my phone', value: 'always', points: 4 },
        ],
      },
      {
        id: 'sl5',
        question: 'Do you consume caffeine after 2 PM?',
        options: [
          { label: 'Never', value: 'never', points: 1 },
          { label: 'Occasionally', value: 'occasionally', points: 2 },
          { label: 'Regularly', value: 'regularly', points: 3 },
          { label: 'Yes, even in the evening', value: 'evening', points: 4 },
        ],
      },
    ],
    getResult: (score, maxScore) => {
      const pct = score / maxScore;
      if (pct <= 0.35) return {
        title: 'Healthy Sleep',
        description: 'Your sleep habits look solid. Small tweaks could make them even better.',
        suggestions: ['Keep your consistent routine', 'Try chamomile tea as an evening ritual', 'Maintain a cool, dark bedroom'],
        score, maxScore,
      };
      if (pct <= 0.6) return {
        title: 'Room for Improvement',
        description: 'Your sleep could use some attention. Natural aids may help.',
        suggestions: ['Magnesium glycinate (200-400mg) 1 hour before bed', 'Start a screen-free wind-down routine', 'Try valerian root or passionflower tea', 'Keep your bedroom between 65-68 degrees F'],
        score, maxScore,
      };
      return {
        title: 'Sleep Needs Attention',
        description: 'Your sleep quality appears significantly impacted. Multiple natural strategies could help.',
        suggestions: ['Valerian root (300-600mg) 30 min before bed', 'L-theanine (200mg) for calming the mind', 'No caffeine after 12 PM', 'Blue-light blocking glasses in the evening', 'Consider a consistent sleep/wake schedule, even weekends', 'Magnesium glycinate for muscle relaxation'],
        score, maxScore,
      };
    },
  },
  {
    id: 'digestion',
    title: 'Digestive Health',
    description: 'Check your digestive wellness and find natural remedies for common issues.',
    icon: 'leaf',
    questions: [
      {
        id: 'd1',
        question: 'How often do you experience bloating or gas?',
        options: [
          { label: 'Rarely', value: 'rarely', points: 1 },
          { label: 'A few times a week', value: 'weekly', points: 2 },
          { label: 'Daily', value: 'daily', points: 3 },
          { label: 'After most meals', value: 'constant', points: 4 },
        ],
      },
      {
        id: 'd2',
        question: 'How regular are your bowel movements?',
        options: [
          { label: 'Very regular, daily', value: 'regular', points: 1 },
          { label: 'Mostly regular', value: 'mostly', points: 2 },
          { label: 'Irregular', value: 'irregular', points: 3 },
          { label: 'Frequently constipated or loose', value: 'problematic', points: 4 },
        ],
      },
      {
        id: 'd3',
        question: 'Do you experience heartburn or acid reflux?',
        options: [
          { label: 'Never', value: 'never', points: 1 },
          { label: 'Occasionally', value: 'occasionally', points: 2 },
          { label: 'Weekly', value: 'weekly', points: 3 },
          { label: 'Daily', value: 'daily', points: 4 },
        ],
      },
      {
        id: 'd4',
        question: 'How many servings of fruits and vegetables do you eat daily?',
        options: [
          { label: '5 or more', value: 'great', points: 1 },
          { label: '3-4', value: 'good', points: 2 },
          { label: '1-2', value: 'low', points: 3 },
          { label: 'Less than 1', value: 'minimal', points: 4 },
        ],
      },
      {
        id: 'd5',
        question: 'Do you take probiotics or eat fermented foods?',
        options: [
          { label: 'Yes, regularly', value: 'regularly', points: 1 },
          { label: 'Sometimes', value: 'sometimes', points: 2 },
          { label: 'Rarely', value: 'rarely', points: 3 },
          { label: 'Never', value: 'never', points: 4 },
        ],
      },
    ],
    getResult: (score, maxScore) => {
      const pct = score / maxScore;
      if (pct <= 0.35) return {
        title: 'Healthy Digestion',
        description: 'Your digestive health looks good! Maintain your current habits.',
        suggestions: ['Continue eating fiber-rich foods', 'Keep up with fermented foods/probiotics', 'Stay well-hydrated'],
        score, maxScore,
      };
      if (pct <= 0.6) return {
        title: 'Some Digestive Concerns',
        description: 'There are areas where natural support could improve your digestion.',
        suggestions: ['Ginger tea before or after meals', 'Add a probiotic supplement', 'Increase fiber gradually', 'Try peppermint tea for bloating', 'Eat slowly and chew thoroughly'],
        score, maxScore,
      };
      return {
        title: 'Digestive Health Needs Support',
        description: 'Your digestion could benefit significantly from natural remedies and dietary adjustments.',
        suggestions: ['Slippery elm for gut lining support', 'Digestive enzyme supplement with meals', 'Peppermint oil capsules for IBS-type symptoms', 'Increase water intake to 8+ glasses daily', 'Consider an elimination diet to identify triggers', 'Marshmallow root tea for soothing the gut'],
        score, maxScore,
      };
    },
  },
];
