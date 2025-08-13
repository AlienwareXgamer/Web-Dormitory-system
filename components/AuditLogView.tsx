/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, Variants } from 'framer-motion';
import type { AuditLog } from '../types';

interface AuditLogViewProps {
    logs: AuditLog[];
}

const tableRowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.03,
            duration: 0.3,
            ease: 'easeOut'
        }
    })
};

export const AuditLogView = ({ logs }: AuditLogViewProps) => {
    return (
        <div className="content-view">
            <h2>System Audit Log</h2>
            <p style={{marginTop: '-16px', marginBottom: '24px', color: 'var(--text-color-secondary)'}}>
                A record of important actions taken within the system.
            </p>
            {logs.length === 0 ? (
                 <p className="no-tenants">No audit logs found.</p>
            ) : (
                <div style={{overflowX: 'auto'}}>
                    <motion.table 
                        className="audit-log-table"
                        initial="hidden"
                        animate="visible"
                    >
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <motion.tr 
                                    key={log.id}
                                    custom={index}
                                    variants={tableRowVariants}
                                >
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.user}</td>
                                    <td>{log.action}</td>
                                    <td>{log.details}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </motion.table>
                </div>
            )}
        </div>
    );
};
