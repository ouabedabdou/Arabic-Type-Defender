import { useEffect, useRef, useCallback, useState } from "react";
import { GameState, Difficulty } from "../game/types";
import { createInitialState, updateGame, handleTyping, saveHighScore } from "../game/GameEngine";
import { render } from "../game/Renderer";
import { getWordsByDifficulty } from "../data/words";

interface Props {
  difficulty: Difficulty;
  onGameOver: (state: GameState) => void;
  onMenu: () => void;
}

export default function GameScreen({ difficulty, onGameOver, onMenu }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const wordsRef = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const getCanvasSize = () => {
    const maxW = Math.min(window.innerWidth, 900);
    const maxH = window.innerHeight;
    return { w: maxW, h: maxH };
  };

  useEffect(() => {
    wordsRef.current = getWordsByDifficulty(difficulty);
    const { w, h } = getCanvasSize();
    const initial = createInitialState(difficulty, w, h);
    stateRef.current = initial;
    spawnTimerRef.current = 500;

    if (inputRef.current) {
      inputRef.current.focus();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w;
    canvas.height = h;

    const handleResize = () => {
      const { w: nw, h: nh } = getCanvasSize();
      canvas.width = nw;
      canvas.height = nh;
    };
    window.addEventListener("resize", handleResize);

    let animTime = 0;
    const loop = (timestamp: number) => {
      const dt = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;
      animTime = timestamp;

      if (stateRef.current && !stateRef.current.paused) {
        const result = updateGame(
          stateRef.current,
          dt,
          canvas.width,
          canvas.height,
          spawnTimerRef,
          wordsRef
        );
        stateRef.current = result.state;

        if (result.gameOver) {
          const s = stateRef.current;
          const elapsed = s.elapsed / 1000 / 60;
          const wpm = elapsed > 0 ? Math.round(s.correctWords / elapsed) : 0;
          const acc = s.totalChars > 0 ? Math.round((s.correctChars / s.totalChars) * 100) : 100;
          saveHighScore(s.score, difficulty, acc, wpm);
          onGameOver(s);
          return;
        }

        setScoreDisplay(result.state.score);
      }

      const ctx = canvas.getContext("2d");
      if (ctx && stateRef.current) {
        render(ctx, stateRef.current, canvas.width, canvas.height, animTime);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [difficulty]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onMenu();
      return;
    }
    if (e.key === "p" || e.key === "P" || e.key === "pause") {
      if (stateRef.current) {
        const newPaused = !stateRef.current.paused;
        stateRef.current = { ...stateRef.current, paused: newPaused };
        setIsPaused(newPaused);
        lastTimeRef.current = 0;
      }
      return;
    }
    if (stateRef.current?.paused) return;
  }, [onMenu]);

  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const val = input.value;
    if (!val || !stateRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const char = val[val.length - 1];
    if (!char || char === " ") {
      input.value = "";
      return;
    }

    const result = handleTyping(stateRef.current, char, canvas.height, canvas.width);
    stateRef.current = result.state;
    input.value = "";
  }, []);

  return (
    <div
      style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#000008" }}
      onClick={() => inputRef.current?.focus()}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          cursor: "none",
        }}
      />
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        dir="rtl"
        lang="ar"
        inputMode="text"
      />
      {isPaused && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,20,0.7)", zIndex: 100,
        }}>
          <div style={{
            background: "rgba(0,10,40,0.95)", border: "1px solid #0088cc",
            borderRadius: 16, padding: "40px 60px", textAlign: "center",
            boxShadow: "0 0 40px rgba(0,136,204,0.4)",
          }}>
            <div style={{ fontSize: 32, color: "#00ccff", fontFamily: "'Cairo', Arial", fontWeight: "bold", marginBottom: 16 }}>
              ⏸ إيقاف مؤقت
            </div>
            <div style={{ color: "#aaa", fontFamily: "'Cairo', Arial", fontSize: 14, marginBottom: 24 }}>
              اضغط P للمتابعة أو Escape للقائمة الرئيسية
            </div>
            <button
              onClick={() => {
                if (stateRef.current) {
                  stateRef.current = { ...stateRef.current, paused: false };
                  setIsPaused(false);
                  lastTimeRef.current = 0;
                  inputRef.current?.focus();
                }
              }}
              style={{
                background: "linear-gradient(135deg, #0066cc, #00aaff)", color: "#fff",
                border: "none", borderRadius: 8, padding: "12px 32px",
                fontSize: 16, fontFamily: "'Cairo', Arial", cursor: "pointer",
                marginRight: 12,
              }}
            >
              متابعة
            </button>
            <button
              onClick={onMenu}
              style={{
                background: "rgba(255,100,100,0.2)", color: "#ff8888",
                border: "1px solid #ff4444", borderRadius: 8, padding: "12px 24px",
                fontSize: 14, fontFamily: "'Cairo', Arial", cursor: "pointer",
              }}
            >
              القائمة الرئيسية
            </button>
          </div>
        </div>
      )}
      <div style={{
        position: "fixed", top: 12, right: 12, background: "rgba(0,0,20,0.8)",
        border: "1px solid rgba(0,136,204,0.3)", borderRadius: 8,
        padding: "4px 10px", display: "flex", gap: 8,
      }}>
        <button
          onClick={() => {
            if (stateRef.current) {
              const newPaused = !stateRef.current.paused;
              stateRef.current = { ...stateRef.current, paused: newPaused };
              setIsPaused(newPaused);
              lastTimeRef.current = 0;
            }
          }}
          style={{
            background: "none", border: "none", color: "#88aacc", cursor: "pointer",
            fontFamily: "'Cairo', Arial", fontSize: 12, padding: "2px 6px",
          }}
          title="إيقاف مؤقت (P)"
        >
          {isPaused ? "▶" : "⏸"}
        </button>
        <button
          onClick={onMenu}
          style={{
            background: "none", border: "none", color: "#88aacc", cursor: "pointer",
            fontFamily: "'Cairo', Arial", fontSize: 12, padding: "2px 6px",
          }}
          title="القائمة (Esc)"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
