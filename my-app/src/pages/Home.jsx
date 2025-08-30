import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// A simple placeholder for a QR code icon using SVG
const QrCodeIcon = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#2E8B57" fillOpacity="0.1"/>
        <rect x="20" y="20" width="25" height="25" rx="5" fill="#2F4F4F"/>
        <rect x="55" y="20" width="25" height="25" rx="5" fill="#2F4F4F"/>
        <rect x="20" y="55" width="25" height="25" rx="5" fill="#2F4F4F"/>
        <rect x="55" y="55" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="65" y="55" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="75" y="55" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="55" y="65" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="75" y="65" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="55" y="75" width="6" height="6" rx="2" fill="#2F4F4F"/>
        <rect x="65" y="75" width="6" height="6" rx="2" fill="#2F4F4F"/>
    </svg>
);

const HomePage = () => {
    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div style={{
            backgroundColor: '#F0FFF4',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
            overflow: 'hidden'
        }}>
            <Container>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.div variants={itemVariants}>
                        <QrCodeIcon />
                    </motion.div>
                    
                    <motion.h1
                        variants={itemVariants}
                        className="display-4 mt-4"
                        style={{ color: '#2F4F4F', fontWeight: 'bold' }}
                    >
                        QR Code Generatore For Your Restaurant Menu
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="lead text-muted mt-3 mb-5"
                        style={{ maxWidth: '600px', margin: '0 auto' }}
                    >
                        Create, manage, and share QR codes instantly. Our tool provides a seamless live preview and a persistent history of all your creations.
                    </motion.p>
                    
                    <motion.div variants={itemVariants}>
  <Button
    as={motion(Link)}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    variant="success"
    size="lg"
    style={{
      backgroundColor: "#2E8B57",
      borderColor: "#2E8B57",
      borderRadius: "50px",
      padding: "15px 40px",
      fontWeight: "600",
      boxShadow: "0px 10px 20px rgba(46, 139, 87, 0.2)",
    }}
    to="/qr-manager"
  >
    Get Started Now
  </Button>
</motion.div>
                </motion.div>
            </Container>
        </div>
    );
};

export default HomePage;

