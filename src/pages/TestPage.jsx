import React, { useState } from "react";
import EmojiCounter from "../components/molecules/EmojiCounter";
import Chip from "../components/atoms/Chip.jsx";

export default function TestPage() {
  // ---- 기존 EmojiCounter 테스트 ----
  const emojiData = [
    { id: 1, emoji: "👍", count: 1 },
    { id: 2, emoji: "❤️", count: 1 },
  ];

  // ---- Chip 테스트용 상태 ----
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
    setChips((prev) =>
      prev.map((c) => ({ ...c, selected: c.id === id }))
    );
  };

  const confirmEdit = () => {
    if (!editingId) return;
    const text = (draft || "").trim();
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
    const id = `id_${Date.now()}`;
    setEditingId(id);
    setDraft("새 습관");
    setChips((prev) => [
      ...prev.map((c) => ({ ...c, selected: false })),
      { id, label: "새 습관", selected: true },
    ]);
  };

  return (
    <div style={{ display: "grid", gap: "2rem", padding: "1.6rem" }}>
      {/* 기존 EmojiCounter */}
      <section>
        <h2>EmojiCounter Test</h2>
        <EmojiCounter emojiData={emojiData} />
      </section>

      {/* 새로운 Chip 샌드박스 */}
      <section>
        <h2>Chip Test</h2>
        <div style={{ display: "grid", gap: "0.8rem" }}>
          {chips.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              selected={c.selected}
              editing={editingId === c.id}
              onClick={() => startEdit(c.id)}
              onChange={(v) => setDraft(v)}
              onConfirm={confirmEdit}
              onCancel={cancelEdit}
            />
          ))}
          {/* 추가용 칩 */}
          <Chip variant="add" onClick={addChip} />
        </div>
      </section>
    </div>
  );
}
