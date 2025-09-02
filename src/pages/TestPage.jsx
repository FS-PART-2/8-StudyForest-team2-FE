// src/pages/TestPage.jsx
import React, { useState } from "react";

// Atoms / Molecules / Organisms
import Button from "../components/atoms/Button.jsx";
import Chip from "../components/atoms/Chip.jsx";
import EmojiCounter from "../components/molecules/EmojiCounter";
import TodayHabitModal from "../components/organisms/TodayHabitModal.jsx";
import StudyPasswordModal from "../components/organisms/StudyPasswordModal.jsx";
import Card from "../components/organisms/Card.jsx";

export default function TestPage() {
  /** ------------------------------
   *  EmojiCounter demo (develop)
   *  ------------------------------ */
  const emojiData = [
    { id: 1, emoji: "👍", count: 1 },
    { id: 2, emoji: "❤️", count: 1 },
  ];

  /** ------------------------------
   *  Chip demo (develop)
   *  ------------------------------ */
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

  /** ------------------------------
   *  TodayHabitModal demo (develop)
   *  ------------------------------ */
  const [openHabitModal, setOpenHabitModal] = useState(false);
  const [items, setItems] = useState([]); // 비어 있으면 Add만 보임

  const addItem = () => setItems((prev) => [...prev, "새 습관"]);
  const deleteItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleHabitClose = () => setOpenHabitModal(false);
  const handleHabitSave = () => {
    // TODO: 저장 로직 연동
    setOpenHabitModal(false); // 저장 후 닫기
  };

  /** ------------------------------
   *  StudyPasswordModal demo (feature)
   *  ------------------------------ */
  const [openStudyModal, setOpenStudyModal] = useState(false);

  // 데모 검증: "1234"만 통과
  const verifyStudyPassword = async (pw) => pw === "1234";

  return (
    <div style={{ display: "grid", gap: "2rem", padding: "1.6rem" }}>
      <header style={{ display: "flex", gap: "1rem" }}>
        <Button variant="action" size="md" onClick={() => setOpenHabitModal(true)}>
          오늘의 습관 모달 열기
        </Button>
        <Button variant="action" size="md" onClick={() => setOpenStudyModal(true)}>
          스터디 비밀번호 모달 열기
        </Button>
      </header>

      <section>
        <h2>EmojiCounter Test</h2>
        <EmojiCounter emojiData={emojiData} />
      </section>

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
              onConfirm={(_, v) => confirmEdit(v)}
              onCancel={cancelEdit}
            />
          ))}
          <Chip variant="add" onClick={addChip} aria-label="새 칩 추가" />
          <Card preset="SOLID_GRAY" />
        </div>
      </section>

      {/* TodayHabitModal (develop) */}
      <TodayHabitModal
        open={openHabitModal}
        items={items}
        onAdd={addItem}
        onDelete={deleteItem}
        onClose={handleHabitClose}
        onSave={handleHabitSave}
      />

      {/* StudyPasswordModal (feature) */}
      <StudyPasswordModal
        isOpen={openStudyModal}
        onClose={() => setOpenStudyModal(false)}
        onVerify={verifyStudyPassword}
      />
    </div>
  );
}
