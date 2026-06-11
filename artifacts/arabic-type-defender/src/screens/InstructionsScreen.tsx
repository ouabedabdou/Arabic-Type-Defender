interface Props {
  onBack: () => void;
}

export default function InstructionsScreen({ onBack }: Props) {
  const steps = [
    {
      icon: "⌨️",
      title: "كيفية اللعب",
      text: "تنزل سفن معادية من أعلى الشاشة وعليها كلمات عربية. اكتب الكلمة الظاهرة بدقة باستخدام لوحة مفاتيح عربية لتدميرها بليزر!",
    },
    {
      icon: "🎯",
      title: "الاستهداف التلقائي",
      text: "عند كتابة أول حرف، يتم استهداف أقرب سفينة تبدأ بذلك الحرف تلقائياً. أكمل الكلمة لتدمير السفينة!",
    },
    {
      icon: "✨",
      title: "تمييز الأحرف",
      text: "الأحرف التي كتبتها بشكل صحيح تتحول للأخضر، والأحرف المتبقية تبقى بيضاء. اكمل الكلمة لإطلاق الليزر.",
    },
    {
      icon: "💥",
      title: "الحياة والخسارة",
      text: "إذا وصلت سفينة إلى أسفل الشاشة ستخسر حياة. تنتهي اللعبة عند فقدان كل الحيوات.",
    },
    {
      icon: "🔥",
      title: "مضاعف التتالي",
      text: "كل ما أكملت كلمات متتالية بشكل صحيح، يزيد مضاعف النقاط. الدقة تمنحك نقاطاً أكثر!",
    },
    {
      icon: "⏸",
      title: "الإيقاف المؤقت",
      text: "اضغط P لإيقاف اللعبة مؤقتاً أو انقر على زر الإيقاف. اضغط Escape للعودة للقائمة الرئيسية.",
    },
  ];

  const shortcuts = [
    { key: "أي حرف عربي", action: "الكتابة واستهداف السفن" },
    { key: "P", action: "إيقاف مؤقت / متابعة" },
    { key: "Escape", action: "العودة للقائمة" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 30%, rgba(30,0,80,0.9) 0%, transparent 60%), #000008",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Cairo', Arial, sans-serif",
      color: "#fff",
      padding: "24px 16px",
      overflowY: "auto",
    }}>
      <div style={{ width: "min(560px, 95vw)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            fontSize: "clamp(22px, 5vw, 34px)",
            fontWeight: "900",
            background: "linear-gradient(135deg, #00eeff, #0088ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            📖 كيفية اللعب
          </div>
          <div style={{ color: "#668899", fontSize: 13, marginTop: 4 }}>
            دليل اللعبة الكامل
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(0,10,30,0.7)",
                border: "1px solid rgba(0,136,204,0.2)",
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 28, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontWeight: "700", fontSize: 15, color: "#00ccff", marginBottom: 4 }}>
                  {s.title}
                </div>
                <div style={{ color: "#aabbcc", fontSize: 13, lineHeight: 1.6 }}>
                  {s.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: "rgba(0,10,30,0.7)",
          border: "1px solid rgba(0,136,204,0.2)",
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 24,
        }}>
          <div style={{ fontWeight: "700", fontSize: 14, color: "#00ccff", marginBottom: 12 }}>
            ⌨️ اختصارات لوحة المفاتيح
          </div>
          {shortcuts.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 0",
              borderBottom: i < shortcuts.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <code style={{
                background: "rgba(0,200,255,0.1)",
                border: "1px solid rgba(0,200,255,0.3)",
                borderRadius: 6,
                padding: "2px 10px",
                fontSize: 12,
                color: "#00eeff",
                fontFamily: "monospace",
              }}>
                {s.key}
              </code>
              <span style={{ color: "#aabbcc", fontSize: 13 }}>{s.action}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: "rgba(255,200,0,0.08)",
          border: "1px solid rgba(255,200,0,0.2)",
          borderRadius: 12,
          padding: "14px 18px",
          marginBottom: 24,
          textAlign: "center",
        }}>
          <div style={{ color: "#ffd700", fontSize: 14 }}>
            💡 نصيحة: تأكد من تفعيل لوحة المفاتيح العربية قبل اللعب!
          </div>
        </div>

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
