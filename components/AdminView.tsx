/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { generateReportAPI } from '../api/gemini';
import { AddTenantModal } from './AddTenantModal';
import { AddRequestModal } from './AddRequestModal';
import { BillingView } from './BillingView';
import { Dashboard } from './Dashboard';
import { MaintenanceView } from './MaintenanceView';
import { Navigation } from './Navigation';
import { RoomCard } from './RoomCard';
import { TOTAL_ROOMS, MAX_TENANTS_PER_ROOM } from '../constants';
import type { Room, Tenant, View, MaintenanceRequest, MaintenanceStatus } from '../types';

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const listItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
};

const headerActionsVariants = {
    visible: {
        transition: {
            staggerChildren: 0.07,
        }
    }
};

const headerButtonVariant = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
};

export const AdminView = ({
    rooms,
    maintenanceRequests,
    allTenants,
    onAddTenant,
    onRemoveTenant,
    onToggleBilling,
    onAddRequest,
    onUpdateStatus,
    onLogout
}) => {
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [report, setReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');

  const availableRooms = useMemo(() => {
    return rooms.filter((room) => room.tenants.length < MAX_TENANTS_PER_ROOM);
  }, [rooms]);

  const dashboardStats = useMemo(() => {
    const totalTenants = allTenants.length;
    const totalCapacity = TOTAL_ROOMS * MAX_TENANTS_PER_ROOM;
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalTenants / totalCapacity) * 100) : 0;
    const totalMonthlyRevenue = allTenants.reduce((sum, tenant) => sum + tenant.rent, 0);
    const collectedRent = allTenants
        .filter(t => t.billingStatus === 'Paid')
        .reduce((sum, t) => sum + t.rent, 0);
    const outstandingDues = totalMonthlyRevenue - collectedRent;
    const openMaintenanceRequests = maintenanceRequests.filter(r => r.status !== 'Completed').length;

    return {
        totalTenants,
        occupancyPercentage,
        totalMonthlyRevenue,
        collectedRent,
        outstandingDues,
        openMaintenanceRequests,
    };
  }, [allTenants, maintenanceRequests]);
  
  const handleGenerateReport = async () => {
      setIsGeneratingReport(true);
      setReport('');
      try {
        const generatedReport = await generateReportAPI(allTenants, maintenanceRequests);
        setReport(generatedReport);
      } catch (error) {
        console.error(error);
        setReport("Sorry, an error occurred while generating the report. Please try again.");
      } finally {
        setIsGeneratingReport(false);
      }
  };

  const mainContent = () => {
    switch (activeView) {
        case 'home':
            return <Dashboard stats={dashboardStats} />;
        case 'rooms':
            return (
                <motion.div
                  className="room-grid"
                  aria-live="polite"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {rooms.map((room) => (
                      <motion.div
                        key={room.id}
                        variants={listItemVariants}
                        layout
                        whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                          <RoomCard
                            room={room}
                            onRemoveTenant={onRemoveTenant}
                            onToggleBilling={onToggleBilling}
                          />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
            );
        case 'billing':
            return <BillingView tenants={allTenants} onToggleBilling={onToggleBilling} />;
        case 'maintenance':
            return <MaintenanceView requests={maintenanceRequests} tenants={allTenants} onUpdateStatus={onUpdateStatus} />;
        default:
            return null;
    }
  };

  return (
    <>
      <header>
        <h1>Admin Portal</h1>
        <motion.div
          className="header-actions"
          variants={headerActionsVariants}
          initial="hidden"
          animate="visible"
        >
           <motion.button
            variants={headerButtonVariant}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddRequestModal(true)}
            className="btn-secondary"
            aria-label="Report a new maintenance issue"
          >
            <span aria-hidden="true">🛠️</span> Report Issue
          </motion.button>
          <motion.button
            variants={headerButtonVariant}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddTenantModal(true)}
            disabled={availableRooms.length === 0}
            className="btn-primary"
            aria-label="Add new tenant"
          >
            <span aria-hidden="true">＋</span> Add Tenant
          </motion.button>
          <motion.button
            variants={headerButtonVariant}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport || allTenants.length === 0}
            className="btn-secondary"
            aria-label="Generate monthly report"
          >
            <span aria-hidden="true">📄</span> {isGeneratingReport ? 'Generating...' : 'Generate Report'}
          </motion.button>
          <motion.button
            variants={headerButtonVariant}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="btn-logout"
            aria-label="Logout"
          >
            Logout
          </motion.button>
        </motion.div>
      </header>
      <div className="container">
          <Navigation activeView={activeView} setActiveView={setActiveView} />

          <main>
            <AnimatePresence mode="wait">
                 <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    layout
                >
                    {mainContent()}
                </motion.div>
            </AnimatePresence>
    
            <AnimatePresence>
                {(isGeneratingReport && activeView === 'home') && (
                    <motion.div
                        className="report-box loading-report"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="spinner"></div>
                        <p>Generating your report, please wait...</p>
                    </motion.div>
                )}
                {(report && activeView === 'home') && (
                    <motion.pre
                        className="report-box"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {report}
                    </motion.pre>
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {showAddTenantModal && (
                    <AddTenantModal
                      availableRooms={availableRooms}
                      onClose={() => setShowAddTenantModal(false)}
                      onSubmit={onAddTenant}
                    />
                )}
            </AnimatePresence>
             <AnimatePresence>
                {showAddRequestModal && (
                    <AddRequestModal
                      rooms={rooms}
                      onClose={() => setShowAddRequestModal(false)}
                      onSubmit={onAddRequest}
                    />
                )}
            </AnimatePresence>
          </main>
      </div>
    </>
  );
};