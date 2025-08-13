/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { User, MaintenanceRequest, Announcement } from '../types';
import { ArrowRightOnRectangleIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';

const listItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export const TenantPortal = ({ user, requests, announcements, onAddRequest, onLogout, theme, onThemeToggle }) => {
    const { tenant } = user;
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Please describe the issue.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onAddRequest(tenant.roomId, description);
            setDescription('');
        } catch (error) {
            console.error("Failed to submit request:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <header>
                <h1>Tenant Dashboard</h1>
                <div className="header-actions">
                    <ThemeToggle theme={theme} onToggle={onThemeToggle} />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="btn-logout"
                        aria-label="Logout"
                    >
                        <ArrowRightOnRectangleIcon /> Logout
                    </motion.button>
                </div>
            </header>
            <main className="container">
                <motion.div
                    className="tenant-portal-grid"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {/* Profile Card */}
                    <motion.div className="dashboard-card tenant-info-card profile-card" custom={0} variants={cardVariants}>
                        <h3>Welcome, {tenant.name}</h3>
                        <p><strong>Room:</strong> <span>{tenant.roomId}</span></p>
                        <p><strong>Monthly Rent:</strong> <span>₱{tenant.rent.toLocaleString()}</span></p>
                        <p><strong>Billing Status:</strong>
                            <span className={`billing-status-badge status-${tenant.billingStatus.toLowerCase()}`}>
                                {tenant.billingStatus}
                            </span>
                        </p>
                    </motion.div>

                    {/* Announcements Card */}
                    <motion.div className="dashboard-card announcements-card" custom={1} variants={cardVariants}>
                        <h3>Announcements</h3>
                        {announcements.length > 0 ? (
                            <ul className="announcements-list">
                                {announcements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(announcement => (
                                    <motion.li key={announcement.id} className="announcement-item" initial={{opacity:0, y: 10}} animate={{opacity: 1, y: 0}}>
                                        <h4 className="announcement-title">{announcement.title}</h4>
                                        <p className="announcement-date">{new Date(announcement.date).toLocaleDateString()}</p>
                                        <p className="announcement-content">{announcement.content}</p>
                                    </motion.li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-tenants">No announcements at this time.</p>
                        )}
                    </motion.div>
                    
                    {/* Maintenance Card */}
                    <motion.div className="dashboard-card maintenance-card" custom={2} variants={cardVariants}>
                        <h3>My Maintenance</h3>
                        {requests.length > 0 ? (
                            <ul className="content-list">
                                <AnimatePresence>
                                    {requests.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()).map(request => (
                                        <motion.li
                                            key={request.id}
                                            className="content-item maintenance-item"
                                            variants={listItemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <div className="maintenance-item-details" style={{width: '100%'}}>
                                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                                    <span className={`maintenance-status status-${request.status.replace(/\s+/g, '')}`}>
                                                        {request.status}
                                                    </span>
                                                    <span className={`priority-tag priority-${request.priority}`}>
                                                        {request.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="maintenance-description">{request.description}</p>
                                                <span className="maintenance-date">
                                                    Reported on {new Date(request.reportedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        ) : (
                            <p className="no-tenants">You have no active maintenance requests.</p>
                        )}

                        <form onSubmit={handleSubmit} className="maintenance-form">
                            <h4>Report a New Issue</h4>
                            <div className="form-group">
                                <label htmlFor="tenant-request-description">Issue Description</label>
                                <textarea
                                    id="tenant-request-description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g., My desk lamp is not working."
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
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
            </main>
        </>
    );
};