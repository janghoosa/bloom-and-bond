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
// MBTI 기질(temperament)이 도형을, 애착유형이 색상을 결정
//
// MBTI 기질 → 도형:
//   NT (분석가: INTJ, INTP, ENTJ, ENTP) → 삼각형 (날카로운 사고)
//   NF (외교관: INFJ, INFP, ENFJ, ENFP) → 둥근 다이아몬드 (감성, 공감)
//   SJ (관리자: ISTJ, ISFJ, ESTJ, ESFJ) → 사각형 (구조적, 안정)
//   SP (탐험가: ISTP, ISFP, ESTP, ESFP) → 원 (자유, 적응)
//
// 애착유형 → 색상:
//   secure → 따뜻한 핑크, anxious → 진한 핑크
//   avoidant → 차분한 모브, fearful → 비비드 핑크

const SHAPE_COLORS = {
  secure: { fill: "rgba(255, 159, 194, 0.25)", stroke: "#ff9fc2" },
  anxious: { fill: "rgba(255, 111, 178, 0.25)", stroke: "#ff6fb2" },
  avoidant: { fill: "rgba(212, 138, 178, 0.25)", stroke: "#d48ab2" },
  fearful: { fill: "rgba(255, 94, 166, 0.25)", stroke: "#ff5ea6" },
};

function getTemperament(mbtiType) {
  const n = mbtiType[1] === "N";
  const t = mbtiType[2] === "T";
  const j = mbtiType[3] === "J";
  if (n && t) return "NT";
  if (n && !t) return "NF";
  if (!n && j) return "SJ";
  return "SP";
}

function drawShapePath(ctx, temperament, cx, cy, size) {
  ctx.beginPath();
  switch (temperament) {
    case "NT": {
      // 삼각형 — 날카로운 사고
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.87, cy + size * 0.5);
      ctx.lineTo(cx - size * 0.87, cy + size * 0.5);
      ctx.closePath();
      break;
    }
    case "NF": {
      // 둥근 다이아몬드 — 감성, 공감
      const r = size;
      ctx.moveTo(cx, cy - r);
      ctx.quadraticCurveTo(cx + r * 0.55, cy - r * 0.55, cx + r * 0.75, cy);
      ctx.quadraticCurveTo(cx + r * 0.55, cy + r * 0.55, cx, cy + r);
      ctx.quadraticCurveTo(cx - r * 0.55, cy + r * 0.55, cx - r * 0.75, cy);
      ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.55, cx, cy - r);
      ctx.closePath();
      break;
    }
    case "SJ": {
      // 둥근 사각형 — 구조적, 안정
      const half = size * 0.82;
      const radius = size * 0.18;
      ctx.moveTo(cx - half + radius, cy - half);
      ctx.lineTo(cx + half - radius, cy - half);
      ctx.arcTo(cx + half, cy - half, cx + half, cy - half + radius, radius);
      ctx.lineTo(cx + half, cy + half - radius);
      ctx.arcTo(cx + half, cy + half, cx + half - radius, cy + half, radius);
      ctx.lineTo(cx - half + radius, cy + half);
      ctx.arcTo(cx - half, cy + half, cx - half, cy + half - radius, radius);
      ctx.lineTo(cx - half, cy - half + radius);
      ctx.arcTo(cx - half, cy - half, cx - half + radius, cy - half, radius);
      ctx.closePath();
      break;
    }
    case "SP":
    default: {
      // 원 — 자유, 적응
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      break;
    }
  }
}

