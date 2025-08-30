import React from 'react';
import { Alert } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// A dedicated, reusable component for displaying animated alerts with icons.
const AlertMessage = ({ variant, message, setMessage }) => {
    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        ),
        danger: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" x2="12" y1="9" y2="13"></line>
                <line x1="12" x2="12.01" y1="17" y2="17"></line>
            </svg>
        ),
    };

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Alert variant={variant} onClose={() => setMessage(null)} dismissible className="d-flex align-items-center">
                {icons[variant]}
                {message}
            </Alert>
        </motion.div>
    );
};

export default AlertMessage;
