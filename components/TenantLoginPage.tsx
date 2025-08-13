/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion } from 'framer-motion';

export const TenantLoginPage = ({ onTenantLogin, onBack }) => {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTenantSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const success = await onTenantLogin(name, roomId);
            if (!success) {
                setError('Tenant not found or invalid room number.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="login-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="login-box">
                <div className="login-header">
                  <button onClick={onBack} className="btn-back" aria-label="Go back">
                    &larr;
                  </button>
                  <h1>Tenant Login</h1>
                </div>

                <form className="login-form" onSubmit={handleTenantSubmit}>
                    <div className="form-group">
                        <label htmlFor="tenant-name">Full Name</label>
                        <input
                            id="tenant-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., John Doe"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="room-id">Room Number</label>
                        <input
                            id="room-id"
                            type="number"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="e.g., 1"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="login-error">{error}</div>
            </div>
        </motion.div>
    );
};
