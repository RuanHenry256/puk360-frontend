import React, { useState } from 'react';

// Sample data for a list of events
const INITIAL_EVENTS_DATA = [
  { 
    id: 1, 
    title: "Exhibition", 
    status: "Pending",
    posterUrl: "/images/Exhibition.png", // Use the public path for the new image
  },
  { 
    id: 2, 
    title: "CampusReboot", 
    status: "Pending",
    posterUrl: "/images/CampusReboot.jpg", // Assume you add another image
  },
  { 
    id: 3, 
    title: "ClashChoirs", 
    status: "Pending",
    posterUrl: "/images/ClashChoirs.png", // Assume you add another image
  },
];

const EventApproval = () => {
  // State 1: Holds all events (to display the list)
  const [events, setEvents] = useState(INITIAL_EVENTS_DATA);
  
  // State 2: Holds the event currently selected for approval (shows the poster/detail view)
  const [selectedEvent, setSelectedEvent] = useState(null); 

  // --- HANDLER FUNCTIONS ---
  
  // Function called when a user clicks an item in the list
  const handleSelectEvent = (eventData) => {
    setSelectedEvent(eventData);
  };

  const handleApprove = () => {
    if (selectedEvent) {
      alert(`Event: ${selectedEvent.title} APPROVED!`);
      // Update the status in the main list
      setEvents(prevEvents => prevEvents.map(e => 
        e.id === selectedEvent.id ? { ...e, status: 'Approved' } : e
      ));
      setSelectedEvent(null); // Return to the list view
    }
  };

  const handleDeny = () => {
    if (selectedEvent) {
      alert(`Event: ${selectedEvent.title} DENIED!`);
      // Update the status in the main list
      setEvents(prevEvents => prevEvents.map(e => 
        e.id === selectedEvent.id ? { ...e, status: 'Denied' } : e
      ));
      setSelectedEvent(null); // Return to the list view
    }
  };

  // --- RENDERING VIEWS ---

  // Renders the list of events when nothing is selected
  const renderEventsList = () => (
    <div className="event-list-box list-view">
      {events.map((event) => (
        <div 
          key={event.id}
          className="list-item"
          onClick={() => handleSelectEvent(event)}
          style={{ 
            padding: '12px', 
            borderBottom: '1px solid #ccc', 
            cursor: 'pointer',
            backgroundColor: event.status === 'Pending' ? '#fff' : '#eee', // Style based on status
            color: event.status === 'Pending' ? '#000' : '#888',
          }}
        >
          {event.title} <span style={{ float: 'right', fontWeight: 'bold' }}>[{event.status}]</span>
        </div>
      ))}
      {events.length === 0 && <p style={{textAlign: 'center', paddingTop: '100px'}}>No events pending approval.</p>}
    </div>
  );

  // Renders the detail/approval screen (the wireframe view)
  const renderApprovalScreen = () => (
    <>
      {/* Subtitle changes to the event title */}
      <h2 className="subtitle">{selectedEvent.title}</h2>
      
      {/* The large display box, now showing the poster */}
      <div className="event-list-box detail-view">
        <img 
          src={selectedEvent.posterUrl} 
          alt={selectedEvent.title + " Poster"} 
          className="event-poster" 
        />
      </div>

      <button className="action-button" onClick={handleApprove}>Approve</button>
      <button className="action-button" onClick={handleDeny}>Deny</button>
      
      {/* Button to go back to the list */}
      <button 
        className="action-button" 
        onClick={() => setSelectedEvent(null)}
        style={{ backgroundColor: '#ccc', marginTop: '20px' }}
      >
        &lt; Back to List
      </button>
    </>
  );

  // --- MAIN RENDER ---
  return (
    <div className="event-approval">
      
      {/* Static Label: "List of events" */}
      <h1 className="title">List of events</h1>
      
      {/* Conditional Rendering: If no event is selected, show the list. Otherwise, show the approval screen. */}
      {selectedEvent ? renderApprovalScreen() : renderEventsList()}
    </div>
  );
};

export default EventApproval;