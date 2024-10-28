// @components/modals/DeleteModal.tsx
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>; // Assuming delete is async
  bookingsCount: number | 0
}

interface DeleteModalProps_de {
    open: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>; // Assuming delete is async
    onDelete_sch:()=> Promise<void>;
    bookingsCount: number | 0
  }

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <div>Are you sure you want to delete this item?</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          No
        </Button>
        <Button onClick={onDelete} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;

export const DeleteModalCnf: React.FC<DeleteModalProps_de> = ({
    open,
    onClose,
    onDelete,
    onDelete_sch,
    bookingsCount,
  }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <div>
            {bookingsCount > 0
              ? `This property has ${bookingsCount} booking(s).`
              : "This property has no bookings."}
            <br />
            Are you sure you want to continue with the deletion?
          </div>
          {bookingsCount > 0 && (
            <div>
              <p>
                You can either:
                <ul>
                  <li>Continue with scheduled delete and archive non-confirmed bookings.</li>
                  <li>Cancel all bookings after 1 month and notify users about the cancellation.</li>
                </ul>
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            No
          </Button>
          <Button onClick={onDelete} color='secondary'>
            Yes, Delete ALL
          </Button>

          <Button onClick={onDelete_sch} color="secondary">
            Yes, Scheduled Delete 
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
