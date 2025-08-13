/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'framer-motion';

export const AuthPage = ({ onSelectRole }) => {
  return (
    <motion.div
        className="login-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
    >
        <div className="login-box auth-choice-box">
            <h1>Dormitory Management System</h1>
            <p>Please select your role to continue.</p>
            <div className="auth-actions">
                <motion.button
                    onClick={() => onSelectRole('admin')}
                    className="btn-primary auth-choice-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Admin Login
                </motion.button>
                <motion.button
                    onClick={() => onSelectRole('tenant')}
                    className="btn-secondary auth-choice-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Tenant Login
                </motion.button>
            </div>
      </div>
    </motion.div>
  );
};