import { buildCombinedInsight } from "./assessment";

export const shareProfiles = {
  secure: {
    label: "편안하게 스며드는 타입",
    quote: "가까워지는 속도가 과하지 않아\n함께 있으면 마음이 놓이는 사람",
    publicAttachmentLabel: "안정적으로 연결되는 타입",
    gradient: ["#fff7fb", "#ffe3ee", "#ff9fc2"],
  },
  anxious: {
    label: "마음을 오래 들여다보는 타입",
    quote: "작은 온도 차이도 그냥 넘기지 않고\n관계를 세심하게 살피는 사람",
    publicAttachmentLabel: "마음을 세심하게 읽는 타입",
    gradient: ["#fff1f8", "#ffcde4", "#ff6fb2"],
  },
  avoidant: {
    label: "천천히 가까워지는 타입",
    quote: "마음이 열리는 순간은 느릴 수 있지만\n한 번 닿으면 깊게 이어지는 사람",
    publicAttachmentLabel: "천천히 가까워지는 타입",
    gradient: ["#fff8fc", "#f5deeb", "#d48ab2"],
  },
  fearful: {
    label: "조심스럽게 마음을 여는 타입",
    quote: "가까워지는 일에 신중하지만\n그래서 더 진심이 오래 남는 사람",
    publicAttachmentLabel: "신중하게 마음을 여는 타입",
    gradient: ["#fff0f7", "#ffcadf", "#ff5ea6"],
  },
};

export const coupleGradientColors = {
  secure: { start: "#fff7fb", mid: "#ffe3ee", end: "#ff9fc2" },
  anxious: { start: "#fff1f8", mid: "#ffcde4", end: "#ff6fb2" },
  avoidant: { start: "#fff8fc", mid: "#f5deeb", end: "#d48ab2" },
  fearful: { start: "#fff0f7", mid: "#ffcadf", end: "#ff5ea6" },
};

export function getMbtiVisual(type) {
  const intuitive = type[1] === "N";
  const thinking = type[2] === "T";
  return {
    accent: intuitive ? "#d94f98" : "#cc5d98",
    accentSoft: thinking ? "rgba(182, 93, 138, 0.18)" : "rgba(255, 134, 184, 0.2)",
  };
}

function normalizeAttachmentScore(value) {
  return Math.max(0, Math.min(1, ((value ?? 3) - 1) / 4));
}

function getGradientGeometry(attachment, width, height) {
  const anxiety = normalizeAttachmentScore(attachment.anxietyValue ?? Number(attachment.anxiety));
  const avoidance = normalizeAttachmentScore(attachment.avoidanceValue ?? Number(attachment.avoidance));

  switch (attachment.key) {
    case "anxious":
      return {
        start: [width * (0.5 - avoidance * 0.12), height * (0.24 - anxiety * 0.2)],
        end: [width * (0.48 + avoidance * 0.4), height * (0.72 + avoidance * 0.24)],
      };
    case "avoidant":
      return {
        start: [width * (0.06 + anxiety * 0.18), height * (0.18 + anxiety * 0.2)],
        end: [width * (0.72 + avoidance * 0.24), height * (0.52 + avoidance * 0.28)],
      };
    case "fearful":
      return {
        start: [width * (0.48 - anxiety * 0.1), height * (0.2 - anxiety * 0.12)],
        end: [width * (0.38 + avoidance * 0.3), height * (0.76 + avoidance * 0.2)],
      };
    default:
      return {
        start: [width * (0.14 + anxiety * 0.08), height * (0.1 + anxiety * 0.08)],
        end: [width * (0.74 + avoidance * 0.14), height * (0.78 + avoidance * 0.12)],
      };
  }
}

export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = words[i];
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, lineY);
  }
}

// --- Geometric Shape System ---
// secure: 원 (안정, 조화)
// anxious: 다이아몬드 (예민한 감도)
// avoidant: 육각형 (보호벽, 구조)
// fearful: 별 (복합적, 다면적)

const SHAPE_COLORS = {
  secure: { fill: "rgba(255, 159, 194, 0.25)", stroke: "#ff9fc2" },
  anxious: { fill: "rgba(255, 111, 178, 0.25)", stroke: "#ff6fb2" },
  avoidant: { fill: "rgba(212, 138, 178, 0.25)", stroke: "#d48ab2" },
  fearful: { fill: "rgba(255, 94, 166, 0.25)", stroke: "#ff5ea6" },
};