function drawGeometricShape(ctx, attachmentKey, mbtiType, cx, cy, size) {
  const colors = SHAPE_COLORS[attachmentKey] ?? SHAPE_COLORS.secure;
  const temperament = mbtiType ? getTemperament(mbtiType) : "SP";

  ctx.save();

  // Outer glow
  ctx.shadowColor = colors.stroke;
  ctx.shadowBlur = size * 0.4;
  ctx.fillStyle = colors.fill;
  drawShapePath(ctx, temperament, cx, cy, size);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Gradient fill overlay
  const grad = ctx.createRadialGradient(cx, cy - size * 0.3, 0, cx, cy, size);
  grad.addColorStop(0, colors.stroke.replace(")", ", 0.35)").replace("rgb", "rgba").replace("#", ""));
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  // Use hex-to-rgba for gradient
  ctx.globalAlpha = 0.5;
  drawShapePath(ctx, temperament, cx, cy, size);
  ctx.fillStyle = colors.fill;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Stroke
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 3;
  drawShapePath(ctx, temperament, cx, cy, size);
  ctx.stroke();

  // Inner shape (decorative)
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.stroke;
  drawShapePath(ctx, temperament, cx, cy, size * 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Tiny inner dot/shape
  ctx.globalAlpha = 0.15;
  drawShapePath(ctx, temperament, cx, cy, size * 0.2);
  ctx.fillStyle = colors.stroke;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawBlossomPetal(ctx, x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "#ffcce0";
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.5, size * 0.4, 0);
  ctx.quadraticCurveTo(size * 0.2, size * 0.3, 0, size * 0.5);
  ctx.quadraticCurveTo(-size * 0.2, size * 0.3, -size * 0.4, 0);
  ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, 0, -size);
  ctx.fill();
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

  // Decorative blossom petals (scattered)
  drawBlossomPetal(ctx, 120, 180, 40, 0.3, 0.15);
  drawBlossomPetal(ctx, W - 140, 260, 32, -0.5, 0.12);
  drawBlossomPetal(ctx, 160, H - 280, 28, 0.8, 0.1);
  drawBlossomPetal(ctx, W - 100, H - 200, 36, -0.2, 0.13);
  drawBlossomPetal(ctx, W / 2 + 200, 200, 22, 1.2, 0.08);

  // Brand
  ctx.fillStyle = visual.accent;
  ctx.font = "400 32px Jua";
  ctx.fillText("BLOOM & BOND", PAD, PAD);

  // Thin accent line under brand
  ctx.strokeStyle = visual.accent;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, PAD + 46);
  ctx.lineTo(PAD + 220, PAD + 46);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Geometric shape (center, larger with glow)
  drawGeometricShape(ctx, result.attachment.key, result.mbti.type, W / 2, 340, 170);

  // MBTI type (large, centered)
  ctx.fillStyle = "#251822";
  ctx.font = "400 180px Jua";
  ctx.textAlign = "center";
  ctx.fillText(result.mbti.type, W / 2, 530);

  // Divider line
  ctx.strokeStyle = visual.accent;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 120, 730);
  ctx.lineTo(W / 2 + 120, 730);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Attachment label
  ctx.font = "400 48px Jua";
  ctx.fillStyle = visual.accent;
  ctx.fillText(profile.label, W / 2, 760);

  // Quote
  ctx.fillStyle = "#6f5564";
  ctx.font = "400 40px Pretendard, sans-serif";
  const lines = profile.quote.split("\n");
  ctx.fillText(`\u201C${lines[0]}`, W / 2, 870);
  if (lines[1]) {
    ctx.fillText(`${lines[1]}\u201D`, W / 2, 926);
  }

  // Key point (one, for clarity)
  if (combined.points?.[0]) {
    ctx.fillStyle = "#3d1f30";
    ctx.globalAlpha = 0.7;
    ctx.font = "400 34px Pretendard, sans-serif";
    wrapTextCentered(ctx, combined.points[0], W / 2, 1040, W - PAD * 2, 48);
    ctx.globalAlpha = 1;
  }

  // URL footer with accent dot
  ctx.textAlign = "center";
  ctx.fillStyle = visual.accent;
  ctx.beginPath();
  ctx.arc(W / 2, H - PAD - 40, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "400 26px Jua";
  ctx.fillText(displayHost, W / 2, H - PAD - 20);

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
  drawGeometricShape(ctx, result.attachment.key, result.mbti.type, W * 0.3, 280, 110);
  drawGeometricShape(ctx, partnerResult.attachment.key, partnerResult.mbti.type, W * 0.7, 280, 110);

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
