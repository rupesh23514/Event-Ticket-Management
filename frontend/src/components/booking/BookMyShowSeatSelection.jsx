import React, { useState } from 'react';

function BookMyShowSeatSelection({ onSeatSelect, selectedSeats = [] }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  
  // Define seat categories
  const categories = [
    { id: 'elite', name: 'ELITE', price: 183 },
    { id: 'classic', name: 'CLASSIC', price: 150 }
  ];

  // Define seat layout
  const seatLayout = {
    elite: {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
      seatsPerRow: 21,
      // These are the seats that are unavailable/sold
      unavailableSeats: [
        'A1', 'A2', 'A6', 'A7', 'A8', 'A9', 'A10', 
        'B9', 'B10',
        'D9', 'D10',
        'E1', 'E2', 'E16', 'E17', 'E18',
        'F1', 'F2', 'F16', 'F17', 'F18',
        'G1', 'G2', 'G17', 'G18', 'G19', 'G20',
        'H1', 'H2', 'H17', 'H18', 'H19', 'H20',
        'I1', 'I2', 'I17', 'I18', 'I19', 'I20',
        'J1', 'J2', 'J17', 'J18', 'J19', 'J20',
        'K1', 'K2', 'K3'
      ],
      // Define which seats are shown for this category
      visibleColumns: {
        'A': [3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        'B': [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 20],
        'C': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        'D': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        'E': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        'F': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        'G': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        'H': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        'I': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        'J': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        'K': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      }
    },
    classic: {
      rows: ['L'],
      seatsPerRow: 20,
      unavailableSeats: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L19', 'L20'],
      visibleColumns: {
        'L': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      }
    }
  };

  // Handle seat click
  const handleSeatClick = (category, seatId) => {
    const fullSeatId = `${category}:${seatId}`;
    
    if (seatLayout[category].unavailableSeats.includes(seatId)) {
      return; // Seat is unavailable
    }
    
    onSeatSelect(fullSeatId, categories.find(c => c.id === category).price);
  };

  // Check if a seat is selected
  const isSeatSelected = (category, seatId) => {
    return selectedSeats.some(seat => seat === `${category}:${seatId}`);
  };

  // Get seat status class
  const getSeatStatusClass = (category, seatId) => {
    if (seatLayout[category].unavailableSeats.includes(seatId)) {
      return 'bg-gray-300 text-gray-400 cursor-not-allowed'; // Sold
    }
    
    if (isSeatSelected(category, seatId)) {
      return 'bg-green-500 text-white border-green-600'; // Selected
    }
    
    return 'bg-white border-green-500 text-gray-700 hover:bg-green-50'; // Available
  };

  // Render each category section
  const renderCategorySection = (category) => {
    const { id, name, price } = category;
    const { rows, visibleColumns } = seatLayout[id];

    return (
      <div key={id} className="mb-12">
        <h3 className="text-gray-600 font-medium mb-4 text-right">{name} ₹{price}</h3>
        
        <div className="flex flex-col items-center space-y-2">
          {rows.map(row => (
            <div key={`${id}-${row}`} className="flex items-center">
              <div className="w-8 text-center font-medium text-gray-500">{row}</div>
              
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: seatLayout[id].seatsPerRow }, (_, index) => {
                  const seatNumber = index + 1;
                  const seatId = `${row}${seatNumber}`;
                  
                  // Only render seats that are in the visibleColumns
                  if (!visibleColumns[row].includes(seatNumber)) {
                    return <div key={`${id}-${seatId}-spacer`} className="w-6"></div>;
                  }
                  
                  return (
                    <button
                      key={`${id}-${seatId}`}
                      onClick={() => handleSeatClick(id, seatId)}
                      onMouseEnter={() => setHoveredSeat(`${id}-${seatId}`)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={seatLayout[id].unavailableSeats.includes(seatId)}
                      className={`w-6 h-6 flex items-center justify-center text-xs border rounded-sm 
                        ${getSeatStatusClass(id, seatId)}
                        ${hoveredSeat === `${id}-${seatId}` ? 'ring-1 ring-green-500' : ''}
                      `}
                      aria-label={`${name} seat ${seatId}`}
                      title={`${name} - Row ${row}, Seat ${seatNumber} - ₹${price}`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
              
              <div className="w-8 text-center font-medium text-gray-500">{row}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const [category] = seatId.split(':');
      const price = categories.find(c => c.id === category)?.price || 0;
      return total + price;
    }, 0);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Screen */}
      <div className="w-3/4 h-8 bg-gray-300 rounded-lg flex items-center justify-center mb-12 text-sm text-gray-600 relative">
        <div className="absolute -bottom-6 text-xs text-gray-500">SCREEN</div>
        <div className="w-full h-1 bg-gray-400 absolute bottom-0"></div>
      </div>
      
      {/* Seating Layout */}
      <div className="w-full max-w-3xl">
        {categories.map(renderCategorySection)}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="flex items-center">
          <div className="w-4 h-4 border border-green-500 bg-white mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 mr-2"></div>
          <span className="text-sm">Sold</span>
        </div>
      </div>
      
      {/* Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-8 w-full max-w-3xl bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Selected Seats:</span> 
              <span className="ml-2">{selectedSeats.map(seat => seat.split(':')[1]).join(', ')}</span>
            </div>
            <div className="font-semibold text-lg">
              Total: ₹{calculateTotal()}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors">
              Pay ₹{calculateTotal()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookMyShowSeatSelection;