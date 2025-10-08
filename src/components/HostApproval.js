import React, { useState } from 'react';
const INITIAL_HOSTS_DATA = [
  { id: 101, name: "Maria Rodriguez", status: "Pending", email: "maria.r@example.com" },
  { id: 102, name: "Tech Events Co.", status: "Pending", email: "support@techevents.com" },
  { id: 103, name: "Local Charity Group", status: "Pending", email: "charity@local.org" },
];

const HostApproval = () => {
  // State 1: Holds all hosts (to display the list)
  const [hosts, setHosts] = useState(INITIAL_HOSTS_DATA);
  
  // State 2: Holds the host currently selected for approval
  const [selectedHost, setSelectedHost] = useState(null); 

  // --- HANDLER FUNCTIONS ---
  
  // Function called when a user clicks an item in the list
  const handleSelectHost = (hostData) => {
    setSelectedHost(hostData);
  };

  const updateHostStatus = (hostId, newStatus) => {
    // Update the status in the main list
    setHosts(prevHosts => prevHosts.map(h => 
      h.id === hostId ? { ...h, status: newStatus } : h
    ));
    setSelectedHost(null); // Go back to the list view
  };

  const handleApprove = () => {
    if (selectedHost) {
      alert(`Host: ${selectedHost.name} APPROVED!`);
      updateHostStatus(selectedHost.id, 'Approved');
    } else {
      alert('Please select a host first.');
    }
  };

  const handleDeny = () => {
    if (selectedHost) {
      alert(`Host: ${selectedHost.name} DENIED!`);
      updateHostStatus(selectedHost.id, 'Denied');
    } else {
      alert('Please select a host first.');
    }
  };

  // --- RENDERING VIEWS ---

  // Renders the list of hosts awaiting approval
  const renderHostsList = () => (
    <div className="event-list-box list-view">
      {hosts.map((host) => (
        <div 
          key={host.id}
          className="list-item"
          onClick={() => handleSelectHost(host)}
        >
          {host.name} <span style={{ float: 'right', fontWeight: 'bold' }}>[{host.status}]</span>
        </div>
      ))}
      {hosts.length === 0 && <p style={{textAlign: 'center', paddingTop: '100px'}}>No hosts pending approval.</p>}
    </div>
  );

  // Renders the detail/approval screen for the selected host
  const renderApprovalScreen = () => (
    <>
      <h2 className="subtitle">{selectedHost.name}</h2>
      
      {/* Host Details Display Box (mimicking the poster box) */}
      <div className="event-list-box detail-view host-details-box" style={{ padding: '20px', cursor: 'default' }}>
        <p><strong>Email:</strong> {selectedHost.email}</p>
        <p><strong>ID:</strong> {selectedHost.id}</p>
        <p>-- (Additional host profile info goes here) --</p>
      </div>

      <button className="action-button" onClick={handleApprove}>Approve</button>
      <button className="action-button" onClick={handleDeny}>Deny</button>
      
      {/* Back button */}
      <button 
        className="action-button" 
        onClick={() => setSelectedHost(null)}
        style={{ backgroundColor: '#ccc', marginTop: '20px' }}
      >
        &lt; Back to List
      </button>
    </>
  );

  // --- MAIN RENDER ---
  return (
    <div className="event-approval">
      
      {/* The main title for this section */}
      <h1 className="title">Approve Hosts</h1>
      
      {/* Conditional rendering based on whether a host is selected */}
      {selectedHost ? renderApprovalScreen() : renderHostsList()}
    </div>
  );
};

export default HostApproval;