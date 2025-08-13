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

export interface MaintenanceRequest {
    id: string;
    roomId: number;
    description: string;
    status: MaintenanceStatus;
    reportedDate: string;
}

export type View = 'home' | 'rooms' | 'billing' | 'maintenance';

export type User = { role: 'admin' } | { role: 'tenant'; tenant: Tenant };
