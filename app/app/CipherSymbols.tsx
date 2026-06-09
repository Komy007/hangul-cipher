"use client";
import { CELL_WALLS, CONSONANT, VOWEL } from "./cipher";

const SW = 3;
const CS = 28;
const PAD = 5;

// ─── 자음 SVG ───────────────────────────────────────────
export function ConsonantSVG({ jamo, size = CS }: { jamo: string; size?: number }) {
  const info = CONSONANT[jamo];
  if (!info) return null;
  const w = CELL_WALLS[info.cell];
  const s = size;
  const vb = `${-PAD} ${-PAD} ${s + PAD * 2} ${s + PAD * 2}`;

  return (
    <svg
      width={s + PAD * 2}
      height={s + PAD * 2}
      viewBox={vb}
      style={{ display: "inline-block", verticalAlign: "middle", overflow: "visible" }}
    >
      {w.top    && <line x1={0} y1={0} x2={s} y2={0} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.right  && <line x1={s} y1={0} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.bottom && <line x1={0} y1={s} x2={s} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {w.left   && <line x1={0} y1={0} x2={0} y2={s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round" />}
      {info.dot && <circle cx={s / 2} cy={s / 2} r={3.2} fill="currentColor" />}
    </svg>
  );
}

// ─── 모음 SVG ────────────────────────────────────────────
// X표의 4방향 꺾인 선(∧ ∨ > <) + 점 유무로 음가 구분
//
//  ∧ (위 삼각형)   : 좌상→꼭짓점→우상  = ㅓ / +점 = ㅕ
//  ∨ (아래 삼각형) : 좌하→꼭짓점→우하  = ㅜ / +점 = ㅠ
//  > (오른쪽 삼각형): 우상→꼭짓점→우하  = ㅗ / +점 = ㅛ
//  < (왼쪽, 선 하나): 좌상→꼭짓점       = ㅓ (하나뿐)
//
export function VowelSVG({ jamo, size = 34 }: { jamo: string; size?: number }) {
  const info = VOWEL[jamo];
  if (!info) return null;

  const cx = size / 2;
  const cy = size / 2;
  const arm = size * 0.38; // 꼭짓점에서 끝까지 길이

  // 각 방향의 꼭짓점(tip)과 두 끝점(end1, end2)
  // ∧ : 꼭짓점=위, 두 끝=좌하·우하
  // ∨ : 꼭짓점=아래, 두 끝=좌상·우상
  // > : 꼭짓점=오른쪽, 두 끝=좌상·좌하
  // < : 꼭짓점=왼쪽, 끝=우상 하나만

  type Seg = { x1: number; y1: number; x2: number; y2: number };

  const shapes: Record<string, { segs: Seg[]; dotX: number; dotY: number }> = {
    // ∧ 모양: 꼭짓점 위, 두 팔이 좌하·우하로 → ㅜ/ㅠ
    top: {
      segs: [
        { x1: cx,       y1: cy - arm * 0.7, x2: cx - arm, y2: cy + arm * 0.7 },
        { x1: cx,       y1: cy - arm * 0.7, x2: cx + arm, y2: cy + arm * 0.7 },
      ],
      dotX: cx,
      dotY: cy + arm * 0.2,
    },
    // ∨ 모양: 꼭짓점 아래, 두 팔이 좌상·우상으로 → ㅓ/ㅕ
    bottom: {
      segs: [
        { x1: cx,       y1: cy + arm * 0.7, x2: cx - arm, y2: cy - arm * 0.7 },
        { x1: cx,       y1: cy + arm * 0.7, x2: cx + arm, y2: cy - arm * 0.7 },
      ],
      dotX: cx,
      dotY: cy - arm * 0.2,
    },
    // < 모양: 꼭짓점 왼쪽, 두 팔이 우상·우하로 → ㅗ/ㅛ
    left: {
      segs: [
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.7, y2: cy - arm },
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.7, y2: cy + arm },
      ],
      dotX: cx + arm * 0.2,
      dotY: cy,
    },
    // > 모양: 선 하나만 → ㅓ (점 무관)
    right: {
      segs: [
        { x1: cx + arm * 0.7, y1: cy - arm, x2: cx - arm * 0.7, y2: cy },
      ],
      dotX: cx - arm * 0.2,
      dotY: cy,
    },
  };

  const shape = shapes[info.region];
  if (!shape) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {shape.segs.map((seg, i) => (
        <line
          key={i}
          x1={seg.x1} y1={seg.y1}
          x2={seg.x2} y2={seg.y2}
          stroke="currentColor"
          strokeWidth={SW}
          strokeLinecap="round"
        />
      ))}
      {info.dot && (
        <circle
          cx={shape.dotX}
          cy={shape.dotY}
          r={3}
          fill="currentColor"
        />
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
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        margin: "0 10px",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ConsonantSVG jamo={cho} />
        <VowelSVG jamo={jung} />
      </span>
      {jong && <ConsonantSVG jamo={jong} />}
    </span>
  );
}
