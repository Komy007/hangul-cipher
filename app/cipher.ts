// ═══════════════════════════════════════════════════════
// 암호표 데이터 (이미지 원본 기준)
// ═══════════════════════════════════════════════════════

// 자음 격자 3×3
// 칸 번호:
//  [0]ㄱㄴ | [1]ㄷㄹ | [2]ㅁㅂ
//  [3]ㅅㅇ | [4]ㅈㅊ | [5]ㅋㅌ
//  [6]ㅍㅎ | [7]ㅏ♥  | [8]ㅑ♥
//
// 각 칸의 벽 = 격자 외곽+내부 구분선에서 해당 칸에 닿는 선
export type Walls = {
  top: boolean; right: boolean; bottom: boolean; left: boolean;
};

export const CELL_WALLS: Record<number, Walls> = {
  0: { top: true,  right: false, bottom: false, left: true  }, // ㄱ/ㄴ  ┌
  1: { top: true,  right: true,  bottom: false, left: true  }, // ㄷ/ㄹ  ┬
  2: { top: true,  right: true,  bottom: false, left: false }, // ㅁ/ㅂ  ┐
  3: { top: true,  right: false, bottom: true,  left: true  }, // ㅅ/ㅇ  ├
  4: { top: true,  right: true,  bottom: true,  left: true  }, // ㅈ/ㅊ  ┼
  5: { top: true,  right: true,  bottom: true,  left: false }, // ㅋ/ㅌ  ┤
  6: { top: false, right: false, bottom: true,  left: true  }, // ㅍ/ㅎ  └
  7: { top: false, right: true,  bottom: true,  left: true  }, // (ㅏ칸) ┴
  8: { top: false, right: true,  bottom: true,  left: false }, // (ㅑ칸) ┘
};

export type ConsonantInfo = { cell: number; dot: boolean };
export const CONSONANT: Record<string, ConsonantInfo> = {
  ㄱ: { cell: 0, dot: false },
  ㄴ: { cell: 0, dot: true  },
  ㄷ: { cell: 1, dot: false },
  ㄹ: { cell: 1, dot: true  },
  ㅁ: { cell: 2, dot: false },
  ㅂ: { cell: 2, dot: true  },
  ㅅ: { cell: 3, dot: false },
  ㅇ: { cell: 3, dot: true  },
  ㅈ: { cell: 4, dot: false },
  ㅊ: { cell: 4, dot: true  },
  ㅋ: { cell: 5, dot: false },
  ㅌ: { cell: 5, dot: true  },
  ㅍ: { cell: 6, dot: false },
  ㅎ: { cell: 6, dot: true  },
};

// ───────────────────────────────────────────
// 모음 X표 (이미지2 원본)
//
//  상(top):    ㅓ(1개선) / ㅕ(2개선)
//  좌(left):   ㅓ(1개선)  ← 상의 ㅓ와 같은 모양, 중복 허용
//  우(right):  ㅗ(1개선) / ㅛ(2개선)
//  하(bottom): ㅜ(1개선) / ㅠ(2개선)
//
//  이미지1 격자 3행 빨간색:
//  7번칸(ㅏ위치) → 격자벽 그대로 + 모음 ㅏ 표기
//  8번칸(ㅑ위치) → 격자벽 그대로 + 모음 ㅑ 표기
// ───────────────────────────────────────────
export type VowelRegion = "top" | "left" | "right" | "bottom";
export type VowelInfo = { region: VowelRegion; count: 1 | 2 };

export const VOWEL: Record<string, VowelInfo> = {
  // 이미지1 격자 3행 빨간글씨 위치 (ㅏ, ㅑ) → X표에는 없고 격자 칸으로만 표현
  // 이미지2 X표
  ㅓ: { region: "top",    count: 1 },
  ㅕ: { region: "top",    count: 2 },
  // 좌: ㅓ 하나 (중복 — region:"left", count:1 → 위와 동일 기호)
  ㅗ: { region: "right",  count: 1 },
  ㅛ: { region: "right",  count: 2 },
  ㅜ: { region: "bottom", count: 1 },
  ㅠ: { region: "bottom", count: 2 },
  // ㅏ, ㅑ는 격자 7·8번 칸 위치 → 별도 처리
  ㅏ: { region: "top",    count: 1 }, // 실제론 격자칸 기호 사용 (아래 참조)
  ㅑ: { region: "top",    count: 2 },
};

// ───────────────────────────────────────────
// 한글 분해
// ───────────────────────────────────────────
const CHO_LIST  = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG_LIST = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const JONG_LIST = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

export type Syllable = { cho: string; jung: string; jong: string | null };

export function decompose(ch: string): Syllable | null {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null;
  const j = code % 28;
  const u = Math.floor((code - j) / 28) % 21;
  const c = Math.floor(code / 28 / 21);
  return {
    cho:  CHO_LIST[c],
    jung: JUNG_LIST[u],
    jong: JONG_LIST[j] || null,
  };
}
