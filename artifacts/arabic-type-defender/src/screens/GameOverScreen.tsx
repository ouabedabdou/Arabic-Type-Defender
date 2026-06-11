import { useEffect, useState } from "react";
import { GameState, Difficulty, DIFFICULTY_CONFIG } from "../game/types";

interface Props {
  gameState: GameState;
  onRestart: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({ gameState, onRestart, onMenu }: Props) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const elapsed = gameState.elapsed / 1000;
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  const wpm = elapsed > 0 ? Math.round((gameState.correctWords / (elapsed / 60))) : 0;
  const accuracy = gameState.totalChars > 0
    ? Math.round((gameState.correctChars / gameState.totalChars) * 100)
    : 100;
  const diffLabel = DIFFICULTY_CONFIG[gameState.difficulty].label;

  const getGrade = () => {
    if (accuracy >= 95 && wpm >= 30) return { grade: "S", color: "#ffd700", label: "استثنائي!" };
    if (accuracy >= 90 && wpm >= 20) return { grade: "A", color: "#00ff88", label: "ممتاز!" };
    if (accuracy >= 80) return { grade: "B", color: "#00ccff", label: "جيد جداً" };
    if (accuracy >= 70) return { grade: "C", color: "#ff9900", label: "جيد" };
    return { grade: "D", color: "#ff4444", label: "تحتاج تدريب" };
  };

  const { grade, color, label } = getGrade();

  const stats = [
    { label: "النقاط الإجمالية", value: gameState.score.toLocaleString("ar"), icon: "⭐" },
    { label: "أعلى تتالي", value: `×${gameState.maxCombo}`, icon: "🔥" },
    { label: "الكلمات المكتملة", value: gameState.correctWords, icon: "✅" },
    { label: "الأخطاء", value: gameState.errors, icon: "❌" },
    { label: "الدقة", value: `${accuracy}%`, icon: "🎯" },
    { label: "السرعة (WPM)", value: wpm, icon: "⚡" },
    { label: "الوقت", value: `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`, icon: "⏱" },
    { label: "المستوى", value: diffLabel, icon: "🎮" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at center, rgba(20,0,60,0.95) 0%, #000008 70%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
      color: "#fff",
      padding: "20px",
      overflowY: "auto",
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.6s ease",
        width: "min(520px, 95vw)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "clamp(28px, 6vw, 48px)",
          fontWeight: "900",
          color: "#ff4444",
          textShadow: "0 0 30px rgba(255,60,60,0.6)",
          marginBottom: 6,
        }}>
          💥 انتهت اللعبة
        </div>
        <div style={{ color: "#ff8888", fontSize: 14, marginBottom: 24, opacity: 0.8 }}>
          {gameState.lives <= 0 ? "نفدت حياتك. العب مرة أخرى!" : "لعبت بشكل رائع!"}
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 24,
        }}>
          <div style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}33, transparent)`,
            border: `3px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: "900",
            color,
            boxShadow: `0 0 30px ${color}66`,
            marginBottom: 8,
          }}>
            {grade}
          </div>
          <div style={{ color, fontSize: 16, fontWeight: "700" }}>{label}</div>
        </div>

        <div style={{
          background: "rgba(0,10,30,0.8)",
          border: "1px solid rgba(0,136,204,0.3)",
          borderRadius: 16,
          padding: "20px",
          marginBottom: 20,
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 40px rgba(0,80,200,0.15)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}>
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: "clamp(14px, 3vw, 20px)", fontWeight: "700", color: "#00eeff" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#8899aa", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <button
            onClick={onRestart}
            onMouseEnter={() => setHovered("restart")}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #0055cc, #0099ff)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 18,
              fontFamily: "'Cairo', Arial",
              fontWeight: "700",
              cursor: "pointer",
              transition: "transform 0.15s",
              transform: hovered === "restart" ? "scale(1.02)" : "scale(1)",
              boxShadow: "0 4px 25px rgba(0,100,255,0.3)",
            }}
          >
            🔄 العب مرة أخرى
          </button>
          <button
            onClick={onMenu}
            onMouseEnter={() => setHovered("menu")}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: "14px",
              background: "rgba(255,255,255,0.06)",
              color: "#aaccff",
              border: "1px solid rgba(100,150,255,0.25)",
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "'Cairo', Arial",
              cursor: "pointer",
              transition: "all 0.15s",
              transform: hovered === "menu" ? "scale(1.01)" : "scale(1)",
            }}
          >
            🏠 القائمة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
