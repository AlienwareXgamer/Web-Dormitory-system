/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AdminView } from './components/AdminView';
import { LoginPage } from './components/LoginPage';
import { TenantPortal } from './components/TenantPortal';
import { TOTAL_ROOMS, MAX_TENANTS_PER_ROOM } from './constants';
import type { Room, Tenant, MaintenanceRequest, MaintenanceStatus, User } from './types';

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize with some mock data for demonstration
    const initialRooms: Room[] = Array.from({ length: TOTAL_ROOMS }, (_, i) => ({
      id: i + 1,
      tenants: [],
    }));
     // Pre-populate some tenants for login testing
    const demoTenant1: Tenant = { id: 'tenant-1', name: 'John Doe', rent: 550, billingStatus: 'Paid', roomId: 1 };
    const demoTenant2: Tenant = { id: 'tenant-2', name: 'Jane Smith', rent: 550, billingStatus: 'Due', roomId: 1 };
    const demoTenant3: Tenant = { id: 'tenant-3', name: 'Peter Jones', rent: 600, billingStatus: 'Due', roomId: 3 };
    initialRooms[0].tenants = [demoTenant1, demoTenant2];
    initialRooms[2].tenants = [demoTenant3];

    setRooms(initialRooms);
    
    setMaintenanceRequests([
        { id: `req-1`, roomId: 3, description: 'Leaky faucet in the kitchen sink.', status: 'Reported', reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: `req-2`, roomId: 8, description: 'Wi-Fi is not working in the common area on this floor.', status: 'In Progress', reportedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: `req-3`, roomId: 1, description: 'Lightbulb in the main ceiling fixture is out.', status: 'Completed', reportedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ]);
  }, []);
  
  const allTenants = useMemo(() => rooms.flatMap(room => room.tenants), [rooms]);

  const handleAdminLogin = (email, password) => {
    // In a real app, you'd validate against a backend.
    if (email === 'admin@dorm.com' && password === 'password123') {
        setCurrentUser({ role: 'admin' });
        return true;
    }
    return false;
  };

  const handleTenantLogin = (name, roomId) => {
     const tenant = allTenants.find(t => t.name.toLowerCase() === name.toLowerCase().trim() && t.roomId === Number(roomId));
     if (tenant) {
        setCurrentUser({ role: 'tenant', tenant });
        return true;
     }
     return false;
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddTenant = useCallback((roomId: number, tenantName: string, rent: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId && room.tenants.length < MAX_TENANTS_PER_ROOM) {
          const newTenant: Tenant = {
            id: `tenant-${Date.now()}`,
            name: tenantName,
            rent,
            billingStatus: 'Due',
            roomId: room.id,
          };
          return { ...room, tenants: [...room.tenants, newTenant] };
        }
        return room;
      })
    );
  }, []);

  const handleRemoveTenant = useCallback((roomId: number, tenantId: string) => {
    if (window.confirm('Are you sure you want to remove this tenant?')) {
        setRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (room.id === roomId) {
              return {
                ...room,
                tenants: room.tenants.filter((tenant) => tenant.id !== tenantId),
              };
            }
            return room;
          })
        );
    }
  }, []);

  const handleToggleBilling = useCallback((roomId: number, tenantId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            tenants: room.tenants.map((tenant) =>
              tenant.id === tenantId
                ? { ...tenant, billingStatus: tenant.billingStatus === 'Due' ? 'Paid' : 'Due' }
                : tenant
            ),
          };
        }
        return room;
      })
    );
  }, []);

  const handleAddRequest = useCallback((roomId: number, description: string) => {
      const newRequest: MaintenanceRequest = {
        id: `req-${Date.now()}`,
        roomId,
        description,
        status: 'Reported',
        reportedDate: new Date().toISOString(),
      };
      setMaintenanceRequests(prev => [...prev, newRequest].sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()));
      alert('Maintenance request submitted successfully!');
  }, []);

  const handleUpdateStatus = useCallback((requestId: string, status: MaintenanceStatus) => {
      setMaintenanceRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
  }, []);
  
  const renderContent = () => {
    if (!currentUser) {
      return (
          <LoginPage 
              onAdminLogin={handleAdminLogin}
              onTenantLogin={handleTenantLogin}
          />
      );
    }
  
    if (currentUser.role === 'admin') {
       return (
          <AdminView
              rooms={rooms}
              maintenanceRequests={maintenanceRequests}
              allTenants={allTenants}
              onAddTenant={handleAddTenant}
              onRemoveTenant={handleRemoveTenant}
              onToggleBilling={handleToggleBilling}
              onAddRequest={handleAddRequest}
              onUpdateStatus={handleUpdateStatus}
              onLogout={handleLogout}
          />
       );
    }
  
    if (currentUser.role === 'tenant') {
      return (
          <TenantPortal
              user={currentUser}
              requests={maintenanceRequests.filter(r => r.roomId === currentUser.tenant.roomId)}
              onAddRequest={handleAddRequest}
              onLogout={handleLogout}
          />
      );
    }
    return null;
  }

  return <div className="app-wrapper">{renderContent()}</div>;
}