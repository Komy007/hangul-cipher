"use client";
import { CELL_WALLS, CONSONANT, VOWEL } from "./cipher";

const SW = 2.5;
const S = 24;   // 칸 크기
const PAD = 6;  // 여백

// ─── 자음 SVG ────────────────────────────────────────────
export function ConsonantSVG({ jamo, size = S }: { jamo: string; size?: number }) {
  const info = CONSONANT[jamo];
  if (!info) return null;
  const w = CELL_WALLS[info.cell];
  const s = size;
  const total = s + PAD * 2;

  return (
    <svg
      width={total} height={total}
      viewBox={`0 0 ${total} ${total}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {/* top: PAD,PAD → PAD+s,PAD */}
      {w.top    && <line x1={PAD} y1={PAD} x2={PAD+s} y2={PAD} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {/* right: PAD+s,PAD → PAD+s,PAD+s */}
      {w.right  && <line x1={PAD+s} y1={PAD} x2={PAD+s} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {/* bottom: PAD,PAD+s → PAD+s,PAD+s */}
      {w.bottom && <line x1={PAD} y1={PAD+s} x2={PAD+s} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {/* left: PAD,PAD → PAD,PAD+s */}
      {w.left   && <line x1={PAD} y1={PAD} x2={PAD} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {/* dot: 중앙 */}
      {info.dot && <circle cx={PAD+s/2} cy={PAD+s/2} r={2.5} fill="currentColor"/>}
    </svg>
  );
}

// ─── 격자칸 벽 SVG (ㅏ, ㅑ용) ───────────────────────────
function CellWallSVG({ cell, dot = false, size = S }: { cell: number; dot?: boolean; size?: number }) {
  const w = CELL_WALLS[cell];
  const s = size;
  const total = s + PAD * 2;
  return (
    <svg
      width={total} height={total}
      viewBox={`0 0 ${total} ${total}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {w.top    && <line x1={PAD} y1={PAD} x2={PAD+s} y2={PAD} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {w.right  && <line x1={PAD+s} y1={PAD} x2={PAD+s} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {w.bottom && <line x1={PAD} y1={PAD+s} x2={PAD+s} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {w.left   && <line x1={PAD} y1={PAD} x2={PAD} y2={PAD+s} stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>}
      {dot && <circle cx={PAD+s/2} cy={PAD+s/2} r={2.5} fill="currentColor"/>}
    </svg>
  );
}

// ─── 모음 SVG ────────────────────────────────────────────
export function VowelSVG({ jamo, size = S }: { jamo: string; size?: number }) {
  if (jamo === "ㅏ") return <CellWallSVG cell={7} dot={false} size={size} />;
  if (jamo === "ㅑ") return <CellWallSVG cell={8} dot={true}  size={size} />;

  const info = VOWEL[jamo];
  if (!info) return null;

  const total = size + PAD * 2;
  const cx = total / 2;
  const cy = total / 2;
  const arm = size * 0.45;

  type Seg = { x1: number; y1: number; x2: number; y2: number };

  const shapes: Record<string, { segs: Seg[]; dotX: number; dotY: number }> = {
    // ∧ : 꼭짓점 위, 팔 좌하·우하 → ㅜ/ㅠ
    top: {
      segs: [
        { x1: cx,       y1: cy - arm * 0.7, x2: cx - arm, y2: cy + arm * 0.7 },
        { x1: cx,       y1: cy - arm * 0.7, x2: cx + arm, y2: cy + arm * 0.7 },
      ],
      dotX: cx, dotY: cy + arm * 0.15,
    },
    // ∨ : 꼭짓점 아래, 팔 좌상·우상 → ㅓ/ㅕ
    bottom: {
      segs: [
        { x1: cx,       y1: cy + arm * 0.7, x2: cx - arm, y2: cy - arm * 0.7 },
        { x1: cx,       y1: cy + arm * 0.7, x2: cx + arm, y2: cy - arm * 0.7 },
      ],
      dotX: cx, dotY: cy - arm * 0.15,
    },
    // < : 꼭짓점 왼쪽, 팔 우상·우하 → ㅗ/ㅛ
    left: {
      segs: [
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.3, y2: cy - arm },
        { x1: cx - arm * 0.7, y1: cy, x2: cx + arm * 0.3, y2: cy + arm },
      ],
      dotX: cx, dotY: cy,
    },
    // > : 선 하나 → ㅡ/ㅣ
    right: {
      segs: [
        { x1: cx + arm * 0.7, y1: cy - arm, x2: cx - arm * 0.3, y2: cy },
      ],
      dotX: cx, dotY: cy,
    },
  };

  const shape = shapes[info.region];
  if (!shape) return null;

  return (
    <svg width={total} height={total} viewBox={`0 0 ${total} ${total}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}>
      {shape.segs.map((seg, i) => (
        <line key={i}
          x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
          stroke="currentColor" strokeWidth={SW} strokeLinecap="round"/>
      ))}
      {info.dot && <circle cx={shape.dotX} cy={shape.dotY} r={2.5} fill="currentColor"/>}
    </svg>
  );
}

// ─── 음절 하나 ───────────────────────────────────────────
export function SyllableBlock({ cho, jung, jong }: {
  cho: string; jung: string; jong: string | null;
}) {
  return (
    <span style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      margin: "0 8px",
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <ConsonantSVG jamo={cho} />
        <VowelSVG jamo={jung} />
      </span>
      {jong && <ConsonantSVG jamo={jong} />}
    </span>
  );
}
