/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { User, MaintenanceRequest } from '../types';

const listItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const TenantPortal = ({ user, requests, onAddRequest, onLogout }) => {
    const { tenant } = user;
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Please describe the issue.');
            return;
        }
        onAddRequest(tenant.roomId, description);
        setDescription('');
    };

    return (
        <>
            <header>
                <h1>Tenant Portal</h1>
                <div className="header-actions">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="btn-logout"
                        aria-label="Logout"
                    >
                        Logout
                    </motion.button>
                </div>
            </header>
            <main className="container">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="tenant-portal-grid">
                        <div className="tenant-info-card">
                            <h3>Welcome, {tenant.name}</h3>
                            <p><strong>Room:</strong> <span>{tenant.roomId}</span></p>
                            <p><strong>Monthly Rent:</strong> <span>${tenant.rent}</span></p>
                            <p><strong>Billing Status:</strong> 
                                <span className={`billing-status billing-${tenant.billingStatus.toLowerCase()}`}>
                                    {tenant.billingStatus}
                                </span>
                            </p>
                        </div>
                        <div className="tenant-portal-section">
                            <h2>My Maintenance Requests</h2>
                            {requests.length > 0 ? (
                                <ul className="maintenance-list">
                                    <AnimatePresence>
                                        {requests.map(request => (
                                            <motion.li
                                                key={request.id}
                                                className="maintenance-item"
                                                variants={listItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <div className="maintenance-item-details">
                                                    <p className="maintenance-description">{request.description}</p>
                                                    <span className="maintenance-date">
                                                        Reported on {new Date(request.reportedDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="maintenance-actions">
                                                    <span className={`maintenance-status status-${request.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            ) : (
                                <p className="no-tenants">You have no active maintenance requests.</p>
                            )}

                             <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
                                <h3>Report a New Issue in Your Room</h3>
                                <div className="form-group">
                                    <label htmlFor="tenant-request-description">Issue Description</label>
                                    <textarea
                                      id="tenant-request-description"
                                      rows={3}
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                      placeholder="e.g., My desk lamp is not working."
                                      required
                                    />
                                </div>
                                <div className="form-actions" style={{justifyContent: 'flex-start'}}>
                                    <motion.button
                                      type="submit"
                                      className="btn-primary"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                        Submit Request
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </main>
        </>
    );
};