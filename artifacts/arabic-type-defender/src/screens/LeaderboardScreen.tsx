import { useEffect, useState } from "react";
import { getHighScores } from "../game/GameEngine";
import { DIFFICULTY_CONFIG } from "../game/types";

interface Props {
  onBack: () => void;
}

const difficultyLabels: Record<string, string> = {
  beginner: "المبتدئ",
  intermediate: "المتوسط",
  advanced: "المتقدم",
  survival: "البقاء",
};

export default function LeaderboardScreen({ onBack }: Props) {
  const [scores, setScores] = useState<ReturnType<typeof getHighScores>>([]);

  useEffect(() => {
    setScores(getHighScores());
  }, []);

  const clearScores = () => {
    localStorage.removeItem("arabicTypeDefender_scores");
    setScores([]);
  };

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 80% 20%, rgba(50,30,0,0.9) 0%, transparent 60%), #000008",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cairo', Arial, sans-serif",
      color: "#fff",
      padding: "24px 16px",
      overflowY: "auto",
    }}>
      <div style={{ width: "min(520px, 95vw)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: "900",
            color: "#ffd700",
            textShadow: "0 0 30px rgba(255,215,0,0.4)",
          }}>
            🏆 أفضل النتائج
          </div>
          <div style={{ color: "#887755", fontSize: 13, marginTop: 4 }}>
            أعلى 10 نقاط محفوظة محلياً
          </div>
        </div>

        <div style={{
          background: "rgba(0,10,30,0.8)",
          border: "1px solid rgba(255,215,0,0.2)",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 20,
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 40px rgba(200,150,0,0.1)",
        }}>
          {scores.length === 0 ? (
            <div style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#557799",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
              <div style={{ fontSize: 16, color: "#667788" }}>لا توجد نتائج محفوظة بعد</div>
              <div style={{ fontSize: 13, color: "#445566", marginTop: 6 }}>العب وحقق أعلى نقطة!</div>
            </div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr auto auto auto",
                gap: "8px",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(255,215,0,0.15)",
                color: "#887755",
                fontSize: 12,
                fontWeight: "700",
              }}>
                <div>#</div>
                <div>المستوى / التاريخ</div>
                <div style={{ textAlign: "center" }}>دقة</div>
                <div style={{ textAlign: "center" }}>WPM</div>
                <div style={{ textAlign: "right" }}>النقاط</div>
              </div>
              {scores.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr auto auto auto",
                    gap: "8px",
                    padding: "14px 16px",
                    borderBottom: i < scores.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    background: i === 0
                      ? "rgba(255,215,0,0.06)"
                      : i === 1
                        ? "rgba(192,192,192,0.04)"
                        : i === 2
                          ? "rgba(205,127,50,0.04)"
                          : "transparent",
                    transition: "background 0.15s",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: i < 3 ? 18 : 14, color: "#556677" }}>
                    {i < 3 ? medals[i] : `${i + 1}.`}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: i === 0 ? "#ffd700" : i === 1 ? "#cccccc" : i === 2 ? "#cd7f32" : "#aabbcc",
                    }}>
                      {difficultyLabels[s.difficulty] || s.difficulty}
                    </div>
                    <div style={{ fontSize: 11, color: "#445566" }}>{s.date}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#00cc88", textAlign: "center", fontWeight: "600" }}>
                    {s.accuracy}%
                  </div>
                  <div style={{ fontSize: 13, color: "#88aaff", textAlign: "center" }}>
                    {s.wpm}
                  </div>
                  <div style={{
                    fontSize: "clamp(14px, 3vw, 18px)",
                    fontWeight: "700",
                    color: i === 0 ? "#ffd700" : "#ffffff",
                    textAlign: "right",
                  }}>
                    {s.score.toLocaleString("ar")}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {scores.length > 0 && (
          <button
            onClick={clearScores}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(255,50,50,0.1)",
              color: "#ff6666",
              border: "1px solid rgba(255,50,50,0.25)",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "'Cairo', Arial",
              cursor: "pointer",
              marginBottom: 12,
            }}
          >
            🗑️ مسح جميع النتائج
          </button>
        )}

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #0055cc, #0099ff)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontFamily: "'Cairo', Arial",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,100,255,0.3)",
          }}
        >
          ← العودة للقائمة
        </button>
      </div>
    </div>
  );
}
