/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminView } from './components/AdminView';
import { AuthPage } from './components/AuthPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { TenantLoginPage } from './components/TenantLoginPage';
import { TenantPortal } from './components/TenantPortal';
import * as api from './api/mockDatabase';
import type { Room, Tenant, MaintenanceRequest, User, Announcement, AuditLog } from './types';

const AppLoader = () => (
    <div className="app-loader">
        <div className="spinner"></div>
        <p>Loading Dormitory Data...</p>
    </div>
);

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authView, setAuthView] = useState<'main' | 'admin' | 'tenant'>('main');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const fetchData = useCallback(async () => {
    try {
        const [fetchedRooms, fetchedRequests, fetchedAnnouncements, fetchedLogs] = await Promise.all([
            api.getRooms(),
            api.getMaintenanceRequests(),
            api.getAnnouncements(),
            api.getAuditLogs()
        ]);
        setRooms(fetchedRooms);
        setMaintenanceRequests(fetchedRequests);
        setAnnouncements(fetchedAnnouncements);
        setAuditLogs(fetchedLogs);
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
        alert("Could not load application data. Please refresh the page.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const allTenants = useMemo(() => rooms.flatMap(room => room.tenants), [rooms]);

  const handleAdminLogin = async (email, password) => {
    const success = await api.loginAdmin(email, password);
    if (success) {
        setCurrentUser({ role: 'admin' });
        return true;
    }
    return false;
  };

  const handleTenantLogin = async (name, roomId) => {
     const tenant = await api.findTenant(name, roomId);
     if (tenant) {
        setCurrentUser({ role: 'tenant', tenant });
        return true;
     }
     return false;
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('main');
  };

  const handleAddTenant = useCallback(async (roomId: number, tenantName: string, rent: number) => {
    await api.addTenant(roomId, tenantName, rent);
    await fetchData();
  }, [fetchData]);

  const handleRemoveTenant = useCallback(async (roomId: number, tenantId: string) => {
    if (window.confirm('Are you sure you want to remove this tenant?')) {
        const tenantName = allTenants.find(t => t.id === tenantId)?.name || 'Unknown';
        await api.removeTenant(tenantId, tenantName, roomId);
        await fetchData();
    }
  }, [fetchData, allTenants]);

  const handleToggleBilling = useCallback(async (roomId: number, tenantId: string) => {
    await api.toggleTenantBilling(tenantId);
    await fetchData();
  }, [fetchData]);

  const handleAddRequest = useCallback(async (roomId: number, description: string) => {
      await api.addMaintenanceRequest(roomId, description);
      await fetchData();
      alert('Maintenance request submitted successfully!');
  }, [fetchData]);

  const handleUpdateRequest = useCallback(async (requestId: string, updates: Partial<Omit<MaintenanceRequest, 'id' | 'roomId' | 'reportedDate'>>) => {
      await api.updateMaintenanceRequest(requestId, updates);
      await fetchData();
  }, [fetchData]);
  
  const handleAddAnnouncement = useCallback(async(title: string, content: string) => {
      await api.createAnnouncement(title, content);
      await fetchData();
  }, [fetchData]);

  const handleDeleteAnnouncement = useCallback(async(id: string) => {
      if (window.confirm('Are you sure you want to delete this announcement?')) {
          await api.deleteAnnouncement(id);
          await fetchData();
      }
  }, [fetchData]);

  const renderContent = () => {
    if (isLoading) {
        return <AppLoader />;
    }

    if (!currentUser) {
      return (
          <AnimatePresence mode="wait">
            {authView === 'main' && (
                <AuthPage key="auth-main" onSelectRole={setAuthView} />
            )}
            {authView === 'admin' && (
                <AdminLoginPage 
                    key="auth-admin"
                    onAdminLogin={handleAdminLogin} 
                    onBack={() => setAuthView('main')} 
                />
            )}
            {authView === 'tenant' && (
                <TenantLoginPage 
                    key="auth-tenant"
                    onTenantLogin={handleTenantLogin} 
                    onBack={() => setAuthView('main')} 
                />
            )}
        </AnimatePresence>
      );
    }
  
    if (currentUser.role === 'admin') {
       return (
          <AdminView
              rooms={rooms}
              maintenanceRequests={maintenanceRequests}
              allTenants={allTenants}
              announcements={announcements}
              auditLogs={auditLogs}
              onAddTenant={handleAddTenant}
              onRemoveTenant={handleRemoveTenant}
              onToggleBilling={handleToggleBilling}
              onAddRequest={handleAddRequest}
              onUpdateRequest={handleUpdateRequest}
              onAddAnnouncement={handleAddAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onLogout={handleLogout}
              theme={theme}
              onThemeToggle={handleThemeToggle}
          />
       );
    }
  
    if (currentUser.role === 'tenant') {
      return (
          <TenantPortal
              user={currentUser}
              requests={maintenanceRequests.filter(r => r.roomId === currentUser.tenant.roomId)}
              announcements={announcements}
              onAddRequest={handleAddRequest}
              onLogout={handleLogout}
              theme={theme}
              onThemeToggle={handleThemeToggle}
          />
      );
    }
    return null;
  }

  return <div className="app-wrapper">{renderContent()}</div>;
}