import React from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import HistoryItem from './HistoryItem';

// This component is responsible for displaying the list of saved QR codes.
const HistoryList = ({ isLoading, history, handleDelete, getImageUrl, placeholderDataUrl }) => {
    return (
        <>
            <hr />
            <h2 className="text-center my-4" style={{ color: "#2F4F4F" }}>
                Saved QR Codes
            </h2>

            {isLoading && (
                <div className="text-center">
                    <Spinner animation="border" variant="success" />
                </div>
            )}

            <Row>
                <AnimatePresence>
                    {!isLoading && history.map((item) => (
                        <HistoryItem 
                            key={item.id}
                            item={item}
                            handleDelete={handleDelete}
                            getImageUrl={getImageUrl}
                            placeholderDataUrl={placeholderDataUrl}
                        />
                    ))}
                </AnimatePresence>
            </Row>
            {!isLoading && history.length === 0 && <p className="text-center text-muted">No saved QR codes found.</p>}
        </>
    );
};

export default HistoryList;
