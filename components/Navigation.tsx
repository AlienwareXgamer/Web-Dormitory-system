/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'framer-motion';
import type { View } from '../types';

interface NavigationProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const navIcons = {
    home: '🏠',
    rooms: '🚪',
    billing: '💰',
    maintenance: '🔧'
};

export const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
    const views: View[] = ['home', 'rooms', 'billing', 'maintenance'];
    return (
        <nav className="main-nav">
            <ul>
                {views.map(view => (
                    <li key={view}>
                        <button onClick={() => setActiveView(view)} className={`nav-link ${activeView === view ? 'active' : ''}`}>
                            <span aria-hidden="true">{navIcons[view]}</span>
                            <span>{view.charAt(0).toUpperCase() + view.slice(1)}</span>
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