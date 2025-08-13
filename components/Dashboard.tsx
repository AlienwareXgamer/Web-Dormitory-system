/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, Variants } from 'framer-motion';
import { CircularProgress } from './CircularProgress';
import { UserGroupIcon, WrenchScrewdriverIcon, BanknotesIcon, CheckCircleIcon, ExclamationTriangleIcon, BuildingOfficeIcon } from './icons';

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
        whileHover={{ scale: 1.03, y: -5, zIndex: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
        <div className="metric-card-header">
          <div className="metric-card-icon">{icon}</div>
          <h3 className="metric-card-title">{title}</h3>
        </div>
        <p className={`metric-card-value ${className}`}>{value}</p>
    </motion.div>
);


export const Dashboard = ({ stats }) => {
    const metrics = [
        { title: 'Total Tenants', value: stats.totalTenants, icon: <UserGroupIcon />, index: 1 },
        { title: 'Open Maintenance', value: stats.openMaintenanceRequests, icon: <WrenchScrewdriverIcon />, className: stats.openMaintenanceRequests > 0 ? 'warning' : '', index: 2 },
        { title: 'Potential Revenue', value: `₱${stats.totalMonthlyRevenue.toLocaleString()}`, icon: <BanknotesIcon />, index: 3 },
        { title: 'Collected This Month', value: `₱${stats.collectedRent.toLocaleString()}`, icon: <CheckCircleIcon />, className: 'success', index: 4 },
        { title: 'Outstanding Dues', value: `₱${stats.outstandingDues.toLocaleString()}`, icon: <ExclamationTriangleIcon />, className: 'error', index: 5 }
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
                whileHover={{ scale: 1.03, y: -5, zIndex: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
                 <div className="metric-card-header">
                    <div className="metric-card-icon"><BuildingOfficeIcon /></div>
                    <h3 className="metric-card-title">Total Occupancy</h3>
                 </div>
                 <CircularProgress percentage={stats.occupancyPercentage} />
            </motion.div>
            
            {metrics.map(metric => (
                <MetricCard key={metric.title} {...metric} />
            ))}
        </motion.section>
    );
};
