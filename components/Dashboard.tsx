/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, Variants } from 'framer-motion';
import { CircularProgress } from './CircularProgress';

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

const MetricCard = ({ title, value, icon, className = '', index }) => (
    <motion.div
        custom={index}
        variants={cardVariants}
        className={`metric-card ${className}`}
        whileHover={{ scale: 1.03, zIndex: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
        <div className="metric-card-icon" aria-hidden="true">{icon}</div>
        <h3 className="metric-card-title">{title}</h3>
        <p className={`metric-card-value ${className}`}>{value}</p>
    </motion.div>
);


export const Dashboard = ({ stats }) => {
    const metrics = [
        { title: 'Total Tenants', value: stats.totalTenants, icon: '👥', index: 1 },
        { title: 'Open Maintenance', value: stats.openMaintenanceRequests, icon: '🔧', className: stats.openMaintenanceRequests > 0 ? 'warning' : '', index: 2 },
        { title: 'Potential Revenue', value: `$${stats.totalMonthlyRevenue.toLocaleString()}`, icon: '📈', index: 3 },
        { title: 'Collected This Month', value: `$${stats.collectedRent.toLocaleString()}`, icon: '✅', className: 'success', index: 4 },
        { title: 'Outstanding Dues', value: `$${stats.outstandingDues.toLocaleString()}`, icon: '❗', className: 'error', index: 5 }
    ];

    return (
        <motion.section 
            className="dashboard-overview" 
            aria-labelledby="dashboard-title"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
        >
            <h2 id="dashboard-title" className="sr-only">Dashboard Overview</h2>

            <motion.div
                custom={0}
                variants={cardVariants}
                className="metric-card occupancy-card"
                whileHover={{ scale: 1.03, zIndex: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                 <h3 className="metric-card-title">Total Occupancy</h3>
                 <CircularProgress percentage={stats.occupancyPercentage} />
            </motion.div>
            
            {metrics.map(metric => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </motion.section>
    );
};