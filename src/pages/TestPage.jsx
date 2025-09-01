import React, { useState } from "react";
import EmojiCounter from "../components/molecules/EmojiCounter";
import Chip from "../components/atoms/Chip.jsx";

export default function TestPage() {
  // EmojiCounter 테스트
  const emojiData = [
    { id: 1, emoji: "👍", count: 1 },
    { id: 2, emoji: "❤️", count: 1 },
  ];

  // Chip 테스트 상태
  const [chips, setChips] = useState([
    { id: "1", label: "미라클모닝 6시 기상", selected: false },
    { id: "2", label: "운동 30분", selected: false },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (id) => {
    const cur = chips.find((c) => c.id === id);
    setEditingId(id);
    setDraft(cur ? cur.label : "");
    setChips((prev) => prev.map((c) => ({ ...c, selected: c.id === id })));
  };

  const confirmEdit = (nextLabel) => {
    if (!editingId) return;
    const text = (nextLabel ?? draft ?? "").trim();
    setChips((prev) =>
      prev.map((c) =>
        c.id === editingId ? { ...c, label: text || c.label } : c
      )
    );
    setEditingId(null);
    setDraft("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const addChip = () => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `id_${Date.now()}`;
    setEditingId(id);
    setDraft("새 습관");
    setChips((prev) => [
      ...prev.map((c) => ({ ...c, selected: false })),
      { id, label: "새 습관", selected: true },
    ]);
  };

  // 테스트용 삭제(모달 붙이기 전까지는 실제 제거로 확인)
  const removeChip = (id) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft("");
    }
  };

  return (
    <div style={{ display: "grid", gap: "2rem", padding: "1.6rem" }}>
      <section>
        <h2>EmojiCounter Test</h2>
        <EmojiCounter emojiData={emojiData} />
      </section>

      <section>
        <h2>Chip Test (center + delete, gap 8px)</h2>

        {/* 칩 리스트 */}
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {chips.map((c) => (
            /* 칩+삭제를 한 덩어리로 가운데 배치 */
            <div
              key={c.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.8rem", // 칩–삭제 간격 8px
                width: "100%",
              }}
            >
              <Chip
                label={c.label}
                selected={c.selected}
                editing={editingId === c.id}
                onClick={() => startEdit(c.id)}
                onChange={(v) => setDraft(v)}
                onConfirm={(_, v) => confirmEdit(v)}
                onCancel={cancelEdit}
              />

              {/* 오른쪽 삭제 버튼 (칩과 8px 간격만) */}
              <button
                type="button"
                onClick={() => removeChip(c.id)}
                aria-label="삭제"
                title="삭제"
                style={{
                  width: "4rem",
                  height: "4rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  background: "var(--background-neutral, #EEE)",
                  color: "var(--warning-red, #dc2626)",
                }}
              >
                <img
                  src="/assets/icons/delete.svg" // public 기준
                  alt=""
                  aria-hidden="true"
                  style={{ width: "2rem", height: "2rem", pointerEvents: "none" }}
                />
              </button>
            </div>
          ))}

          {/* 추가용 칩도 가운데 */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Chip variant="add" onClick={addChip} aria-label="새 칩 추가" />
          </div>
        </div>
      </section>
    </div>
  );
}
