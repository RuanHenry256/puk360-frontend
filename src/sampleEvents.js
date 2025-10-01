// src/sampleEvents.js
import BERTS from './posters/BERTS.png';
import CampusReboot from './posters/CampusReboot.jpg';
import ClashChoirs from './posters/ClashChoirs.png';
import Exhibition from './posters/Exhibition.png';

export const sampleEvents = [
  { id: 1, title: 'NWU Berts Bricks AC Night Race', date: '2025-10-01', category: 'Sports', location: 'Potchefstroom', image: BERTS },
  { id: 2, title: 'Campus Reboot', date: '2025-10-02', category: 'Music', location: 'Mahikeng', image: CampusReboot },
  { id: 3, title: 'Clash of the Choirs', date: '2025-07-25', category: 'Music', location: 'Vanderbilpark', image: ClashChoirs },
  { id: 4, title: 'Threads Exhibition', date: '2024-10-23', category: 'Art', location: 'NWU Botanical Garden Gallery', image: Exhibition },
];

export const formatEventDate = (dateString) =>
  new Date(`${dateString}T00:00:00`).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
