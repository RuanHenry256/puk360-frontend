import React, { useState } from 'react';

// --- MOCK DATA FOR DEMONSTRATION ---
const INITIAL_EVENTS_DATA = [
    {
        id: 1,
        title: "Exhibition: Student Artwork",
        status: "Pending",
        hostName: "Arts Society",
        description: "A showcase of the best student pieces from the semester. Light refreshments will be served.",
        posterUrl: "/posters/Exhibition.png"
    },
    {
        id: 2,
        title: "Campus Reboot: Spring Clean",
        status: "Pending",
        hostName: "SRC Environmental",
        description: "Join us in tidying up the campus grounds. Free t-shirts and lunch for all volunteers!",
        posterUrl: "/posters/CampusReboot.jpg",
    },
    {
        id: 3,
        title: "Clash of the Choirs",
        status: "Approved", 
        hostName: "Cultural Affairs",
        description: "The biggest singing competition of the year. Hostels battle for the title.",
        posterUrl: "/posters/ClashChoirs.png",
    },
    {
        id: 4,
        title: "Tech Career Day",
        status: "Approved", 
        hostName: "Computer Science Dept.",
        description: "Network with top tech companies and alumni.",
        posterUrl: "/posters/TechDay.png",
    },
    {
        id: 5,
        title: "Unauthorized Party",
        status: "Denied", 
        hostName: "Rogue Group",
        description: "An unsanctioned event not following campus guidelines.",
        posterUrl: null,
    },
];
// --- END MOCK DATA ---


const EventApproval = () => {
    const [events, setEvents] = useState(INITIAL_EVENTS_DATA);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentList, setCurrentList] = useState('pending'); 

    // --- HANDLER FUNCTIONS ---

    // Allows viewing details for any event status
    const handleSelectEvent = (eventData) => {
        setSelectedEvent(eventData);
    };

    const handleBackToList = () => {
        setSelectedEvent(null);
    };

    const handleStatusUpdate = (status) => {
        if (!selectedEvent) return;
        const action = status.charAt(0).toUpperCase() + status.slice(1);

        alert(`Event: "${selectedEvent.title}" ${action}!`);

        setEvents(prevEvents => prevEvents.map(e =>
            e.id === selectedEvent.id ? { ...e, status: action } : e
        ));
        setSelectedEvent(null);
    };

    const handleApprove = () => handleStatusUpdate('Approved');
    const handleDeny = () => handleStatusUpdate('Denied');

    const handleListSwitch = (listType) => {
        setSelectedEvent(null); 
        setCurrentList(listType);
    };


