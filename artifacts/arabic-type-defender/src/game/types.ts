export type GameScreen = "menu" | "game" | "gameover" | "instructions" | "leaderboard";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "survival";

export interface Enemy {
  id: string;
  word: string;
  typedCount: number;
  x: number;
  y: number;
  speed: number;
  active: boolean;
  exploding: boolean;
  explosionFrame: number;
  scale: number;
  opacity: number;
  color: string;
}

export interface Laser {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  active: boolean;
  color: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
}

export interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  twinkle: number;
}

export interface GameState {
  screen: GameScreen;
  difficulty: Difficulty;
  score: number;
  lives: number;
  level: number;
  combo: number;
  maxCombo: number;
  totalWords: number;
  correctWords: number;
  totalChars: number;
  correctChars: number;
  errors: number;
  startTime: number;
  elapsed: number;
  enemies: Enemy[];
  lasers: Laser[];
  particles: Particle[];
  stars: Star[];
  currentTarget: string | null;
  paused: boolean;
  shake: number;
  waveCount: number;
}

export interface HighScore {
  score: number;
  difficulty: Difficulty;
  date: string;
  accuracy: number;
  wpm: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label: string;
  description: string;
  speed: number;
  spawnRate: number;
  maxEnemies: number;
  lives: number;
  speedIncrease: number;
}> = {
  beginner: {
    label: "المبتدئ",
    description: "كلمات قصيرة وسهلة - سرعة بطيئة",
    speed: 0.3,
    spawnRate: 3500,
    maxEnemies: 4,
    lives: 5,
    speedIncrease: 0,
  },
  intermediate: {
    label: "المتوسط",
    description: "كلمات أطول - سرعة متوسطة",
    speed: 0.6,
    spawnRate: 2500,
    maxEnemies: 5,
    lives: 4,
    speedIncrease: 0,
  },
  advanced: {
    label: "المتقدم",
    description: "كلمات صعبة - سرعة عالية",
    speed: 1.1,
    spawnRate: 1800,
    maxEnemies: 6,
    lives: 3,
    speedIncrease: 0,
  },
  survival: {
    label: "وضع البقاء",
    description: "تزداد السرعة تدريجياً - حتى الموت!",
    speed: 0.4,
    spawnRate: 3000,
    maxEnemies: 7,
    lives: 3,
    speedIncrease: 0.05,
  },
};

export const ENEMY_COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff922b", "#cc5de8", "#20c997", "#f06595",
];
