import React, { useState } from 'react';

// --- MOCK DATA FOR HOSTS ---
const INITIAL_HOSTS_DATA = [
    {
        id: 101,
        name: "Campus Environmental Club",
        status: "Pending",
        email: "envclub@university.edu",
        description: "Student-run organization focused on sustainability initiatives and campus clean-ups.",
        dateSubmitted: "2025-09-20",
    },
    {
        id: 102,
        name: "University Jazz Ensemble",
        status: "Pending",
        email: "jazz@university.edu",
        description: "Official music group dedicated to preserving and performing jazz music.",
        dateSubmitted: "2025-09-25",
    },
    {
        id: 103,
        name: "History Majors Association",
        status: "Approved",
        email: "history@university.edu",
        description: "Academic society for history students, organizing lectures and field trips.",
        dateSubmitted: "2025-08-15",
    },
    {
        id: 104,
        name: "Unauthorized Party Crew",
        status: "Denied",
        email: "partycrew@unverified.net",
        description: "Group seeking approval for non-sanctioned events.",
        dateSubmitted: "2025-10-01",
    },
];
// --- END MOCK DATA ---


const HostApproval = () => {
    const [hosts, setHosts] = useState(INITIAL_HOSTS_DATA);
    const [selectedHost, setSelectedHost] = useState(null);
    const [currentList, setCurrentList] = useState('pending'); // pending, approved, or denied

    // --- HANDLER FUNCTIONS ---

    const handleSelectHost = (hostData) => {
        setSelectedHost(hostData);
    };

    const handleBackToList = () => {
        setSelectedHost(null);
    };

    const handleStatusUpdate = (status) => {
        if (!selectedHost) return;
        const action = status.charAt(0).toUpperCase() + status.slice(1);

        alert(`Host: "${selectedHost.name}" ${action}!`);

        setHosts(prevHosts => prevHosts.map(h =>
            h.id === selectedHost.id ? { ...h, status: action } : h
        ));
        setSelectedHost(null);
    };

    const handleApprove = () => handleStatusUpdate('Approved');
    const handleDeny = () => handleStatusUpdate('Denied');

    const handleListSwitch = (listType) => {
        setSelectedHost(null);
        setCurrentList(listType);
    };


    // --- RENDERING VIEWS ---

    const renderHostsList = () => {
        const filteredHosts = hosts.filter(h => 
            h.status.toLowerCase() === currentList
        );

        let badgeStyle = styles.statusPending;
        if (currentList === 'approved') {
            badgeStyle = styles.statusApproved;
        } else if (currentList === 'denied') { 
            badgeStyle = styles.statusDenied;
        }

        return (
            <div className="host-list-box list-view" style={styles.listContainer}>
                {filteredHosts.length === 0 ? (
                    <p style={styles.centerText}>No {currentList} host applications.</p>
                ) : (
                    filteredHosts.map((host) => (
                        <div
                            key={host.id}
                            className="list-item"
                            onClick={() => handleSelectHost(host)}
                            style={styles.listItem}
                        >
                            {host.name} 
                            <span style={{ ...styles.statusBadge, color: badgeStyle.color }}>
                                {host.status}
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
            
            <h2 className="subtitle" style={styles.subtitle}>{selectedHost.name}</h2>

            <div className="host-list-box detail-view" style={styles.detailContainer}>
                <div style={styles.detailsSection}>
                    <p>
                        <strong>Status:</strong> 
                        <span style={{ 
                            ...styles.statusBadge, 
                            color: styles[`status${selectedHost.status}`] ? styles[`status${selectedHost.status}`].color : 'black' 
                        }}>
                            {selectedHost.status}
                        </span>
                    </p>
                    <p><strong>Email:</strong> {selectedHost.email}</p>
                    <p><strong>Submitted:</strong> {selectedHost.dateSubmitted}</p>
                    <p><strong>Description:</strong> {selectedHost.description || 'No description provided.'}</p>
                </div>
            </div>

            {/* Conditionally show Approve/Deny buttons only for PENDING status */}
            {selectedHost.status === 'Pending' && (
                <div style={styles.actionButtonContainer}>
                    <button
                        className="action-button"
                        onClick={handleApprove}
                        style={{ ...styles.actionButton, backgroundColor: styles.statusApproved.backgroundColor }}
                    >
                        Approve Host ✅
                    </button>
                    <button
                        className="action-button"
                        onClick={handleDeny}
                        style={{ ...styles.actionButton, backgroundColor: styles.statusDenied.backgroundColor }}
                    >
                        Deny Host ❌
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
        <div className="host-approval" style={styles.mainContainer}>
            <h1 style={styles.h1}>Host Approval Management</h1>

            {/* Navigation Tabs */}
            {!selectedHost && (
                <div style={styles.tabsContainer}>
                    <button 
                        onClick={() => handleListSwitch('pending')} 
                        style={currentList === 'pending' ? styles.tabActive : styles.tabInactive}
                    >
                        Pending Applications ({hosts.filter(h => h.status === 'Pending').length})
                    </button>
                    <button 
                        onClick={() => handleListSwitch('approved')} 
                        style={currentList === 'approved' ? styles.tabActive : styles.tabInactive}
                    >
                        Approved Hosts ({hosts.filter(h => h.status === 'Approved').length})
                    </button>
                    <button 
                        onClick={() => handleListSwitch('denied')} 
                        style={currentList === 'denied' ? styles.tabActiveDenied : styles.tabInactive}
                    >
                        Denied Hosts ({hosts.filter(h => h.status === 'Denied').length})
                    </button>
                </div>
            )}
            
            {selectedHost ? renderApprovalScreen() : renderHostsList()}
        </div>
    );
};

export default HostApproval;

// --- Basic Inline Styles ---
const styles = {
    mainContainer: { padding: '20px', maxWidth: '480px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }, 
    h1: { fontSize: '30px', fontWeight: 'bold', margin: '0 0 5px 0' },
    subtitle: { fontSize: '24px', marginBottom: '10px', borderBottom: '2px solid #ddd', paddingBottom: '5px' },
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
        borderRadius: '8px',
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ccc'
    },
    detailsSection: {
        padding: '10px',
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