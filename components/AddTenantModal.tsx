/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MAX_TENANTS_PER_ROOM } from '../constants';

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

export const AddTenantModal = ({ availableRooms, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [rent, setRent] = useState('');
  const [roomId, setRoomId] = useState(availableRooms[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rent || !roomId || parseFloat(rent) <= 0) {
      alert('Please fill all fields correctly.');
      return;
    }
    setIsSubmitting(true);
    try {
        await onSubmit(Number(roomId), name, parseFloat(rent));
        onClose();
    } catch (error) {
        console.error("Failed to add tenant:", error);
        alert('An error occurred while adding the tenant. Please try again.');
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
        <h2>Add New Tenant</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tenant-name">Tenant Name</label>
            <input
              id="tenant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="rent-amount">Monthly Rent (₱)</label>
            <input
              id="rent-amount"
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="e.g., 10000"
              required
              min="1"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="room-select">Select Room</label>
            <select id="room-select" value={roomId} onChange={(e) => setRoomId(e.target.value)} required disabled={isSubmitting}>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.id} ({room.tenants.length}/{MAX_TENANTS_PER_ROOM})
                </option>
              ))}
            </select>
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
              {isSubmitting ? 'Adding...' : 'Add Tenant'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};