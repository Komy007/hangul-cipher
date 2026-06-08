"use client";

import { useState, useRef, useCallback } from "react";
import { decompose } from "./cipher";
import { SyllableBlock } from "./CipherSymbols";

export default function Home() {
  const [text, setText] = useState("초코");
  const resultRef = useRef<HTMLDivElement>(null);

  const syllables = [...text].map((ch) => {
    const d = decompose(ch);
    return d ? { ...d, original: ch } : { original: ch, cho: null };
  });

  // PNG 저장
  const handleSave = useCallback(async () => {
    const el = resultRef.current;
    if (!el) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        backgroundColor: "#ffffff",
        scale: 3,
      });
      const link = document.createElement("a");
      link.download = `cipher_${text}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("저장 기능을 사용하려면 html2canvas 패키지가 필요합니다.");
    }
  }, [text]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f7f4ef 0%, #ede8df 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      {/* 헤더 */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 300,
            letterSpacing: 8,
            color: "#1a1208",
            margin: 0,
          }}
        >
          格子 暗號
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#9a8a70",
            marginTop: 6,
            letterSpacing: 2,
          }}
        >
          한글 → 격자·X표 암호 기호
        </p>
      </div>

      {/* 입력 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 36px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 520,
          marginBottom: 24,
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: 11,
            letterSpacing: 3,
            color: "#9a8a70",
            marginBottom: 10,
          }}
        >
          한글 입력
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="한글을 입력하세요"
          maxLength={30}
          style={{
            width: "100%",
            border: "none",
            borderBottom: "2px solid #1a1208",
            background: "transparent",
            fontSize: 32,
            color: "#1a1208",
            outline: "none",
            padding: "4px 0 8px",
            fontFamily: "'Noto Sans KR', sans-serif",
            letterSpacing: 6,
          }}
        />
      </div>

      {/* 결과 */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "36px 40px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 520,
          marginBottom: 16,
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: 11,
            letterSpacing: 3,
            color: "#9a8a70",
            marginBottom: 20,
          }}
        >
          암호 기호
        </label>

        {/* 원문 */}
        <div
          style={{
            fontSize: 28,
            letterSpacing: 10,
            color: "#1a1208",
            marginBottom: 24,
            minHeight: 36,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          {text || <span style={{ color: "#ddd" }}>—</span>}
        </div>

        {/* 기호 출력 영역 */}
        <div
          ref={resultRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            minHeight: 80,
            padding: "20px 16px",
            background: "#faf8f5",
            borderRadius: 10,
            color: "#1a1208",
          }}
        >
          {syllables.length === 0 ? (
            <span style={{ color: "#ccc", fontSize: 14 }}>변환 결과</span>
          ) : (
            syllables.map((s, i) =>
              s.cho ? (
                <SyllableBlock
                  key={i}
                  cho={s.cho!}
                  jung={(s as any).jung}
                  jong={(s as any).jong}
                />
              ) : (
                <span
                  key={i}
                  style={{ fontSize: 28, margin: "0 4px" }}
                >
                  {s.original}
                </span>
              )
            )
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          background: "#1a1208",
          color: "#f7f4ef",
          border: "none",
          borderRadius: 10,
          padding: "12px 32px",
          fontSize: 14,
          letterSpacing: 2,
          cursor: "pointer",
          fontFamily: "'Noto Sans KR', sans-serif",
          marginBottom: 40,
        }}
      >
        PNG 저장
      </button>

      {/* 암호표 범례 */}
      <details
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "16px 24px",
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          cursor: "pointer",
        }}
      >
        <summary
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: "#9a8a70",
            userSelect: "none",
          }}
        >
          암호표 원리 보기
        </summary>
        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "#6a5a48",
            lineHeight: 2,
          }}
        >
          <b>자음</b>: 3×3 격자에서 해당 칸의 벽(선)을 그대로 사용
          <br />
          점(·) 추가 = 두 번째 음가 (ㄱ→ㄴ, ㄷ→ㄹ, ㅅ→ㅇ …)
          <br />
          <br />
          <b>모음 X표</b>
          <br />
          상: ㅓ(선1) / ㅕ(선2) &nbsp;|&nbsp; 좌: ㅓ
          <br />
          우: ㅗ(선1) / ㅛ(선2) &nbsp;|&nbsp; 하: ㅜ(선1) / ㅠ(선2)
          <br />
          <br />
          ㅏ·ㅑ: 격자 3행 해당 칸 벽 사용 (이미지1 빨간글씨)
        </div>
      </details>
    </main>
  );
}
