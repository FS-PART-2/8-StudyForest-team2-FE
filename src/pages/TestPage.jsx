import { useState } from "react";
import Button from "../components/atoms/Button.jsx";
import StudyPasswordModal from "../components/organisms/StudyPasswordModal.jsx";

export default function TestModalPage() {
  const [open, setOpen] = useState(false);

  // 데모용 검증: "1234"만 통과
  const verify = async (pw) => pw === "1234";

  return (
    <div style={{ padding: "2rem" }}>
      <h1>StudyPasswordModal 테스트</h1>
      <Button variant="action" size="md" onClick={() => setOpen(true)}>
        모달 열기
      </Button>

      <StudyPasswordModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onVerify={verify}
      />
    </div>
  );
}
