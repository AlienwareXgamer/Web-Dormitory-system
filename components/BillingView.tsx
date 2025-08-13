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

const listItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
        y: 0, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};


export const BillingView = ({ tenants, onToggleBilling }: BillingViewProps) => {
    return (
        <div className="billing-view">
            <h2>All Tenant Billings</h2>
            {tenants.length === 0 ? (
                 <p className="no-tenants">No tenants to display.</p>
            ) : (
                <motion.ul 
                    className="billing-list"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {tenants.map(tenant => (
                            <motion.li 
                                key={tenant.id}
                                className="billing-item"
                                variants={listItemVariants}
                                layout
                            >
                                <div className="billing-item-details">
                                    <span className="tenant-name">{tenant.name}</span>
                                    <span className="tenant-room">Room {tenant.roomId}</span>
                                    <span className="tenant-rent">Rent: ${tenant.rent}/mo</span>
                                </div>
                                 <div className="billing-item-status">
                                     <span className={`billing-status billing-${tenant.billingStatus.toLowerCase()}`}>
                                      {tenant.billingStatus}
                                    </span>
                                     <motion.button
                                        onClick={() => onToggleBilling(tenant.roomId, tenant.id)}
                                        className="btn-billing"
                                        aria-label={`Mark bill as ${tenant.billingStatus === 'Due' ? 'Paid' : 'Due'} for ${tenant.name}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                     >
                                        Toggle Bill
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