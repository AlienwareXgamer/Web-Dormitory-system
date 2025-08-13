/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { MaintenanceRequest, MaintenanceStatus, Tenant } from '../types';

interface MaintenanceViewProps {
    requests: MaintenanceRequest[];
    tenants: Tenant[];
    onUpdateStatus: (requestId: string, status: MaintenanceStatus) => void;
}

const listItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export const MaintenanceView = ({ requests, tenants, onUpdateStatus }: MaintenanceViewProps) => {
    return (
        <div className="maintenance-view">
            <h2>Maintenance Requests</h2>
            {requests.length === 0 ? (
                 <p className="no-tenants">No maintenance requests have been submitted.</p>
            ) : (
                <motion.ul 
                    className="maintenance-list"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {requests.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()).map(request => (
                            <motion.li 
                                key={request.id}
                                className="maintenance-item"
                                variants={listItemVariants}
                                layout
                            >
                                <div className="maintenance-item-details">
                                    <div className="maintenance-item-header">
                                        <span className="maintenance-room">Room {request.roomId}</span>
                                        <span className={`maintenance-status status-${request.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="maintenance-description">{request.description}</p>
                                    <span className="maintenance-date">
                                        Reported on {new Date(request.reportedDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="maintenance-actions">
                                    <label htmlFor={`status-select-${request.id}`} className="sr-only">Update Status</label>
                                    <select 
                                        id={`status-select-${request.id}`}
                                        className="maintenance-status-select"
                                        value={request.status}
                                        onChange={(e) => onUpdateStatus(request.id, e.target.value as MaintenanceStatus)}
                                    >
                                        <option value="Reported">Reported</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            )}
        </div>
    );
};