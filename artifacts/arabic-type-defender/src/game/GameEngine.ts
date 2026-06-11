import type { MutableRefObject } from "react";
import { GameState, Enemy, Laser, Particle, Star, DIFFICULTY_CONFIG, ENEMY_COLORS, Difficulty } from "./types";
import { getWordsByDifficulty, getRandomWord } from "../data/words";
import { audioManager } from "../audio/AudioManager";

let idCounter = 0;
function uid() { return String(++idCounter); }

function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.4 + 0.1,
    opacity: Math.random() * 0.8 + 0.2,
    twinkle: Math.random() * Math.PI * 2,
  }));
}

export function createInitialState(difficulty: Difficulty, width: number, height: number): GameState {
  return {
    screen: "game",
    difficulty,
    score: 0,
    lives: DIFFICULTY_CONFIG[difficulty].lives,
    level: 1,
    combo: 0,
    maxCombo: 0,
    totalWords: 0,
    correctWords: 0,
    totalChars: 0,
    correctChars: 0,
    errors: 0,
    startTime: Date.now(),
    elapsed: 0,
    enemies: [],
    lasers: [],
    particles: [],
    stars: createStars(180, width, height),
    currentTarget: null,
    paused: false,
    shake: 0,
    waveCount: 0,
  };
}

function createEnemy(word: string, x: number, config: typeof DIFFICULTY_CONFIG[Difficulty], survivalBonus: number): Enemy {
  return {
    id: uid(),
    word,
    typedCount: 0,
    x,
    y: -40,
    speed: config.speed + survivalBonus + Math.random() * 0.15,
    active: true,
    exploding: false,
    explosionFrame: 0,
    scale: 1,
    opacity: 1,
    color: ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)],
  };
}

function createParticles(x: number, y: number, color: string, count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    return {
      id: uid(),
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      radius: Math.random() * 4 + 1,
      color,
    };
  });
}

export interface UpdateResult {
  state: GameState;
  gameOver: boolean;
  scoreGained: number;
  comboGained: number;
}

export function updateGame(
  state: GameState,
  dt: number,
  width: number,
  height: number,
  spawnTimer: MutableRefObject<number>,
  wordsRef: MutableRefObject<string[]>
): UpdateResult {
  if (state.paused) return { state, gameOver: false, scoreGained: 0, comboGained: 0 };

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const survivalBonus = state.difficulty === "survival" ? state.waveCount * config.speedIncrease : 0;

  let enemies = [...state.enemies];
  let lasers = [...state.lasers];
  let particles = [...state.particles];
  let stars = [...state.stars];
  let score = state.score;
  let lives = state.lives;
  let combo = state.combo;
  let shake = state.shake;
  let currentTarget = state.currentTarget;
  let waveCount = state.waveCount;
  let scoreGained = 0;
  let comboGained = 0;
  let gameOver = false;

  spawnTimer.current -= dt;
  const spawnRate = Math.max(config.spawnRate - waveCount * 80, 800);
  if (spawnTimer.current <= 0 && enemies.filter(e => e.active && !e.exploding).length < config.maxEnemies) {
    const words = wordsRef.current;
    const word = getRandomWord(words);
    const padding = 60;
    const x = padding + Math.random() * (width - padding * 2);
    enemies = [...enemies, createEnemy(word, x, config, survivalBonus)];
    spawnTimer.current = spawnRate;
    waveCount++;
  }

  stars = stars.map(s => ({
    ...s,
    y: s.y + s.speed * dt / 16,
    twinkle: s.twinkle + 0.02,
    x: s.y > height ? Math.random() * width : s.x,
  })).map(s => ({ ...s, y: s.y > height ? -5 : s.y }));

  enemies = enemies.map(e => {
    if (!e.active) return e;
    if (e.exploding) {
      const newFrame = e.explosionFrame + 1;
      if (newFrame > 20) return { ...e, active: false };
      return { ...e, explosionFrame: newFrame, scale: 1 + newFrame * 0.12, opacity: 1 - newFrame / 20 };
    }
    const newY = e.y + e.speed * dt / 16;
    if (newY > height - 80) {
      lives = Math.max(0, lives - 1);
      shake = 20;
      combo = 0;
      audioManager.playDamage();
      particles = [...particles, ...createParticles(e.x, height - 80, "#ff4444", 12)];
      if (currentTarget === e.id) currentTarget = null;
      return { ...e, active: false };
    }
    return { ...e, y: newY };
  });

  lasers = lasers.map(l => {
    if (!l.active) return l;
    const newProgress = l.progress + dt / 120;
    if (newProgress >= 1) return { ...l, active: false };
    return { ...l, progress: newProgress };
  }).filter(l => l.active);

  particles = particles.map(p => ({
    ...p,
    x: p.x + p.vx * dt / 16,
    y: p.y + p.vy * dt / 16,
    vy: p.vy + 0.1,
    life: p.life - dt / (p.maxLife * 800),
  })).filter(p => p.life > 0);

  shake = Math.max(0, shake - dt / 16);

  if (lives <= 0) gameOver = true;

  if (currentTarget && !enemies.find(e => e.id === currentTarget && e.active && !e.exploding)) {
    currentTarget = null;
  }

  return {
    state: {
      ...state,
      enemies,
      lasers,
      particles,
      stars,
      score,
      lives,
      combo,
      maxCombo: Math.max(state.maxCombo, combo),
      shake,
      currentTarget,
      elapsed: Date.now() - state.startTime,
      waveCount,
    },
    gameOver,
    scoreGained,
    comboGained,
  };
}