function drawGeometricShape(ctx, key, cx, cy, size) {
  const colors = SHAPE_COLORS[key] ?? SHAPE_COLORS.secure;

  ctx.save();
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 4;

  ctx.beginPath();
  switch (key) {
    case "secure": {
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      break;
    }
    case "anxious": {
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.75, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size * 0.75, cy);
      ctx.closePath();
      break;
    }
    case "avoidant": {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case "fearful": {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i - Math.PI / 2;
        const r = i % 2 === 0 ? size : size * 0.5;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
  }
  ctx.fill();
  ctx.stroke();

  // inner decorative ring
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export async function drawResultCard(result) {
  const profile = shareProfiles[result.attachment.key] ?? shareProfiles.secure;
  const combined = result.combined?.points ? result.combined : buildCombinedInsight(result.mbti, result.attachment);
  const visual = getMbtiVisual(result.mbti.type);
  const displayHost = typeof window !== "undefined" ? window.location.host : "bloom-and-bond.pages.dev";
  const W = 1080;
  const H = 1440;
  const PAD = 84;

  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const geometry = getGradientGeometry(result.attachment, W, H);
  const grad = ctx.createLinearGradient(...geometry.start, ...geometry.end);
  grad.addColorStop(0, profile.gradient[0]);
  grad.addColorStop(0.58, profile.gradient[1]);
  grad.addColorStop(1, profile.gradient[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "top";

  // Brand
  ctx.fillStyle = visual.accent;
  ctx.font = "400 32px Jua";
  ctx.fillText("BLOOM & BOND", PAD, PAD);

  // Geometric shape (center)
  drawGeometricShape(ctx, result.attachment.key, W / 2, 360, 160);

  // MBTI type (large, centered)
  ctx.fillStyle = "#251822";
  ctx.font = "400 180px Jua";
  ctx.textAlign = "center";
  ctx.fillText(result.mbti.type, W / 2, 540);

  // Attachment label
  ctx.font = "400 48px Jua";
  ctx.fillStyle = visual.accent;
  ctx.fillText(profile.label, W / 2, 740);

  // Quote
  ctx.fillStyle = "#6f5564";
  ctx.font = "400 40px Pretendard, sans-serif";
  const lines = profile.quote.split("\n");
  ctx.fillText(`\u201C${lines[0]}`, W / 2, 840);
  if (lines[1]) {
    ctx.fillText(`${lines[1]}\u201D`, W / 2, 896);
  }

  // Key point (just one for cleaner look)
  if (combined.points?.[0]) {
    ctx.fillStyle = "#251822";
    ctx.font = "400 34px Pretendard, sans-serif";
    wrapTextCentered(ctx, combined.points[0], W / 2, 1000, W - PAD * 2, 48);
  }

  // URL footer
  ctx.textAlign = "left";
  ctx.fillStyle = visual.accent;
  ctx.font = "400 28px Jua";
  ctx.fillText(displayHost, PAD, H - PAD - 8);

  return canvasToBlob(canvas);
}

function wrapTextCentered(ctx, text, cx, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, cx, lineY);
      line = words[i];
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, cx, lineY);
  }
}

export async function drawCoupleCard(result, partnerResult, insight) {
  const displayHost = typeof window !== "undefined" ? window.location.host : "bloom-and-bond.pages.dev";
  const W = 1080;
  const H = 1440;
  const PAD = 84;

  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Blended gradient
  const myColors = coupleGradientColors[result.attachment.key] ?? coupleGradientColors.secure;
  const partnerColors = coupleGradientColors[partnerResult.attachment.key] ?? coupleGradientColors.secure;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, myColors.start);
  grad.addColorStop(0.3, myColors.mid);
  grad.addColorStop(0.7, partnerColors.mid);
  grad.addColorStop(1, partnerColors.end);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "top";

  // Brand
  ctx.fillStyle = "#d94f98";
  ctx.font = "400 32px Jua";
  const brandText = "BLOOM & BOND";
  const brandWidth = ctx.measureText(brandText).width;
  ctx.fillText(brandText, PAD, PAD);
  ctx.fillText("MATCH VIEW", PAD + brandWidth + 20, PAD);

  // Two geometric shapes side by side
  drawGeometricShape(ctx, result.attachment.key, W * 0.3, 280, 110);
  drawGeometricShape(ctx, partnerResult.attachment.key, W * 0.7, 280, 110);

  // MBTI types
  ctx.fillStyle = "#251822";
  ctx.font = "400 120px Jua";
  ctx.textAlign = "center";
  ctx.fillText(result.mbti.type, W * 0.3, 410);
  ctx.fillText(partnerResult.mbti.type, W * 0.7, 410);

  // Ampersand
  ctx.fillStyle = "#d94f98";
  ctx.font = "400 52px Jua";
  ctx.fillText("&", W / 2, 450);

  // Match keyword
  ctx.fillStyle = "#251822";
  ctx.font = "400 44px Jua";
  ctx.fillText(insight.matchKeyword, W / 2, 580);

  ctx.textAlign = "left";

  // Sections
  const sectionY = [660, 860, 1060];
  const sectionLabels = ["잘 맞는 점", "엇갈리기 쉬운 점", "대화 팁"];

  sectionLabels.forEach((label, i) => {
    if (!insight.sections[i]) return;
    ctx.fillStyle = "#d94f98";
    ctx.font = "400 26px Jua";
    ctx.fillText(label, PAD, sectionY[i]);

    ctx.fillStyle = "#251822";
    ctx.font = "400 32px Pretendard, sans-serif";
    wrapText(ctx, insight.sections[i].body, PAD, sectionY[i] + 38, W - PAD * 2, 42);
  });

  // URL footer
  ctx.fillStyle = "#d94f98";
  ctx.font = "400 28px Jua";
  ctx.fillText(displayHost, PAD, H - PAD - 8);

  return canvasToBlob(canvas);
}
