/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'framer-motion';
import { MAX_TENANTS_PER_ROOM } from '../constants';
import type { Room } from '../types';

interface RoomCardProps {
    room: Room;
    onRemoveTenant: (roomId: number, tenantId: string) => void;
    onToggleBilling: (roomId: number, tenantId: string) => void;
}

export const RoomCard = ({ room, onRemoveTenant, onToggleBilling }: RoomCardProps) => {
  const occupancy = room.tenants.length;
  const occupancyText = `${occupancy}/${MAX_TENANTS_PER_ROOM} Occupied`;
  const cardStatusClass = occupancy === 0 ? 'status-vacant' : occupancy < MAX_TENANTS_PER_ROOM ? 'status-partial' : 'status-full';

  return (
    <div className={`room-card ${cardStatusClass}`}>
      <div className="room-header">
        <h3>Room {room.id}</h3>
        <span className="occupancy-status">{occupancyText}</span>
      </div>
      <div className="tenant-list">
        {room.tenants.length > 0 ? (
          room.tenants.map((tenant) => (
            <div key={tenant.id} className="tenant-info">
              <div className="tenant-details">
                <span className="tenant-name">{tenant.name}</span>
                <span className="tenant-rent">Rent: ${tenant.rent}/mo</span>
                <span className={`billing-status billing-${tenant.billingStatus.toLowerCase()}`}>
                  {tenant.billingStatus}
                </span>
              </div>
              <div className="tenant-actions">
                 <motion.button
                    onClick={() => onToggleBilling(room.id, tenant.id)}
                    className="btn-billing"
                    aria-label={`Mark bill as ${tenant.billingStatus === 'Due' ? 'Paid' : 'Due'} for ${tenant.name}`}
                    whileHover={{ scale: 1.05, backgroundColor: '#30363d' }}
                    whileTap={{ scale: 0.95 }}
                 >
                    Toggle Bill
                 </motion.button>
                 <motion.button
                    onClick={() => onRemoveTenant(room.id, tenant.id)}
                    className="btn-remove"
                    aria-label={`Remove ${tenant.name}`}
                    whileHover={{ scale: 1.2, color: 'var(--error-color)' }}
                    whileTap={{ scale: 0.9 }}
                 >
                    &times;
                 </motion.button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-tenants">This room is vacant.</p>
        )}
      </div>
    </div>
  );
};