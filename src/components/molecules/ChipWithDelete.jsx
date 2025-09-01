import Chip from "../atoms/Chip.jsx";
import styles from "../../styles/components/molecules/ChipWithDelete.module.css";

/**
 * ChipWithDelete (Molecule)
 * - 가운데 Chip(atom) + 오른쪽 Delete 버튼
 * - gap: 8px
 */
export default function ChipWithDelete({
  label,
  selected = false,
  disabled = false,
  onClick,
  onDelete,
}) {
  return (
    <div className={styles.row}>
      <div className={styles.center}>
        <Chip
          label={label}
          selected={selected}
          disabled={disabled}
          onClick={onClick}
          deletable={false} // Atom의 기본 삭제 버튼은 끔
        />
      </div>

      <button
        type="button"
        className={styles.deleteBtn}
        onClick={onDelete}
        aria-label="삭제"
      >
        <img src="/assets/icons/delete.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
