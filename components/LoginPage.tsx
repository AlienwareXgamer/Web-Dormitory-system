/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const LoginPage = ({ onAdminLogin, onTenantLogin }) => {
    const [activeTab, setActiveTab] = useState('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState('');

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!onAdminLogin(email, password)) {
            setError('Invalid admin credentials.');
        }
    };

    const handleTenantSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!onTenantLogin(name, roomId)) {
            setError('Tenant not found or invalid room number.');
        }
    };

    const renderAdminForm = () => (
        <motion.form
            key="admin-form"
            className="login-form"
            onSubmit={handleAdminSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
        >
            <div className="form-group">
                <label htmlFor="email">Admin Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@dorm.com"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    required
                />
            </div>
            <button type="submit" className="btn-primary">Login as Admin</button>
        </motion.form>
    );

    const renderTenantForm = () => (
        <motion.form
            key="tenant-form"
            className="login-form"
            onSubmit={handleTenantSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
        >
            <div className="form-group">
                <label htmlFor="tenant-name">Full Name</label>
                <input
                    id="tenant-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Doe"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="room-id">Room Number</label>
                <input
                    id="room-id"
                    type="number"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="e.g., 1"
                    required
                />
            </div>
            <button type="submit" className="btn-primary">Login as Tenant</button>
        </motion.form>
    );

    return (
        <div className="login-container">
            <motion.div
                className="login-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h1>DMS Login</h1>
                <div className="login-tabs">
                    <button onClick={() => { setActiveTab('admin'); setError(''); }} className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}>Admin</button>
                    <button onClick={() => { setActiveTab('tenant'); setError(''); }} className={`login-tab ${activeTab === 'tenant' ? 'active' : ''}`}>Tenant</button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'admin' ? renderAdminForm() : renderTenantForm()}
                </AnimatePresence>

                <div className="login-error">{error}</div>
            </motion.div>
        </div>
    );
};
