import React from 'react';

// --- MOCK ANALYTICS DATA ---
const ANALYTICS_DATA = {
    // Event Data
    totalEventsSubmitted: 45,
    totalEventsApproved: 38,
    totalEventsDenied: 7,

    // Host Data
    totalHostsSubmitted: 12,
    totalHostsApproved: 10,
    totalHostsDenied: 2,

    // Recent Approvals (Example data)
    recentApprovals: [
        { type: "Event", name: "Career Day: Alumni Panel", date: "Oct 5, 2025" },
        { type: "Host", name: "Chess Club Revival", date: "Oct 4, 2025" },
        { type: "Event", name: "Midnight Movie Marathon", date: "Oct 3, 2025" },
        { type: "Host", name: "International Student Union", date: "Oct 1, 2025" },
    ]
};
// --- END MOCK ANALYTICS DATA ---

const AnalyticsMonitor = () => {
    // --- CALCULATIONS ---
    const eventApprovalRate = (ANALYTICS_DATA.totalEventsApproved / ANALYTICS_DATA.totalEventsSubmitted) * 100;
    const hostApprovalRate = (ANALYTICS_DATA.totalHostsApproved / ANALYTICS_DATA.totalHostsSubmitted) * 100;

    const formatRate = (rate) => {
        if (isNaN(rate)) return "0.00%";
        return rate.toFixed(2) + "%";
    };

    const renderMetricBox = (title, value, description, color = '#333') => (
        <div style={{ ...styles.metricBox, borderColor: color }}>
            <h3 style={styles.metricTitle}>{title}</h3>
            <p style={{ ...styles.metricValue, color: color }}>{value}</p>
            <p style={styles.metricDescription}>{description}</p>
        </div>
    );

    return (
        <div className="analytics-monitor" style={styles.mainContainer}>
            <h1 style={styles.h1}>Approval Analytics Dashboard 📊</h1>

            {/* --- METRICS GRID --- */}
            <div style={styles.gridContainer}>
                {renderMetricBox(
                    "Event Approval Rate", 
                    formatRate(eventApprovalRate), 
                    `(${ANALYTICS_DATA.totalEventsApproved} approved out of ${ANALYTICS_DATA.totalEventsSubmitted})`, 
                    '#007bff'
                )}
                {renderMetricBox(
                    "Host Approval Rate", 
                    formatRate(hostApprovalRate), 
                    `(${ANALYTICS_DATA.totalHostsApproved} approved out of ${ANALYTICS_DATA.totalHostsSubmitted})`, 
                    '#28a745'
                )}
                {renderMetricBox(
                    "Total Events Denied", 
                    ANALYTICS_DATA.totalEventsDenied, 
                    "Events not meeting guidelines.", 
                    '#dc3545'
                )}
                {renderMetricBox(
                    "New Host Applications", 
                    ANALYTICS_DATA.totalHostsSubmitted, 
                    "Total host applications received.", 
                    '#ffc107'
                )}
            </div>

            {/* --- RECENT ACTIVITY --- */}
            <h2 style={styles.h2}>Recent Approvals & Activity</h2>
            <div style={styles.activityBox}>
                {ANALYTICS_DATA.recentApprovals.map((item, index) => (
                    <div key={index} style={styles.activityItem}>
                        <span style={{ 
                            ...styles.activityBadge, 
                            backgroundColor: item.type === 'Event' ? '#007bff' : '#28a745' 
                        }}>
                            {item.type}
                        </span>
                        <span style={styles.activityName}>{item.name}</span>
                        <span style={styles.activityDate}>{item.date}</span>
                    </div>
                ))}
            </div>
            
            <p style={styles.footerNote}>Data is for demonstration purposes only and reflects mock data. Approval rates can help identify potential issues with submission guidelines or host education.</p>
        </div>
    );
};

export default AnalyticsMonitor;

// --- Basic Inline Styles ---
const styles = {
    mainContainer: { padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
    h1: { fontSize: '30px', fontWeight: 'bold', margin: '0 0 20px 0', textAlign: 'center' },
    h2: { fontSize: '20px', fontWeight: 'bold', margin: '30px 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        marginBottom: '20px',
    },
    metricBox: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    metricTitle: { fontSize: '14px', margin: 0, color: '#666' },
    metricValue: { fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0' },
    metricDescription: { fontSize: '12px', margin: '5px 0 0 0', color: '#888' },
    
    activityBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        padding: '10px 15px',
        border: '1px solid #eee',
    },
    activityItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px dotted #ddd',
    },
    activityBadge: {
        fontSize: '10px',
        color: '#fff',
        padding: '3px 6px',
        borderRadius: '4px',
        fontWeight: 'bold',
        minWidth: '50px',
        textAlign: 'center',
        marginRight: '10px',
    },
    activityName: {
        flexGrow: 1,
        fontSize: '14px',
    },
    activityDate: {
        fontSize: '12px',
        color: '#999',
    },
    footerNote: {
        fontSize: '12px',
        color: '#999',
        textAlign: 'center',
        marginTop: '30px',
        borderTop: '1px solid #eee',
        paddingTop: '10px',
    }
};