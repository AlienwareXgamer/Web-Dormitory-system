/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { Announcement } from '../types';
import { TrashIcon } from './icons';

interface AnnouncementsViewProps {
    announcements: Announcement[];
    onAdd: (title: string, content: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const listItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
};

export const AnnouncementsView = ({ announcements, onAdd, onDelete }: AnnouncementsViewProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Please fill out both title and content.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onAdd(title, content);
            setTitle('');
            setContent('');
        } catch (error) {
            console.error("Failed to add announcement:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="content-view">
            <h2>Manage Announcements</h2>
            
            <motion.form 
                onSubmit={handleSubmit} 
                className="announcement-form"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3>Create New Announcement</h3>
                <div className="form-group">
                    <label htmlFor="announcement-title">Title</label>
                    <input
                        id="announcement-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Upcoming Maintenance"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="announcement-content">Content</label>
                    <textarea
                        id="announcement-content"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Provide details about the announcement..."
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Post Announcement'}
                    </button>
                </div>
            </motion.form>

            <h3>Existing Announcements</h3>
            {announcements.length === 0 ? (
                 <p className="no-tenants">No announcements have been posted yet.</p>
            ) : (
                <motion.ul 
                    className="content-list"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {announcements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(announcement => (
                            <motion.li 
                                key={announcement.id}
                                className="content-item"
                                variants={listItemVariants}
                                exit="exit"
                                layout
                            >
                                <div className="item-details" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                                    <div>
                                        <h4 className="announcement-title" style={{ margin: 0 }}>{announcement.title}</h4>
                                        <p className="announcement-date" style={{ margin: 0 }}>Posted on {new Date(announcement.date).toLocaleString()}</p>
                                    </div>
                                    <p className="announcement-content" style={{ margin: 0 }}>{announcement.content}</p>
                                </div>
                                <div className="item-actions">
                                     <motion.button
                                        onClick={() => onDelete(announcement.id)}
                                        className="icon-only-btn"
                                        aria-label={`Delete announcement: ${announcement.title}`}
                                        whileHover={{ scale: 1.1, color: 'var(--error-color)', backgroundColor: 'rgba(248, 81, 73, 0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                     >
                                        <TrashIcon />
                                     </motion.button>
                                 </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            )}
        </div>
    );
};
