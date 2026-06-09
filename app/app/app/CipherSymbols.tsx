"use client";
import { CELL_WALLS, CONSONANT, VOWEL } from "./cipher";

const SW = 3;
const CS = 26;
const PAD = 5;

// ─── 자음 SVG (격자 칸의 벽) ────────────────────────────
export function ConsonantSVG({ jamo, size = CS }: { jamo: string; size?: number }) {
  const info = CONSONANT[jamo];
  if (!info) return null;
  const w = CELL_WALLS[info.cell];
  const s = size;

  return (
    <svg
      width={s + PAD * 2}
      height={s + PAD * 2}
      viewBox={`${-PAD} ${-PAD} ${s + PAD * 2} ${s + PAD * 2}`}
      style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}
    >
      {w.top    && <line x1={0} y1={0} x2={s} y2={0} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.right  && <line x1={s} y1={0} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.bottom && <line x1={0} y1={s} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.left   && <line x1={0} y1={0} x2={0} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {info.dot && <circle cx={s / 2} cy={s / 2} r={3} fill="currentColor" />}
    </svg>
  );
}

// ─── 모음 SVG ────────────────────────────────────────────
// ㅏ, ㅑ → 격자 7·8번 칸 벽 사용 (ConsonantSVG와 동일 방식)
// 나머지 → X표 꺾인 선 + 점
// 암호표에 없는 모음(ㅡ,ㅣ,ㅐ,ㅔ 등) → null 반환 (빈칸)
export function VowelSVG({ jamo, size = 30 }: { jamo: string; size?: number }) {

  // ㅏ → 격자 7번칸 벽 (┴ 모양)
  if (jamo === "ㅏ") {
    const w = CELL_WALLS[7];
    const s = size;
    return (
      <svg width={s + PAD * 2} height={s + PAD * 2}
        viewBox={`${-PAD} ${-PAD} ${s + PAD * 2} ${s + PAD * 2}`}
        style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}>
        {w.top    && <line x1={0} y1={0} x2={s} y2={0} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.right  && <line x1={s} y1={0} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.bottom && <line x1={0} y1={s} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.left   && <line x1={0} y1={0} x2={0} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      </svg>
    );
  }

  // ㅑ → 격자 8번칸 벽 (┘ 모양) + 점
  if (jamo === "ㅑ") {
    const w = CELL_WALLS[8];
    const s = size;
    return (
      <svg width={s + PAD * 2} height={s + PAD * 2}
        viewBox={`${-PAD} ${-PAD} ${s + PAD * 2} ${s + PAD * 2}`}
        style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}>
        {w.top    && <line x1={0} y1={0} x2={s} y2={0} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.right  && <line x1={s} y1={0} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.bottom && <line x1={0} y1={s} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        {w.left   && <line x1={0} y1={0} x2={0} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
        <circle cx={s / 2} cy={s / 2} r={3} fill="currentColor" />
      </svg>
    );
  }

  // X표 모음
  const info = VOWEL[jamo];
  if (!info) {
    return (
      <span style={{ display: "inline-block", fontSize: size * 0.8, lineHeight: "1", verticalAlign: "middle" }}>
        {jamo}
      </span>
    );
  }

  const cx = size / 2, cy = size / 2;
  const arm = size * 0.38;

  type Seg = { x1: number; y1: number; x2: number; y2: number };
  const shapes: Record<string, { segs: Seg[]; dotX: number; dotY: number }> = {
    // ∧ : 꼭짓점 위, 팔 좌하·우하 → ㅜ/ㅠ
    top: {
      segs: [
        { x1: cx,       y1: cy - arm * 0.7, x2: cx - arm, y2: cy + arm * 0.7 },
        { x1: cx,       y1: cy - arm * 0.7, x2: cx + arm, y2: cy + arm * 0.7 },
      ],
      dotX: cx, dotY: cy + arm * 0.25,
    },
    // ∨ : 꼭짓점 아래, 팔 좌상·우상 → ㅓ/ㅕ
    bottom: {
      segs: [
        { x1: cx,       y1: cy + arm * 0.7, x2: cx - arm, y2: cy - arm * 0.7 },
        { x1: cx,       y1: cy + arm * 0.7, x2: cx + arm, y2: cy - arm * 0.7 },
      ],
      dotX: cx, dotY: cy - arm * 0.25,
    },
    // < : 꼭짓점 왼쪽, 팔 우상·우하 → ㅗ/ㅛ
    left: {
      segs: [
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.3, y2: cy - arm },
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.3, y2: cy + arm },
      ],
      dotX: cx + arm * 0.1, dotY: cy,
    },
    // > : 선 하나 → ㅓ (점 무관)
    right: {
      segs: [
        { x1: cx + arm * 0.7, y1: cy - arm, x2: cx - arm * 0.3, y2: cy },
      ],
      dotX: cx - arm * 0.1, dotY: cy,
    },
  };

  const shape = shapes[info.region];
  if (!shape) return null;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}>
      {shape.segs.map((seg, i) => (
        <line key={i}
          x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
          stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />
      ))}
      {info.dot && (
        <circle cx={shape.dotX} cy={shape.dotY} r={3} fill="currentColor" />
      )}
    </svg>
  );
}

// ─── 음절 하나 ───────────────────────────────────────────
export function SyllableBlock({
  cho, jung, jong,
}: {
  cho: string; jung: string; jong: string | null;
}) {
  return (
    <span style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      margin: "0 12px",
    }}>
      {/* 초성 + 중성 */}
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ConsonantSVG jamo={cho} />
        <VowelSVG jamo={jung} />
      </span>
      {/* 종성 */}
      {jong && <ConsonantSVG jamo={jong} />}
    </span>
  );
}
