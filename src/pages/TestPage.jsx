// src/pages/TestPage.jsx (예시)
import React, { useState } from "react";
import TodayHabitModal from "../components/organisms/TodayHabitModal.jsx";

export default function TestPage(){
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([]); // 비어 있으면 Add만 보임

  const addItem = () => setItems((prev) => [...prev, "새 습관"]);
  const deleteItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleClose = () => setOpen(false);
  const handleSave  = () => {
    // TODO: 저장 로직
    setOpen(false); // 저장 후 닫기
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>모달 열기</button>
      <TodayHabitModal
        open={open}
        items={items}
        onAdd={addItem}
        onDelete={deleteItem}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
}
