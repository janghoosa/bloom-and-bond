import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "fs";

const W = 1200;
const H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// Background gradient
const grad = ctx.createLinearGradient(0, 0, W * 0.8, H);
grad.addColorStop(0, "#fff6fb");
grad.addColorStop(0.55, "#ffe6f2");
grad.addColorStop(1, "#ffd0e5");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, W, H);

// BLOOM & BOND
ctx.fillStyle = "#d24f95";
ctx.font = "bold 36px sans-serif";
ctx.textBaseline = "top";
ctx.fillText("BLOOM & BOND", 80, 80);

// Main title
ctx.fillStyle = "#251822";
ctx.font = "900 96px sans-serif";
ctx.fillText("벚꽃 아래서,", 80, 180);
ctx.fillText("서로를 읽는 법", 80, 300);

// Subtitle
ctx.fillStyle = "#6f5564";
ctx.font = "36px sans-serif";
ctx.fillText("MBTI + 애착유형 검사", 80, 450);

// URL
ctx.fillStyle = "#d24f95";
ctx.font = "600 24px sans-serif";
ctx.fillText("bloom-and-bond.pages.dev", 80, 550);

const buffer = canvas.toBuffer("image/png");
writeFileSync("public/og-image.png", buffer);
console.log("✅ public/og-image.png generated");