export interface TypeResult {
  state: GameState;
  correct: boolean;
  wordCompleted: boolean;
}

export function handleTyping(state: GameState, char: string, height: number, width: number): TypeResult {
  let enemies = [...state.enemies];
  let lasers = [...state.lasers];
  let particles = [...state.particles];
  let score = state.score;
  let combo = state.combo;
  let errors = state.errors;
  let totalChars = state.totalChars;
  let correctChars = state.correctChars;
  let totalWords = state.totalWords;
  let correctWords = state.correctWords;
  let currentTarget = state.currentTarget;

  totalChars++;

  const activeEnemies = enemies.filter(e => e.active && !e.exploding);

  if (!currentTarget) {
    const matching = activeEnemies.filter(e => e.word[0] === char);
    if (matching.length > 0) {
      const closest = matching.reduce((a, b) => a.y > b.y ? a : b);
      currentTarget = closest.id;
    }
  }

  if (!currentTarget) {
    errors++;
    audioManager.playError();
    return {
      state: { ...state, errors, totalChars, currentTarget },
      correct: false,
      wordCompleted: false,
    };
  }

  const targetIdx = enemies.findIndex(e => e.id === currentTarget);
  if (targetIdx === -1) {
    currentTarget = null;
    errors++;
    audioManager.playError();
    return {
      state: { ...state, errors, totalChars, currentTarget },
      correct: false,
      wordCompleted: false,
    };
  }

  const target = enemies[targetIdx];
  const expectedChar = target.word[target.typedCount];

  if (char !== expectedChar) {
    errors++;
    audioManager.playError();
    return {
      state: { ...state, errors, totalChars, currentTarget },
      correct: false,
      wordCompleted: false,
    };
  }

  correctChars++;
  audioManager.playCorrectChar();

  const newTypedCount = target.typedCount + 1;

  if (newTypedCount >= target.word.length) {
    const wordLen = target.word.length;
    const basePoints = wordLen * 10;
    const comboBonus = Math.floor(combo * 0.5 * basePoints);
    const gained = basePoints + comboBonus;
    score += gained;
    combo++;
    totalWords++;
    correctWords++;

    if (combo > 1) audioManager.playCombo(combo);
    else audioManager.playWordComplete();
    audioManager.playLaser();
    audioManager.playExplosion();

    const playerX = width / 2;
    const playerY = height - 60;

    lasers = [...lasers, {
      id: uid(),
      fromX: playerX,
      fromY: playerY,
      toX: target.x,
      toY: target.y,
      progress: 0,
      active: true,
      color: target.color,
    }];

    particles = [...particles, ...createParticles(target.x, target.y, target.color, 20)];

    enemies = enemies.map((e, i) =>
      i === targetIdx
        ? { ...e, typedCount: newTypedCount, exploding: true, explosionFrame: 0 }
        : e
    );

    currentTarget = null;

    return {
      state: {
        ...state,
        enemies,
        lasers,
        particles,
        score,
        combo,
        maxCombo: Math.max(state.maxCombo, combo),
        errors,
        totalChars,
        correctChars,
        totalWords,
        correctWords,
        currentTarget,
      },
      correct: true,
      wordCompleted: true,
    };
  }

  enemies = enemies.map((e, i) =>
    i === targetIdx ? { ...e, typedCount: newTypedCount } : e
  );

  return {
    state: {
      ...state,
      enemies,
      lasers,
      particles,
      score,
      combo,
      errors,
      totalChars,
      correctChars,
      totalWords,
      correctWords,
      currentTarget,
    },
    correct: true,
    wordCompleted: false,
  };
}

export function getHighScores(): Array<{ score: number; difficulty: string; date: string; accuracy: number; wpm: number }> {
  try {
    const raw = localStorage.getItem("arabicTypeDefender_scores");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

export function saveHighScore(score: number, difficulty: Difficulty, accuracy: number, wpm: number) {
  const scores = getHighScores();
  scores.push({ score, difficulty, date: new Date().toLocaleDateString("ar"), accuracy, wpm });
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem("arabicTypeDefender_scores", JSON.stringify(top10));
}
