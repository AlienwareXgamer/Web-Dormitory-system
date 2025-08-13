/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tenant {
  id: string;
  name: string;
  rent: number;
  billingStatus: 'Paid' | 'Due';
  roomId: number;
}

export interface Room {
  id: number;
  tenants: Tenant[];
}

export type MaintenanceStatus = 'Reported' | 'In Progress' | 'Completed';
export type MaintenancePriority = 'Low' | 'Medium' | 'High';

export interface MaintenanceRequest {
    id: string;
    roomId: number;
    description: string;
    status: MaintenanceStatus;
    priority: MaintenancePriority;
    assignedTo: string;
    reportedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export type View = 'home' | 'rooms' | 'billing' | 'maintenance' | 'announcements' | 'audit';

export type User = { role: 'admin' } | { role: 'tenant'; tenant: Tenant };
