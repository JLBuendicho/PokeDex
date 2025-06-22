// Toast.jsx
import { useEffect } from "react";

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}
export default Toast;