// --- RENDERING VIEWS ---

    const renderEventsList = () => {
        const filteredEvents = events.filter(e => 
            e.status.toLowerCase() === currentList
        );

        let badgeStyle = styles.statusPending;
        if (currentList === 'approved') {
            badgeStyle = styles.statusApproved;
        } else if (currentList === 'denied') { 
            badgeStyle = styles.statusDenied;
        }

        return (
            <div className="event-list-box list-view" style={styles.listContainer}>
                {filteredEvents.length === 0 ? (
                    <p style={styles.centerText}>No {currentList} events found in the queue.</p>
                ) : (
                    filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="list-item"
                            // Now clickable regardless of status
                            onClick={() => handleSelectEvent(event)}
                            style={{ ...styles.listItem, cursor: 'pointer' }}
                        >
                            {event.title} 
                            <span style={{ ...styles.statusBadge, color: badgeStyle.color }}>
                                {event.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        );
    };

    const renderApprovalScreen = () => (
        <>
            {/* REMOVED "Back to List" from the top */}
            
            <h2 className="subtitle" style={styles.subtitle}>{selectedEvent.title}</h2>

            <div className="event-list-box detail-view" style={styles.detailContainer}>
                {selectedEvent.posterUrl ? (
                    <img
                        src={selectedEvent.posterUrl}
                        alt={selectedEvent.title + " Poster"}
                        style={styles.posterImage}
                    />
                ) : (
                    <p style={styles.posterPlaceholder}>[Poster Not Available]</p>
                )}
                
                <div style={styles.detailsSection}>
                    {/* Display current status with appropriate badge style */}
                    <p>
                        <strong>Status:</strong> 
                        <span style={{ 
                            ...styles.statusBadge, 
                            color: styles[`status${selectedEvent.status}`] ? styles[`status${selectedEvent.status}`].color : 'black' 
                        }}>
                            {selectedEvent.status}
                        </span>
                    </p>
                    <p><strong>Host:</strong> {selectedEvent.hostName || 'N/A'}</p>
                    <p><strong>Description:</strong> {selectedEvent.description || 'No description provided.'}</p>
                </div>
            </div>

            {/* Conditionally show Approve/Deny buttons only for PENDING status */}
            {selectedEvent.status === 'Pending' && (
                <div style={styles.actionButtonContainer}>
                    <button
                        className="action-button"
                        onClick={handleApprove}
                        style={{ ...styles.actionButton, backgroundColor: styles.statusApproved.backgroundColor }}
                    >
                        Approve ✅
                    </button>
                    <button
                        className="action-button"
                        onClick={handleDeny}
                        style={{ ...styles.actionButton, backgroundColor: styles.statusDenied.backgroundColor }}
                    >
                        Deny ❌
                    </button>
                </div>
            )}

            {/* ADDED "Back to List" at the bottom */}
            <div
                onClick={handleBackToList}
                // Style slightly adjusted for bottom placement
                style={{ fontSize: '18px', cursor: 'pointer', textAlign: 'center', margin: '20px 0 10px 0' }}
            >
                &lt; Back to List
            </div>
        </>
    );

    // --- MAIN RENDER ---
    return (
        <div className="event-approval" style={styles.mainContainer}>
            <h1 style={styles.h1}>Event Management</h1>

            {/* Navigation Tabs with requested full names */}
            {!selectedEvent && (
                <div style={styles.tabsContainer}>
                    <button 
                        onClick={() => handleListSwitch('pending')} 
                        style={currentList === 'pending' ? styles.tabActive : styles.tabInactive}
                    >
                        Pending Queue ({events.filter(e => e.status === 'Pending').length})
                    </button>
                    <button 
                        onClick={() => handleListSwitch('approved')} 
                        style={currentList === 'approved' ? styles.tabActive : styles.tabInactive}
                    >
                        Approved Events ({events.filter(e => e.status === 'Approved').length})
                    </button>
                    <button 
                        onClick={() => handleListSwitch('denied')} 
                        style={currentList === 'denied' ? styles.tabActiveDenied : styles.tabInactive}
                    >
                        Denied Events ({events.filter(e => e.status === 'Denied').length})
                    </button>
                </div>
            )}
            
            {selectedEvent ? renderApprovalScreen() : renderEventsList()}
        </div>
    );
};

export default EventApproval;

// --- Basic Inline Styles ---
const styles = {
    mainContainer: { padding: '20px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }, 
    h1: { fontSize: '30px', fontWeight: 'bold', margin: '0 0 5px 0' },
    subtitle: { fontSize: '24px', marginBottom: '10px' },
    centerText: {textAlign: 'center', paddingTop: '100px', color: '#888'},
    listContainer: { backgroundColor: '#f0f0f0', minHeight: '300px', borderRadius: '8px', padding: '10px' },
    listItem: {
        padding: '12px',
        backgroundColor: '#fff',
        marginBottom: '5px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    statusPending: { color: '#ffc107', backgroundColor: 'lightyellow' },
    statusApproved: { color: '#28a745', backgroundColor: 'lightgreen' },
    statusDenied: { color: '#dc3545', backgroundColor: 'lightcoral' },
    statusBadge: { fontWeight: 'bold' },
    detailContainer: {
        backgroundColor: '#fff',
        minHeight: '300px',
        borderRadius: '8px',
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ccc'
    },
    posterImage: {
        width: '100%',
        maxHeight: '150px',
        objectFit: 'cover',
        marginBottom: '10px',
        borderRadius: '4px'
    },
    posterPlaceholder: {
        textAlign: 'center',
        padding: '40px 0',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        marginBottom: '10px',
        color: '#999'
    },
    detailsSection: {
        padding: '10px',
        borderTop: '1px solid #eee'
    },
    actionButtonContainer: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    actionButton: {
        padding: '15px',
        color: 'black',
        width: '100%',
        border: 'none',
        borderRadius: '5px',
        marginBottom: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    tabsContainer: {
        display: 'flex',
        marginBottom: '15px',
        borderBottom: '1px solid #ddd',
    },
    tabBase: {
        flex: 1, 
        padding: '10px 5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        borderRadius: '5px 5px 0 0',
        textAlign: 'center',
    },
};

styles.tabActive = { ...styles.tabBase, backgroundColor: '#e0e0e0', fontWeight: 'bold', borderBottom: '2px solid #007bff' };
styles.tabInactive = { ...styles.tabBase, backgroundColor: '#f4f4f4', color: '#666', borderBottom: '2px solid transparent' };
styles.tabActiveDenied = { ...styles.tabBase, backgroundColor: '#f5c6cb', fontWeight: 'bold', borderBottom: '2px solid #dc3545' };