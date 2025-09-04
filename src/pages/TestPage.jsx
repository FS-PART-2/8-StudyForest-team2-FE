// src/pages/TestPage.jsx
import React, { useState } from "react";

// Atoms / Molecules / Organisms
import Button from "../components/atoms/Button.jsx";
import Chip from "../components/atoms/Chip.jsx";
import EmojiCounter from "../components/molecules/EmojiCounter";
import TodayHabitModal from "../components/organisms/TodayHabitModal.jsx";
import StudyPasswordModal from "../components/organisms/StudyPasswordModal.jsx";
import Card from "../components/organisms/Card.jsx";
import SearchBar from "../components/molecules/SearchBar.jsx";   // 주석 해제

export default function TestPage() {
  /** ------------------------------
   *  EmojiCounter demo
   *  ------------------------------ */
  const emojiData = [
    { id: 1, emoji: "👍", count: 1 },
    { id: 2, emoji: "❤️", count: 1 },
  ];

  /** ------------------------------
   *  Chip demo
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
   *  TodayHabitModal demo
   *  ------------------------------ */
  const [openHabitModal, setOpenHabitModal] = useState(false);
  const [items, setItems] = useState([]);
  const addItem = () => setItems((prev) => [...prev, "새 습관"]);
  const deleteItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const handleHabitClose = () => setOpenHabitModal(false);
  const handleHabitSave = () => setOpenHabitModal(false);

  /** ------------------------------
   *  StudyPasswordModal demo
   *  ------------------------------ */
  const [isOpenStudyModal, setIsOpenStudyModal] = useState(false);
  const handleVerify = async (password) => {
    if (password !== "1234") return false;
    setIsOpenStudyModal(false);
    return true;
  };

  /** ------------------------------
   *  SearchBar demo
   *  ------------------------------ */
  const [search, setSearch] = useState("");

  return (
    <div style={{ display: "grid", gap: "2rem", padding: "1.6rem" }}>
      <header style={{ display: "flex", gap: "1rem" }}>
        <Button variant="action" size="lg" onClick={() => setOpenHabitModal(true)}>
          오늘의 습관 모달
        </Button>
        {/* outline 버튼으로 변경 */}
        <Button variant="outline" size="lg" onClick={() => setIsOpenStudyModal(true)}>
          스터디 비밀번호모달
        </Button>
      </header>

      {/* SearchBar lg */}
      <section>
        <h2>SearchBar Test</h2>
        <SearchBar
          value={search}
          onChange={(v) => setSearch(v)}
          onSubmit={(v) => setSearch(v)}
          placeholder="스터디 검색"
          size="lg"
        />
        <p style={{ marginTop: "1rem" }}>검색어: {search}</p>
      </section>

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

      <TodayHabitModal
        open={openHabitModal}
        items={items}
        onAdd={addItem}
        onDelete={deleteItem}
        onClose={handleHabitClose}
        onSave={handleHabitSave}
      />

      <StudyPasswordModal
        isOpen={isOpenStudyModal}
        onClose={() => setIsOpenStudyModal(false)}
        onVerify={handleVerify}
      />
    </div>
  );
}
