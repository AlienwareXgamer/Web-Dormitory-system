/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import type { Tenant, MaintenanceRequest } from '../types';
import { TOTAL_ROOMS, MAX_TENANTS_PER_ROOM } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a monthly summary report using the Gemini API.
 * This function simulates a server-side API endpoint.
 * @param allTenants - Array of all tenants.
 * @param maintenanceRequests - Array of all maintenance requests.
 * @returns The generated report text.
 */
export async function generateReportAPI(allTenants: Tenant[], maintenanceRequests: MaintenanceRequest[]): Promise<string> {
    const totalTenants = allTenants.length;
    const tenantsWithDuePayment = allTenants.filter(t => t.billingStatus === 'Due');
    const totalIncome = allTenants.filter(t => t.billingStatus === 'Paid').reduce((sum, t) => sum + t.rent, 0);
    const openMaintenanceRequests = maintenanceRequests.filter(r => r.status !== 'Completed');

    const promptData = `
        Dormitory Status:
        - Total Rooms: ${TOTAL_ROOMS}
        - Total Capacity: ${TOTAL_ROOMS * MAX_TENANTS_PER_ROOM}
        - Current Tenants: ${totalTenants}
        - Occupancy Rate: ${((totalTenants / (TOTAL_ROOMS * MAX_TENANTS_PER_ROOM)) * 100).toFixed(1)}%
        - Total Collected Rent This Month: $${totalIncome}
        - Tenants with outstanding payments: ${tenantsWithDuePayment.length}
        - Details of tenants with due payments: ${tenantsWithDuePayment.map(t => `${t.name} ($${t.rent})`).join(', ') || 'None'}
        - Open Maintenance Requests: ${openMaintenanceRequests.length}
        - Details of open requests: ${openMaintenanceRequests.map(r => `Room ${r.roomId}: ${r.description}`).join('; ') || 'None'}

        Based on the data above, please generate a concise and professional monthly summary report for the dormitory manager.
        Structure the report with the following sections:
        1.  **Overall Summary**: A brief overview of the key metrics (occupancy, finances).
        2.  **Financial Status**: Comment on the income and outstanding dues.
        3.  **Maintenance Report**: Summarize the current maintenance load and mention any critical open issues.
        4.  **Action Items**: Suggest actions for the manager, like following up with tenants who have due payments and prioritizing urgent maintenance.
      `;

      try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptData,
        });
        return response.text;
      } catch (error) {
        console.error("Error in generateReportAPI:", error);
        throw new Error("Failed to generate report from API.");
      }
}