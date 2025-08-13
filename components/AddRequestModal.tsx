/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import type { Room } from '../types';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { y: -30, scale: 0.95, opacity: 0 },
  visible: { 
    y: 0, 
    scale: 1, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 400, damping: 30 } 
  },
  exit: { y: 30, scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

interface AddRequestModalProps {
    rooms: Room[];
    onClose: () => void;
    onSubmit: (roomId: number, description: string) => Promise<void>;
}

export const AddRequestModal = ({ rooms, onClose, onSubmit }: AddRequestModalProps) => {
  const [description, setDescription] = useState('');
  const [roomId, setRoomId] = useState(rooms[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !roomId) {
      alert('Please fill all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
        await onSubmit(Number(roomId), description);
        onClose();
    } catch(error) {
        console.error("Failed to submit request:", error);
        alert('An error occurred while submitting the request. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <h2>Report Maintenance Issue</h2>
        <form onSubmit={handleSubmit} aria-labelledby="modal-title">
          <h2 id="modal-title" className="sr-only">Report Maintenance Issue Form</h2>
          <div className="form-group">
            <label htmlFor="room-select-request">Room Number</label>
            <select id="room-select-request" value={roomId} onChange={(e) => setRoomId(e.target.value)} required disabled={isSubmitting}>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.id}
                </option>
              ))}
            </select>
          </div>
           <div className="form-group">
            <label htmlFor="request-description">Issue Description</label>
            <textarea
              id="request-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Leaky faucet in the bathroom."
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-actions">
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};