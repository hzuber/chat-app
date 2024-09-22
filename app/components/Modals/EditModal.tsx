import React, { useEffect } from "react";

interface EditModalProps {
  isOpen: boolean;
  field: string;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  field,
  value,
  onClose,
  onSave,
}) => {
  const [inputValue, setInputValue] = React.useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  if (!isOpen) return null;

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog z-3">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit {field}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onSave(inputValue)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {/* Optional: Overlay to darken the background */}
      <div className="modal-backdrop show z-2"></div>
    </div>
  );
};
