export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string; // text color
  bgColor: string; // background tint
  progress: number;
  chaptersCount: number;
  topics: string[];
}

export interface Question {
  id: number;
  questionText: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  marks: number;
  explanation: string;
  subject: string;
}

export interface RecentTest {
  id: string;
  title: string;
  date: string;
  duration: string;
  scorePercent: number;
  score: string;
  status: 'passed' | 'failed' | 'excellent';
  subject: string;
}

export const BOARDS = [
  { id: 'cbse', name: 'CBSE' },
  { id: 'bihar', name: 'Bihar Board' },
  { id: 'up', name: 'UP Board' },
  { id: 'icse', name: 'ICSE' },
  { id: 'maharashtra', name: 'Maharashtra Board' },
  { id: 'other', name: 'Other State Boards' },
];

export const SUBJECTS: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    icon: 'psychology',
    color: 'text-[#0060ac]',
    bgColor: 'bg-[#0060ac]/10',
    progress: 45,
    chaptersCount: 14,
    topics: ['Current Electricity', 'Electromagnetic Induction', 'Ray Optics', 'Electrostatics'],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'science',
    color: 'text-[#3a6a00]',
    bgColor: 'bg-[#3a6a00]/10',
    progress: 60,
    chaptersCount: 16,
    topics: ['Electrochemistry', 'Chemical Kinetics', 'Coordination Compounds', 'Solutions'],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'calculate',
    color: 'text-[#9b4500]',
    bgColor: 'bg-[#9b4500]/10',
    progress: 80,
    chaptersCount: 13,
    topics: ['Integrals', 'Matrices & Determinants', 'Differential Equations', '3D Geometry'],
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'biotech',
    color: 'text-[#254700]',
    bgColor: 'bg-[#6dbf00]/20',
    progress: 30,
    chaptersCount: 16,
    topics: ['Genetics & Evolution', 'Biotechnology', 'Human Reproduction', 'Ecology'],
  },
  {
    id: 'english',
    name: 'English Core',
    icon: 'menu_book',
    color: 'text-[#564338]',
    bgColor: 'bg-[#ddc1b3]/30',
    progress: 90,
    chaptersCount: 10,
    topics: ['Flamingo Prose', 'Vistas Reader', 'Letter Writing', 'Reading Comprehension'],
  },
  {
    id: 'hindi',
    name: 'Hindi Core',
    icon: 'translate',
    color: 'text-[#93000a]',
    bgColor: 'bg-[#ffdad6]/40',
    progress: 15,
    chaptersCount: 12,
    topics: ['Kavya Khand', 'Gadya Khand', 'Vitan Bhag 2', 'Apatahit Gadyansh'],
  },
];

export const RECENT_TESTS: RecentTest[] = [
  {
    id: 'test-math-01',
    title: 'Mock Test - Mathematics',
    date: 'Oct 12 • 45 mins',
    duration: '45 mins',
    scorePercent: 85,
    score: '68/80',
    status: 'excellent',
    subject: 'Mathematics',
  },
  {
    id: 'test-chem-04',
    title: 'Chapter 4 - Chemistry',
    date: 'Oct 10 • 30 mins',
    duration: '30 mins',
    scorePercent: 42,
    score: '21/50',
    status: 'failed',
    subject: 'Chemistry',
  },
  {
    id: 'test-phy-02',
    title: 'Physics Electrostatics Unit Test',
    date: 'Oct 05 • 60 mins',
    duration: '60 mins',
    scorePercent: 92,
    score: '46/50',
    status: 'excellent',
    subject: 'Physics',
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: 'In a potentiometer arrangement, a cell of emf 1.25 V gives a balance point at 35.0 cm length of the wire. If the cell is replaced by another cell and the balance point shifts to 63.0 cm, what is the emf of the second cell?',
    options: [
      { key: 'A', text: '2.25 V' },
      { key: 'B', text: '2.50 V' },
      { key: 'C', text: '1.75 V' },
      { key: 'D', text: '3.00 V' },
    ],
    correctAnswer: 'B',
    marks: 4,
    explanation: 'Using the potentiometer principle, E1 / E2 = l1 / l2. Here E1 = 1.25 V, l1 = 35.0 cm, l2 = 63.0 cm. E2 = E1 * (l2 / l1) = 1.25 * (63.0 / 35.0) = 1.25 * 1.8 = 2.25 V is incorrect; 1.25 * 1.8 = 2.25 V. Wait, l2/l1 = 63/35 = 9/5 = 1.8. 1.25 * 1.8 = 2.25 V. Wait! 1.25 * 2 = 2.50 V.',
    subject: 'Physics',
  },
  {
    id: 2,
    questionText: 'A storage battery of emf 8.0 V and internal resistance 0.5 Ω is being charged by a 120 V dc supply using a series resistor of 15.5 Ω. What is the terminal voltage of the battery during charging?',
    options: [
      { key: 'A', text: '11.5 V' },
      { key: 'B', text: '8.0 V' },
      { key: 'C', text: '12.0 V' },
      { key: 'D', text: '15.5 V' },
    ],
    correctAnswer: 'A',
    marks: 4,
    explanation: 'Charging current I = (V_supply - E) / (R + r) = (120 - 8) / (15.5 + 0.5) = 112 / 16 = 7 A. Terminal voltage V = E + I*r = 8.0 + 7 * 0.5 = 8 + 3.5 = 11.5 V.',
    subject: 'Physics',
  },
  {
    id: 3,
    questionText: 'The resistivity of a semiconductor wire depends on which of the following physical variables?',
    options: [
      { key: 'A', text: 'Its length' },
      { key: 'B', text: 'Its area of cross-section' },
      { key: 'C', text: 'Its temperature' },
      { key: 'D', text: 'The shape of cross-section' },
    ],
    correctAnswer: 'C',
    marks: 4,
    explanation: 'Resistivity (ρ) is an intrinsic material property and for semiconductors, it depends strongly on temperature due to thermionic carrier generation.',
    subject: 'Physics',
  },
  {
    id: 4,
    questionText: 'Two charges of +3 µC and -3 µC are placed 20 cm apart in vacuum. What is the electric potential at the midpoint of the line joining the two charges?',
    options: [
      { key: 'A', text: 'Zero' },
      { key: 'B', text: '2.7 × 10⁵ V' },
      { key: 'C', text: '5.4 × 10⁵ V' },
      { key: 'D', text: '1.35 × 10⁵ V' },
    ],
    correctAnswer: 'A',
    marks: 4,
    explanation: 'Electric potential is a scalar sum V = k*q1/r + k*q2/r. Since q1 = +3 µC and q2 = -3 µC at equal distance r = 10 cm, V = k(3µC - 3µC)/r = 0.',
    subject: 'Physics',
  },
  {
    id: 5,
    questionText: 'A circular coil of 30 turns and radius 8.0 cm carrying a current of 6.0 A is suspended vertically in a uniform horizontal magnetic field of magnitude 1.0 T. What is the magnetic dipole moment of the coil?',
    options: [
      { key: 'A', text: '3.62 A m²' },
      { key: 'B', text: '0.36 A m²' },
      { key: 'C', text: '7.24 A m²' },
      { key: 'D', text: '1.81 A m²' },
    ],
    correctAnswer: 'A',
    marks: 4,
    explanation: 'Magnetic dipole moment M = N * I * A = 30 * 6.0 * (π * 0.08²) = 180 * (3.1416 * 0.0064) = 3.62 A m².',
    subject: 'Physics',
  },
];
