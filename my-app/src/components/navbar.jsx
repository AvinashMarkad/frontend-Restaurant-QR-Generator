import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// --- You can copy this entire block into your React project ---

// A simple, stylish SVG logo component
const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="95" stroke="#4A7C59" strokeWidth="10"/>
    <path d="M60 100 L100 60 L140 100 L100 140 Z" fill="#A3D9B1" />
    <circle cx="100" cy="100" r="15" fill="#4A7C59"/>
  </svg>
);


// The main App component containing the Navbar and styles
export default function App() {

  const navLinkVariants = {
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        duration: 0.2,
        type: 'spring',
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <>
      {/* This style block contains all the custom CSS. 
        Placing it here makes the component self-contained.
      */}
      <style type="text/css">
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
          @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

          body {
            font-family: 'Poppins', sans-serif;
            background-color: #f5f5f5; /* A light background to make the navbar pop */
          }

          .navbar-custom {
            background: linear-gradient(to right, #e8f5e9, #dcedc8); /* Soft green gradient */
            padding: 1rem 0; /* Let the inner container manage horizontal padding */
            border-radius: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            margin: 0; /* Removed margin for full width */
          }

          .navbar-custom .navbar-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            color: #2e7d32 !important; /* Darker green for contrast */
            font-size: 1.4rem;
          }

          .navbar-custom .nav-link {
            color: #4a7c59 !important; /* Primary soft green text color */
            font-weight: 500;
            margin: 0 10px;
            padding: 8px 15px !important;
            border-radius: 8px;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          /* This class is for the motion component wrapper */
          .motion-nav-link {
            display: inline-block; /* Important for motion transforms */
          }
        `}
      </style>

      <Navbar expand="lg" className="navbar-custom">
        <Container className="px-5">
          <Navbar.Brand href="#home">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Logo />
            </motion.div>
            <span>GreenQR</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <motion.div
                className="motion-nav-link"
                variants={navLinkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Nav.Link href="/">Home</Nav.Link>
              </motion.div>
              <motion.div
                className="motion-nav-link"
                variants={navLinkVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Nav.Link href="/qr-manager">QR-Generatore</Nav.Link>
              </motion.div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}


