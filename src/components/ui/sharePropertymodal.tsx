import React from 'react';

interface SharePropertyModalProps {
  onConfirm: (confirmed: boolean) => void; // Handle confirmation from parent
  onClose: () => void; // Close the modal without any action
}

const SharePropertyModal: React.FC<SharePropertyModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Are you sure you want to share the property?</h3>
        <p>Some other can book the same property for the remaining space.</p>
        <div>
          <button
            onClick={() => {
              onConfirm(true); // Confirm the share action
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              onConfirm(false); // Cancel the share action
            }}
          >
            No
          </button>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SharePropertyModal;
