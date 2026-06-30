const FRAME_SIZE = 800;

function drawBulb(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  brightness: number
) {
  const cx = width / 2;
  const bulbCenterY = height * 0.35;
  const bulbRadius = width * 0.22;

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  const bulbGrad = ctx.createRadialGradient(cx, bulbCenterY, 0, cx, bulbCenterY, bulbRadius * 0.9);
  if (brightness > 0) {
    const intensity = Math.min(1, brightness * 1.5);
    bulbGrad.addColorStop(0, `rgba(255, 240, 200, ${intensity * 0.3})`);
    bulbGrad.addColorStop(0.4, `rgba(255, 220, 150, ${intensity * 0.2})`);
    bulbGrad.addColorStop(0.7, `rgba(255, 200, 100, ${intensity * 0.1})`);
    bulbGrad.addColorStop(1, 'rgba(255, 180, 80, 0)');
  } else {
    bulbGrad.addColorStop(0, 'rgba(30, 30, 35, 0.2)');
    bulbGrad.addColorStop(1, 'rgba(10, 10, 15, 0)');
  }
  ctx.fillStyle = bulbGrad;

  ctx.beginPath();
  ctx.ellipse(cx, bulbCenterY, bulbRadius, bulbRadius * 1.3, 0, 0, Math.PI * 2);
  ctx.fill();

  const glassGrad = ctx.createRadialGradient(cx - bulbRadius * 0.2, bulbCenterY - bulbRadius * 0.3, 0, cx, bulbCenterY, bulbRadius);
  glassGrad.addColorStop(0, `rgba(255, 255, 255, ${0.03 + brightness * 0.04})`);
  glassGrad.addColorStop(0.3, `rgba(255, 255, 255, ${0.01 + brightness * 0.02})`);
  glassGrad.addColorStop(0.7, `rgba(100, 100, 120, ${0.02 + brightness * 0.01})`);
  glassGrad.addColorStop(1, `rgba(50, 50, 70, ${0.05 + brightness * 0.02})`);

  ctx.beginPath();
  ctx.ellipse(cx, bulbCenterY, bulbRadius, bulbRadius * 1.3, 0, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(180, 170, 160, ${0.15 + brightness * 0.1})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = glassGrad;
  ctx.fill();

  const filamentStartY = bulbCenterY + bulbRadius * 0.2;
  const filamentEndY = bulbCenterY + bulbRadius * 0.7;
  const filamentWidth = bulbRadius * 0.15;

  const glowIntensity = brightness;
  const r = Math.round(255 - 100 * (1 - brightness));
  const g = Math.round(200 + 55 * brightness);
  const b = Math.round(80 + 175 * brightness);

  for (let leg = -1; leg <= 1; leg += 2) {
    ctx.beginPath();
    const endX = cx + leg * filamentWidth * 1.8;

    const filamentColor = `rgb(${r}, ${g}, ${b})`;
    ctx.strokeStyle = filamentColor;
    ctx.lineWidth = 1.5 + glowIntensity * 1.5;
    ctx.moveTo(cx + leg * filamentWidth * 0.5, filamentStartY + (leg === -1 ? 0 : filamentWidth * 0.3));

    ctx.quadraticCurveTo(
      endX, (filamentStartY + filamentEndY) / 2,
      cx + leg * filamentWidth * 0.3, filamentEndY + filamentWidth * 0.5
    );
    ctx.stroke();

    if (glowIntensity > 0.1) {
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${glowIntensity * 0.6})`;
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  const crossX = cx + (Math.random() - 0.5) * filamentWidth * 0.3;
  const crossY = (filamentStartY + filamentEndY) / 2 + (Math.random() - 0.5) * filamentWidth * 0.2;
  ctx.beginPath();
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.lineWidth = 1 + glowIntensity;
  ctx.moveTo(crossX - filamentWidth * 0.3, crossY - filamentWidth * 0.1);
  ctx.lineTo(crossX + filamentWidth * 0.3, crossY + filamentWidth * 0.1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(crossX + filamentWidth * 0.3, crossY - filamentWidth * 0.1);
  ctx.lineTo(crossX - filamentWidth * 0.3, crossY + filamentWidth * 0.1);
  ctx.stroke();

  const baseY = bulbCenterY + bulbRadius * 1.3;
  ctx.fillStyle = '#3A3A45';
  ctx.fillRect(cx - bulbRadius * 0.35, baseY, bulbRadius * 0.7, bulbRadius * 0.15);

  ctx.fillStyle = '#2A2A35';
  ctx.fillRect(cx - bulbRadius * 0.3, baseY + bulbRadius * 0.15, bulbRadius * 0.6, bulbRadius * 0.4);

  for (let i = 0; i < 5; i++) {
    const ringY = baseY + bulbRadius * 0.18 + i * (bulbRadius * 0.4 / 5);
    ctx.strokeStyle = '#4A4A55';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - bulbRadius * 0.28, ringY);
    ctx.lineTo(cx + bulbRadius * 0.28, ringY);
    ctx.stroke();
  }

  ctx.fillStyle = '#1A1A25';
  ctx.fillRect(cx - bulbRadius * 0.15, baseY + bulbRadius * 0.55, bulbRadius * 0.3, bulbRadius * 0.15);
}

export function generateFrame(brightness: number): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = FRAME_SIZE;
    canvas.height = FRAME_SIZE;
    const ctx = canvas.getContext('2d')!;

    drawBulb(ctx, FRAME_SIZE, FRAME_SIZE, brightness);

    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}

export async function generateAllFrames(): Promise<HTMLImageElement[]> {
  const brightnesses = [0, 0.25, 0.6, 1.0];
  return Promise.all(brightnesses.map((b) => generateFrame(b)));
}
