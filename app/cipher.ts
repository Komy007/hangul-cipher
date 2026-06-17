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
  0: { top: false, right: true,  bottom: true,  left: false }, // ㄱ/ㄴ
  1: { top: false, right: true,  bottom: true,  left: true  }, // ㄷ/ㄹ
  2: { top: false, right: false, bottom: true,  left: true  }, // ㅁ/ㅂ
  3: { top: true,  right: true,  bottom: true,  left: false }, // ㅅ/ㅇ
  4: { top: true,  right: true,  bottom: true,  left: true  }, // ㅈ/ㅊ
  5: { top: true,  right: false, bottom: true,  left: true  }, // ㅋ/ㅌ
  6: { top: true,  right: true,  bottom: false, left: false }, // ㅍ/ㅎ
  7: { top: true,  right: true,  bottom: false, left: true  }, // ㅏ
  8: { top: true,  right: false, bottom: false, left: true  }, // ㅑ
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
// 모음 X표 (이미지 원본 기준)
//
//  X표의 각 방향 = 두 대각선이 "벽(wall)"
//  두 번째 음가 = 점(dot) 추가 방식
//
//  상(top):    두 선(∧모양) = ㅓ  /  + 점 = ㅕ
//  하(bottom): 두 선(∨모양) = ㅜ  /  + 점 = ㅠ
//  우(right):  두 선(>모양) = ㅗ  /  + 점 = ㅛ
//  좌(left):   선 하나만    = ㅓ  (상의 ㅓ와 동일 기호, 중복 허용)
//
//  ㅏ, ㅑ → 격자 3행 7·8번 칸 벽으로 표현 (X표 아님)
// ───────────────────────────────────────────
export type VowelRegion = "top" | "left" | "right" | "bottom";
export type VowelInfo = { region: VowelRegion; dot: boolean };

export const VOWEL: Record<string, VowelInfo> = {
  //  ∧ (꼭짓점 위, 팔 좌하·우하) = ㅜ / +점 = ㅠ
  ㅜ: { region: "top",    dot: false },
  ㅠ: { region: "top",    dot: true  },
  //  ∨ (꼭짓점 아래, 팔 좌상·우상) = ㅓ / +점 = ㅕ
  ㅓ: { region: "bottom", dot: false },
  ㅕ: { region: "bottom", dot: true  },
  //  < (꼭짓점 왼쪽, 팔 우상·우하) = ㅗ / +점 = ㅛ
  ㅗ: { region: "left",   dot: false },
  ㅛ: { region: "left",   dot: true  },
  //  > (선 하나) = ㅡ / +점 = ㅣ
  ㅡ: { region: "right",  dot: false },
  ㅣ: { region: "right",  dot: true  },
  // ㅏ, ㅑ: 격자 7·8번 칸 벽으로 별도 처리
};

// 복합모음 → 구성 단순모음 순서 분해
export const COMPOUND_VOWEL: Record<string, string[]> = {
  ㅐ: ["ㅏ", "ㅣ"],
  ㅒ: ["ㅑ", "ㅣ"],
  ㅔ: ["ㅓ", "ㅣ"],
  ㅖ: ["ㅕ", "ㅣ"],
  ㅘ: ["ㅗ", "ㅏ"],
  ㅙ: ["ㅗ", "ㅐ"],
  ㅚ: ["ㅗ", "ㅣ"],
  ㅝ: ["ㅜ", "ㅓ"],
  ㅞ: ["ㅜ", "ㅔ"],
  ㅟ: ["ㅜ", "ㅣ"],
  ㅢ: ["ㅡ", "ㅣ"],
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
