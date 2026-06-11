import { GameState, Enemy, Laser, Particle, Star } from "./types";

function drawStars(ctx: CanvasRenderingContext2D, stars: Star[], time: number) {
  stars.forEach(s => {
    const twinkleOpacity = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle + time * 0.001));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
    ctx.fill();
  });
}

function drawNebula(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const g1 = ctx.createRadialGradient(w * 0.2, h * 0.3, 0, w * 0.2, h * 0.3, w * 0.5);
  g1.addColorStop(0, `rgba(30, 0, 80, ${0.15 + 0.05 * Math.sin(time * 0.0003)})`);
  g1.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, w, h);

  const g2 = ctx.createRadialGradient(w * 0.8, h * 0.6, 0, w * 0.8, h * 0.6, w * 0.45);
  g2.addColorStop(0, `rgba(0, 20, 80, ${0.12 + 0.04 * Math.sin(time * 0.0005 + 1)})`);
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}

function drawPlayerShip(ctx: CanvasRenderingContext2D, x: number, y: number, time: number, shake: number) {
  ctx.save();
  const sx = shake > 0 ? (Math.random() - 0.5) * shake : 0;
  const sy = shake > 0 ? (Math.random() - 0.5) * shake : 0;
  ctx.translate(x + sx, y + sy);

  const glowRadius = 30 + 5 * Math.sin(time * 0.003);
  const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, glowRadius);
  glow.addColorStop(0, "rgba(0, 180, 255, 0.4)");
  glow.addColorStop(1, "rgba(0, 180, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(-14, 10);
  ctx.lineTo(-6, 4);
  ctx.lineTo(0, 8);
  ctx.lineTo(6, 4);
  ctx.lineTo(14, 10);
  ctx.closePath();
  const shipGrad = ctx.createLinearGradient(0, -22, 0, 10);
  shipGrad.addColorStop(0, "#00eeff");
  shipGrad.addColorStop(0.5, "#0088cc");
  shipGrad.addColorStop(1, "#004466");
  ctx.fillStyle = shipGrad;
  ctx.fill();
  ctx.strokeStyle = "#00ccff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const engineFlicker = 0.8 + 0.2 * Math.sin(time * 0.01);
  const engineGrad = ctx.createRadialGradient(0, 14, 0, 0, 14, 14 * engineFlicker);
  engineGrad.addColorStop(0, "rgba(255, 150, 0, 0.9)");
  engineGrad.addColorStop(0.5, "rgba(255, 50, 0, 0.5)");
  engineGrad.addColorStop(1, "rgba(255, 0, 0, 0)");
  ctx.fillStyle = engineGrad;
  ctx.beginPath();
  ctx.arc(0, 14, 10 * engineFlicker, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, time: number) {
  if (!enemy.active) return;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.globalAlpha = enemy.opacity;
  ctx.scale(enemy.scale, enemy.scale);

  if (enemy.exploding) {
    const prog = enemy.explosionFrame / 20;
    const r = 30 * prog;
    const expGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    expGrad.addColorStop(0, "rgba(255, 255, 200, 1)");
    expGrad.addColorStop(0.3, `rgba(255, 150, 0, ${1 - prog})`);
    expGrad.addColorStop(0.7, `rgba(255, 0, 0, ${0.8 - prog})`);
    expGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = expGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const glowR = 18 + 3 * Math.sin(time * 0.004);
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, glowR);
  glow.addColorStop(0, enemy.color + "66");
  glow.addColorStop(1, enemy.color + "00");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, glowR, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(-12, -5);
  ctx.lineTo(-6, -2);
  ctx.lineTo(0, -16);
  ctx.lineTo(6, -2);
  ctx.lineTo(12, -5);
  ctx.closePath();
  const eGrad = ctx.createLinearGradient(0, 18, 0, -16);
  eGrad.addColorStop(0, enemy.color);
  eGrad.addColorStop(1, "#fff");
  ctx.fillStyle = eGrad;
  ctx.fill();
  ctx.strokeStyle = enemy.color;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

function drawEnemyWord(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  if (!enemy.active || enemy.exploding) return;
  ctx.save();
  ctx.globalAlpha = enemy.opacity;

  const typed = enemy.word.substring(0, enemy.typedCount);
  const remaining = enemy.word.substring(enemy.typedCount);

  const fontSize = Math.min(18, Math.max(13, 22 - enemy.word.length));
  ctx.font = `bold ${fontSize}px 'Cairo', 'Amiri', 'Noto Naskh Arabic', Arial`;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const fullWidth = ctx.measureText(enemy.word).width;
  const bgPad = 8;
  ctx.fillStyle = "rgba(0,0,10,0.75)";
  ctx.beginPath();
  ctx.roundRect(enemy.x - fullWidth / 2 - bgPad, enemy.y + 24, fullWidth + bgPad * 2, fontSize + 8, 4);
  ctx.fill();

  const typedWidth = typed ? ctx.measureText(typed).width : 0;
  const baseX = enemy.x + fullWidth / 2;

  if (typed) {
    ctx.fillStyle = "#00ff88";
    ctx.fillText(typed, baseX, enemy.y + 28);
  }
  if (remaining) {
    ctx.fillStyle = "#ffffff";
    const offsetX = baseX - typedWidth;
    ctx.fillText(remaining, offsetX, enemy.y + 28);
  }

  ctx.restore();
}

function drawLaser(ctx: CanvasRenderingContext2D, laser: Laser) {
  const currentX = laser.fromX + (laser.toX - laser.fromX) * laser.progress;
  const currentY = laser.fromY + (laser.toY - laser.fromY) * laser.progress;

  ctx.save();
  ctx.globalAlpha = 1 - laser.progress * 0.3;

  ctx.shadowBlur = 12;
  ctx.shadowColor = laser.color;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(laser.fromX, laser.fromY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  ctx.strokeStyle = laser.color;
  ctx.lineWidth = 5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(laser.fromX, laser.fromY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.shadowBlur = 6;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  });
}

function drawHUD(ctx: CanvasRenderingContext2D, state: GameState, w: number, _h: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,20,0.7)";
  ctx.fillRect(0, 0, w, 52);
  ctx.strokeStyle = "rgba(0, 200, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 52);
  ctx.lineTo(w, 52);
  ctx.stroke();

  ctx.font = "bold 14px 'Cairo', Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#aad4ff";
  ctx.fillText(`النقاط: ${state.score.toLocaleString("ar")}`, 16, 22);

  ctx.textAlign = "center";
  ctx.fillStyle = state.combo >= 5 ? "#ffd700" : state.combo >= 3 ? "#ff9900" : "#88ccff";
  if (state.combo >= 2) {
    ctx.font = `bold ${Math.min(18, 12 + state.combo)}px 'Cairo', Arial`;
    ctx.fillText(`🔥 x${state.combo} تتالي`, w / 2, 20);
  } else {
    ctx.font = "14px 'Cairo', Arial";
    ctx.fillText(`المستوى ${state.difficulty === "beginner" ? "المبتدئ" : state.difficulty === "intermediate" ? "المتوسط" : state.difficulty === "advanced" ? "المتقدم" : "البقاء"}`, w / 2, 20);
  }

  const heartSize = 16;
  const totalLives = 5;
  const startX = w - 16;
  for (let i = 0; i < totalLives; i++) {
    ctx.font = `${heartSize}px serif`;
    ctx.textAlign = "right";
    ctx.globalAlpha = i < state.lives ? 1 : 0.2;
    ctx.fillStyle = i < state.lives ? "#ff4444" : "#555";
    ctx.fillText("♥", startX - i * (heartSize + 2), 22);
  }

  const elapsed = Math.floor(state.elapsed / 1000);
  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.font = "12px monospace";
  ctx.fillStyle = "#557799";
  ctx.fillText(`${mins}:${secs}`, 16, 44);

  const acc = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;
  ctx.textAlign = "center";
  ctx.fillText(`دقة: ${acc}%`, w / 2, 44);

  ctx.restore();
}

function drawInputBar(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,20,0.8)";
  ctx.fillRect(0, h - 50, w, 50);
  ctx.strokeStyle = "rgba(0, 200, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h - 50);
  ctx.lineTo(w, h - 50);
  ctx.stroke();
  ctx.font = "13px 'Cairo', Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 200, 255, 0.5)";
  ctx.fillText("اكتب الكلمة المضيئة باللوحة العربية", w / 2, h - 20);
  ctx.restore();
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  w: number,
  h: number,
  time: number
) {
  ctx.fillStyle = "#000008";
  ctx.fillRect(0, 0, w, h);

  drawNebula(ctx, w, h, time);
  drawStars(ctx, state.stars, time);

  state.lasers.forEach(l => drawLaser(ctx, l));

  state.enemies.forEach(e => {
    drawEnemy(ctx, e, time);
    drawEnemyWord(ctx, e);
  });

  drawParticles(ctx, state.particles);

  const playerX = w / 2;
  const playerY = h - 60;
  drawPlayerShip(ctx, playerX, playerY, time, state.shake);

  drawHUD(ctx, state, w, h);
  drawInputBar(ctx, w, h);
}
