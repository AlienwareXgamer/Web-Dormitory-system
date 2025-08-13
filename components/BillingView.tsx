/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { Tenant } from '../types';

interface BillingViewProps {
    tenants: Tenant[];
    onToggleBilling: (roomId: number, tenantId: string) => void;
}

const tableRowVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.03,
            type: 'spring',
            stiffness: 400,
            damping: 30
        }
    }),
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
};


export const BillingView = ({ tenants, onToggleBilling }: BillingViewProps) => {
    return (
        <div className="content-view">
            <h2>All Tenant Billings</h2>
            {tenants.length === 0 ? (
                 <p className="no-tenants">No tenants to display.</p>
            ) : (
                <div className="table-container">
                    <motion.table 
                        className="billing-table"
                        initial="hidden"
                        animate="visible"
                    >
                        <thead>
                            <tr>
                                <th>Tenant Name</th>
                                <th>Room</th>
                                <th>Monthly Rent</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <AnimatePresence>
                            <tbody>
                                {tenants.sort((a, b) => a.name.localeCompare(b.name)).map((tenant, index) => (
                                    <motion.tr 
                                        key={tenant.id}
                                        custom={index}
                                        variants={tableRowVariants}
                                        layout
                                    >
                                        <td className="tenant-name-cell">{tenant.name}</td>
                                        <td>Room {tenant.roomId}</td>
                                        <td>₱{tenant.rent.toLocaleString()}</td>
                                        <td>
                                            <span className={`billing-status-badge status-${tenant.billingStatus.toLowerCase()}`}>
                                                {tenant.billingStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <motion.button
                                                onClick={() => onToggleBilling(tenant.roomId, tenant.id)}
                                                className="btn-billing"
                                                aria-label={`Mark bill as ${tenant.billingStatus === 'Due' ? 'Paid' : 'Due'} for ${tenant.name}`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Toggle Bill
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </AnimatePresence>
                    </motion.table>
                </div>
            )}
        </div>
    );
};