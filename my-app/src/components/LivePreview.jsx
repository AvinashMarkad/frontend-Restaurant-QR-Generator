import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

// This component only handles showing the live preview image.
const LivePreview = ({ link }) => {
    return (
        <div className="text-center mt-4 mt-md-0">
            <AnimatePresence>
                {link && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                        <h5 className="text-muted mb-3">Live Preview</h5>
                        <div className="p-3 bg-white d-inline-block shadow-sm" style={{ borderRadius: "15px" }}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(link)}`} 
                                alt="Live QR Code Preview" 
                                width="160" 
                                height="160" 
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LivePreview;
