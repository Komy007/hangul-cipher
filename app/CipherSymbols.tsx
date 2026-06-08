"use client";
import { CELL_WALLS, CONSONANT, VOWEL } from "./cipher";

const SW = 3;      // stroke width
const CS = 28;     // consonant box size
const PAD = 5;     // padding

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
// X표에서 해당 방향의 대각선을 그림
// 상(top): 위쪽 두 대각선 (1개=왼쪽, 2개=왼쪽+오른쪽)
// 좌(left): 왼쪽 대각선 1개
// 우(right): 오른쪽 대각선 (1개=오른위, 2개=오른위+오른아래)
// 하(bottom): 아래쪽 두 대각선
export function VowelSVG({ jamo, size = 32 }: { jamo: string; size?: number }) {
  const info = VOWEL[jamo];
  if (!info) return null;

  const cx = size / 2, cy = size / 2;
  const r = size * 0.42;
  const d = r * 0.707; // diagonal component

  // X의 4개 끝점
  const tl: [number, number] = [cx - d, cy - d];
  const tr: [number, number] = [cx + d, cy - d];
  const bl: [number, number] = [cx - d, cy + d];
  const br: [number, number] = [cx + d, cy + d];
  const cc: [number, number] = [cx, cy];

  // region별 선 정의
  const segMap: Record<string, [number, number][][]> = {
    top:    info.count === 1
      ? [[tl, cc]]
      : [[tl, cc], [tr, cc]],
    left:   [[tl, cc]],   // ㅓ 하나
    right:  info.count === 1
      ? [[tr, cc]]
      : [[tr, cc], [br, cc]],
    bottom: info.count === 1
      ? [[bl, cc]]
      : [[bl, cc], [br, cc]],
  };

  const segs = segMap[info.region] ?? [];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {segs.map(([[ax, ay], [bx, by]], i) => (
        <line
          key={i}
          x1={ax} y1={ay} x2={bx} y2={by}
          stroke="currentColor"
          strokeWidth={SW}
          strokeLinecap="round"
        />
      ))}
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
      {/* 초성 + 중성 */}
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <ConsonantSVG jamo={cho} />
        <VowelSVG jamo={jung} />
      </span>
      {/* 종성 */}
      {jong && <ConsonantSVG jamo={jong} />}
    </span>
  );
}
