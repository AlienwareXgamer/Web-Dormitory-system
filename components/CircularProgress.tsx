/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { motion } from 'framer-motion';

export const CircularProgress = ({ percentage, size = 120 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-circle" style={{transform: 'rotate(-90deg)'}}>
             <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#58a6ff" />
                    <stop offset="100%" stopColor="#1f6feb" />
                </linearGradient>
            </defs>
            <circle
                className="progress-circle-bg"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
            />
            <motion.circle
                className="progress-circle-fg"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
            />
            <text x={size/2} y={size/2} className="progress-circle-text">
                {`${percentage}%`}
            </text>
        </svg>
    );
};