/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { MaintenanceRequest, MaintenanceStatus, MaintenancePriority } from '../types';

interface MaintenanceViewProps {
    requests: MaintenanceRequest[];
    onUpdateRequest: (requestId: string, updates: Partial<Omit<MaintenanceRequest, 'id' | 'roomId' | 'reportedDate'>>) => void;
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

export const MaintenanceView = ({ requests, onUpdateRequest }: MaintenanceViewProps) => {
    const [assigneeInputs, setAssigneeInputs] = useState<{ [key: string]: string }>({});

    const handleAssigneeChange = (id: string, value: string) => {
        setAssigneeInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleAssigneeBlur = (request: MaintenanceRequest) => {
        const newAssignee = assigneeInputs[request.id];
        if (newAssignee !== undefined && newAssignee !== request.assignedTo) {
            onUpdateRequest(request.id, { assignedTo: newAssignee });
        }
    };
    
    return (
        <div className="content-view">
            <h2>Maintenance Requests</h2>
            {requests.length === 0 ? (
                 <p className="no-tenants">No maintenance requests have been submitted.</p>
            ) : (
                <motion.ul 
                    className="content-list"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {requests.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()).map(request => (
                            <motion.li 
                                key={request.id}
                                className="content-item maintenance-item"
                                variants={listItemVariants}
                                layout
                            >
                                <div className="maintenance-item-main">
                                    <div className="maintenance-item-details">
                                        <div className="maintenance-item-header">
                                            <span className="maintenance-room">Room {request.roomId}</span>
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
                                </div>
                                <div className="maintenance-controls">
                                    <div className="maintenance-control-group">
                                        <label htmlFor={`status-select-${request.id}`}>Status</label>
                                        <select 
                                            id={`status-select-${request.id}`}
                                            className="maintenance-status-select"
                                            value={request.status}
                                            onChange={(e) => onUpdateRequest(request.id, { status: e.target.value as MaintenanceStatus })}
                                        >
                                            <option value="Reported">Reported</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="maintenance-control-group">
                                        <label htmlFor={`priority-select-${request.id}`}>Priority</label>
                                        <select 
                                            id={`priority-select-${request.id}`}
                                            className="maintenance-priority-select"
                                            value={request.priority}
                                            onChange={(e) => onUpdateRequest(request.id, { priority: e.target.value as MaintenancePriority })}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div className="maintenance-control-group">
                                        <label htmlFor={`assignee-input-${request.id}`}>Assigned To</label>
                                        <input
                                            id={`assignee-input-${request.id}`}
                                            className="maintenance-assignee-input"
                                            type="text"
                                            placeholder="e.g., Mike"
                                            value={assigneeInputs[request.id] ?? request.assignedTo}
                                            onChange={(e) => handleAssigneeChange(request.id, e.target.value)}
                                            onBlur={() => handleAssigneeBlur(request)}
                                        />
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            )}
        </div>
    );
};
