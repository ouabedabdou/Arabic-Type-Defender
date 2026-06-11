import { useState, useEffect } from "react";
import { Difficulty, DIFFICULTY_CONFIG } from "../game/types";
import { getHighScores } from "../game/GameEngine";

interface Props {
  onStart: (difficulty: Difficulty) => void;
  onInstructions: () => void;
  onLeaderboard: () => void;
}

const TITLE_CHARS = "Arabic Type Defender".split("");

export default function MenuScreen({ onStart, onInstructions, onLeaderboard }: Props) {
  const [selected, setSelected] = useState<Difficulty>("beginner");
  const [hovered, setHovered] = useState<string | null>(null);
  const [topScore, setTopScore] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const scores = getHighScores();
    if (scores.length > 0) setTopScore(scores[0].score);
    const interval = setInterval(() => setTime(t => t + 1), 60);
    return () => clearInterval(interval);
  }, []);

  const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "survival"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 30%, rgba(30,0,80,0.9) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(0,20,80,0.8) 0%, transparent 60%), #000008",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
      color: "#ffffff",
      overflow: "hidden",
      position: "relative",
    }}>
      <StarField count={100} />

      <div style={{ textAlign: "center", marginBottom: 8, zIndex: 10, position: "relative" }}>
        <div style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: "900",
          background: "linear-gradient(135deg, #00eeff, #0088ff, #8844ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "1px",
          textShadow: "none",
          filter: "drop-shadow(0 0 20px rgba(0,200,255,0.4))",
          lineHeight: 1.1,
        }}>
          Arabic Type Defender
        </div>
        <div style={{
          fontSize: "clamp(14px, 2.5vw, 20px)",
          color: "#88aadd",
          marginTop: 6,
          letterSpacing: "0.5px",
        }}>
          المدافع العربي عن الكتابة
        </div>
        {topScore > 0 && (
          <div style={{
            marginTop: 10,
            padding: "4px 20px",
            background: "rgba(255,215,0,0.1)",
            border: "1px solid rgba(255,215,0,0.3)",
            borderRadius: 20,
            display: "inline-block",
            color: "#ffd700",
            fontSize: 14,
          }}>
            🏆 أعلى نقطة: {topScore.toLocaleString("ar")}
          </div>
        )}
      </div>

      <div style={{
        background: "rgba(0,10,30,0.7)",
        border: "1px solid rgba(0,136,204,0.3)",
        borderRadius: 20,
        padding: "28px 32px",
        width: "min(480px, 92vw)",
        zIndex: 10,
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 60px rgba(0,100,200,0.15), inset 0 0 40px rgba(0,0,40,0.5)",
      }}>
        <div style={{
          fontSize: 15,
          color: "#88aadd",
          textAlign: "center",
          marginBottom: 16,
          letterSpacing: "0.5px",
        }}>
          اختر مستوى الصعوبة
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {difficulties.map(d => {
            const cfg = DIFFICULTY_CONFIG[d];
            const isSelected = selected === d;
            const isSurvival = d === "survival";
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                onMouseEnter={() => setHovered(d)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isSelected
                    ? isSurvival
                      ? "linear-gradient(135deg, rgba(180,0,0,0.4), rgba(255,100,0,0.3))"
                      : "linear-gradient(135deg, rgba(0,60,160,0.6), rgba(0,100,200,0.4))"
                    : "rgba(255,255,255,0.04)",
                  border: isSelected
                    ? isSurvival ? "1px solid #ff6600" : "1px solid #0099ff"
                    : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "14px 12px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.18s ease",
                  transform: hovered === d && !isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected
                    ? isSurvival ? "0 0 20px rgba(255,100,0,0.3)" : "0 0 20px rgba(0,150,255,0.3)"
                    : "none",
                }}
              >
                <div style={{
                  fontSize: 22,
                  marginBottom: 4,
                }}>
                  {d === "beginner" ? "🌱" : d === "intermediate" ? "⚡" : d === "advanced" ? "🔥" : "💀"}
                </div>
                <div style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: isSelected
                    ? isSurvival ? "#ff8844" : "#00ccff"
                    : "#aaaacc",
                  marginBottom: 4,
                }}>
                  {cfg.label}
                </div>
                <div style={{
                  fontSize: 11,
                  color: isSelected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                  lineHeight: 1.4,
                }}>
                  {cfg.description}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onStart(selected)}
          onMouseEnter={() => setHovered("start")}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: "100%",
            padding: "16px",
            background: "linear-gradient(135deg, #0055cc, #0099ff)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontFamily: "'Cairo', Arial",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.18s ease",
            transform: hovered === "start" ? "scale(1.02)" : "scale(1)",
            boxShadow: "0 4px 30px rgba(0,100,255,0.35)",
            marginBottom: 12,
            letterSpacing: "1px",
          }}
        >
          🚀 ابدأ اللعبة
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={onInstructions}
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.05)",
              color: "#aaccff",
              border: "1px solid rgba(100,150,255,0.25)",
              borderRadius: 10,
              fontSize: 14,
              fontFamily: "'Cairo', Arial",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            📖 كيفية اللعب
          </button>
          <button
            onClick={onLeaderboard}
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.05)",
              color: "#ffd700",
              border: "1px solid rgba(255,215,0,0.25)",
              borderRadius: 10,
              fontSize: 14,
              fontFamily: "'Cairo', Arial",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            🏆 أفضل النتائج
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 20,
        color: "rgba(100,130,180,0.5)",
        fontSize: 12,
        textAlign: "center",
        zIndex: 10,
      }}>
        العب وتعلم العربية بطريقة ممتعة
      </div>
    </div>
  );
}

function StarField({ count }: { count: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.1,
    delay: Math.random() * 4,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
            animation: `twinkle ${2 + Math.random() * 3}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; }
          to { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
