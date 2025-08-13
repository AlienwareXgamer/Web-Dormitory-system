/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon } from './icons';

export const ThemeToggle = ({ theme, onToggle }) => {
    return (
        <motion.button
            onClick={onToggle}
            className="icon-only-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            style={{ width: 40, height: 40, overflow: 'hidden' }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ y: theme === 'dark' ? 20 : -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: theme === 'dark' ? -20 : 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
};