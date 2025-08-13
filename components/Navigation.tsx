/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'framer-motion';
import type { View } from '../types';
import { HomeIcon, BuildingOfficeIcon, BanknotesIcon, WrenchScrewdriverIcon, MegaphoneIcon, ShieldCheckIcon } from './icons';

interface NavigationProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const navItems: { view: View, label: string, icon: JSX.Element }[] = [
    { view: 'home', label: 'Home', icon: <HomeIcon /> },
    { view: 'rooms', label: 'Rooms', icon: <BuildingOfficeIcon /> },
    { view: 'billing', label: 'Billing', icon: <BanknotesIcon /> },
    { view: 'maintenance', label: 'Maintenance', icon: <WrenchScrewdriverIcon /> },
    { view: 'announcements', label: 'Announcements', icon: <MegaphoneIcon /> },
    { view: 'audit', label: 'Audit Log', icon: <ShieldCheckIcon /> },
];

export const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
    return (
        <nav className="main-nav">
            <ul>
                {navItems.map(({ view, label, icon }) => (
                    <li key={view}>
                        <button onClick={() => setActiveView(view)} className={`nav-link ${activeView === view ? 'active' : ''}`}>
                            {icon}
                            <span>{label}</span>
                             {activeView === view && (
                                <motion.div className="active-nav-indicator" layoutId="active-nav-indicator" />
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
