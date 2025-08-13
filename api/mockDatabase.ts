/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Room, Tenant, MaintenanceRequest, MaintenanceStatus, MaintenancePriority, Announcement, AuditLog } from '../types';
import { TOTAL_ROOMS, MAX_TENANTS_PER_ROOM } from '../constants';

// --- In-memory database ---
let rooms: Room[] = [];
let maintenanceRequests: MaintenanceRequest[] = [];
let announcements: Announcement[] = [];
let auditLogs: AuditLog[] = [];

// --- API Simulation ---
const simulateLatency = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const addAuditLog = (action: string, details: string, user: string = 'Admin'): void => {
    const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user,
        action,
        details
    };
    auditLogs.unshift(newLog);
}

// --- Initialize with mock data ---
const initializeData = () => {
    // Reset arrays
    rooms = [];
    maintenanceRequests = [];
    announcements = [];
    auditLogs = [];

    const initialRooms: Room[] = Array.from({ length: TOTAL_ROOMS }, (_, i) => ({
      id: i + 1,
      tenants: [],
    }));

    // Pre-populate some tenants with PHP currency
    const demoTenant1: Tenant = { id: 'tenant-1', name: 'John Doe', rent: 10500, billingStatus: 'Paid', roomId: 1 };
    const demoTenant2: Tenant = { id: 'tenant-2', name: 'Jane Smith', rent: 10500, billingStatus: 'Due', roomId: 1 };
    const demoTenant3: Tenant = { id: 'tenant-3', name: 'Peter Jones', rent: 12000, billingStatus: 'Due', roomId: 3 };
    initialRooms[0].tenants = [demoTenant1, demoTenant2];
    initialRooms[2].tenants = [demoTenant3];
    rooms = initialRooms;
    
    maintenanceRequests = [
        { id: `req-1`, roomId: 3, description: 'Leaky faucet in the kitchen sink.', status: 'Reported', priority: 'Medium', assignedTo: '', reportedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: `req-2`, roomId: 8, description: 'Wi-Fi is not working in the common area on this floor.', status: 'In Progress', priority: 'High', assignedTo: 'Tech Team', reportedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: `req-3`, roomId: 1, description: 'Lightbulb in the main ceiling fixture is out.', status: 'Completed', priority: 'Low', assignedTo: 'Mike', reportedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ];
    
    announcements = [
        {
            id: 'anno-1',
            title: 'Community BBQ This Saturday!',
            content: 'Join us for a community BBQ in the common area this Saturday at 5 PM. Free food and drinks for all residents!',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'anno-2',
            title: 'Package Delivery Policy Update',
            content: 'Starting next week, all packages must be collected from the front desk within 48 hours of delivery notification. Please bring your ID.',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];
    
    addAuditLog('System Initialized', 'Mock data loaded.', 'System');
};

// Initialize on load
initializeData();


// --- Public API ---

export const getRooms = async (): Promise<Room[]> => {
    await simulateLatency(300);
    return JSON.parse(JSON.stringify(rooms));
};

export const getMaintenanceRequests = async (): Promise<MaintenanceRequest[]> => {
    await simulateLatency(300);
    return JSON.parse(JSON.stringify(maintenanceRequests));
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    await simulateLatency(150);
    return JSON.parse(JSON.stringify(announcements));
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    await simulateLatency(200);
    return JSON.parse(JSON.stringify(auditLogs));
};

export const loginAdmin = async (email, password): Promise<boolean> => {
    await simulateLatency();
    const success = email === 'admin@dorm.com' && password === 'password123';
    if(success) {
        addAuditLog('Admin Login', `Admin user logged in successfully.`);
    } else {
        addAuditLog('Failed Login', `Failed login attempt for email: ${email}.`, 'System');
    }
    return success;
};

export const findTenant = async (name: string, roomId: string): Promise<Tenant | null> => {
    await simulateLatency();
    const allTenants = rooms.flatMap(room => room.tenants);
    const tenant = allTenants.find(t => t.name.toLowerCase() === name.toLowerCase().trim() && t.roomId === Number(roomId));
    if (tenant) {
        addAuditLog('Tenant Login', `Tenant '${tenant.name}' logged in.`, 'Tenant');
    }
    return tenant || null;
};

export const addTenant = async (roomId: number, tenantName: string, rent: number): Promise<Tenant> => {
    await simulateLatency();
    const room = rooms.find(r => r.id === roomId);
    if (!room || room.tenants.length >= MAX_TENANTS_PER_ROOM) {
        throw new Error("Room is full or does not exist.");
    }
    const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: tenantName,
        rent,
        billingStatus: 'Due',
        roomId: room.id,
    };
    room.tenants.push(newTenant);
    addAuditLog('Tenant Added', `Added tenant '${tenantName}' to Room ${roomId}.`);
    return newTenant;
};

export const removeTenant = async (tenantId: string, tenantName: string, roomId: number): Promise<void> => {
    await simulateLatency();
    rooms = rooms.map(room => ({
        ...room,
        tenants: room.tenants.filter(tenant => tenant.id !== tenantId),
    }));
    addAuditLog('Tenant Removed', `Removed tenant '${tenantName}' from Room ${roomId}.`);
};

export const toggleTenantBilling = async (tenantId: string): Promise<void> => {
    await simulateLatency(200);
    for (const room of rooms) {
        const tenant = room.tenants.find(t => t.id === tenantId);
        if (tenant) {
            const oldStatus = tenant.billingStatus;
            tenant.billingStatus = oldStatus === 'Due' ? 'Paid' : 'Due';
            addAuditLog('Billing Status Changed', `Billing for '${tenant.name}' changed from ${oldStatus} to ${tenant.billingStatus}.`);
            return;
        }
    }
};

export const addMaintenanceRequest = async (roomId: number, description: string): Promise<MaintenanceRequest> => {
    await simulateLatency();
    const newRequest: MaintenanceRequest = {
        id: `req-${Date.now()}`,
        roomId,
        description,
        status: 'Reported',
        priority: 'Medium',
        assignedTo: '',
        reportedDate: new Date().toISOString(),
    };
    maintenanceRequests.unshift(newRequest);
    const user = rooms.find(r => r.id === roomId) ? 'Tenant' : 'Admin';
    addAuditLog('Maintenance Request Added', `New request for Room ${roomId}: "${description}"`, user);
    return newRequest;
};

export const updateMaintenanceRequest = async (requestId: string, updates: Partial<Omit<MaintenanceRequest, 'id' | 'roomId' | 'reportedDate'>>): Promise<void> => {
    await simulateLatency(200);
    const request = maintenanceRequests.find(req => req.id === requestId);
    if (request) {
        const oldRequest = {...request};
        Object.assign(request, updates);

        const changes = Object.keys(updates).map(key => {
            if(oldRequest[key] !== request[key]) {
                return `${key} to '${request[key]}'`;
            }
            return null;
        }).filter(Boolean).join(', ');

        if (changes) {
            addAuditLog('Maintenance Updated', `Request for Room ${request.roomId} updated: ${changes}.`);
        }
    } else {
        throw new Error("Request not found.");
    }
};

export const createAnnouncement = async (title: string, content: string): Promise<Announcement> => {
    await simulateLatency();
    const newAnnouncement: Announcement = {
        id: `anno-${Date.now()}`,
        title,
        content,
        date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    addAuditLog('Announcement Created', `New announcement: "${title}"`);
    return newAnnouncement;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    await simulateLatency();
    const announcement = announcements.find(a => a.id === id);
    if(announcement) {
        addAuditLog('Announcement Deleted', `Deleted announcement: "${announcement.title}"`);
    }
    announcements = announcements.filter(a => a.id !== id);
};
