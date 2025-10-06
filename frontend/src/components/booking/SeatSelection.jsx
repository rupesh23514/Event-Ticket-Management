import React from 'react';

function SeatSelection({ venue, seatingPlan, selectedSeats, onSeatSelect, maxSelectable }) {
  // Mock seating plan - in a real app, this would come from the API
  const mockSeatingPlan = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 12,
    unavailableSeats: ['A3', 'A4', 'B7', 'B8', 'C5', 'D2', 'D3', 'E8', 'E9', 'F11', 'G6', 'H10']
  };

  // Use provided seating plan or fall back to mock data
  const plan = seatingPlan && Object.keys(seatingPlan).length > 0 ? seatingPlan : mockSeatingPlan;
  
  const handleSeatClick = (seat) => {
    // Don't allow selecting unavailable seats
    if (plan.unavailableSeats.includes(seat)) return;
    
    // If already selected, remove it
    if (selectedSeats.includes(seat)) {
      onSeatSelect(seat);
      return;
    }
    
    // Don't allow selecting more than maxSelectable
    if (selectedSeats.length >= maxSelectable && !selectedSeats.includes(seat)) {
      return;
    }
    
    onSeatSelect(seat);
  };

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat)) return 'selected';
    if (plan.unavailableSeats.includes(seat)) return 'unavailable';
    return 'available';
  };

  return (
    <div className="flex flex-col items-center">
      {/* Stage */}
      <div className="w-3/4 h-10 bg-muted rounded-t-3xl flex items-center justify-center mb-8 text-sm text-muted-foreground">
        STAGE
      </div>
      
      {/* Seating Grid */}
      <div className="grid gap-y-2 mb-6">
        {plan.rows.map((row) => (
          <div key={row} className="flex items-center">
            <div className="w-6 text-center font-medium mr-2">{row}</div>
            <div className="flex gap-1 justify-center flex-wrap">
              {Array.from({ length: plan.seatsPerRow }, (_, i) => {
                const seatNum = i + 1;
                const seat = `${row}${seatNum}`;
                const status = getSeatStatus(seat);
                
                return (
                  <button
                    key={seat}
                    onClick={() => handleSeatClick(seat)}
                    disabled={status === 'unavailable'}
                    className={`w-7 h-7 rounded-t-sm flex items-center justify-center text-xs ${
                      status === 'selected'
                        ? 'bg-primary text-primary-foreground'
                        : status === 'unavailable'
                        ? 'bg-muted-foreground cursor-not-allowed'
                        : 'bg-accent hover:bg-accent/80 cursor-pointer'
                    }`}
                    aria-label={`Seat ${seat}`}
                    title={`Seat ${seat}`}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            <div className="w-6 text-center font-medium ml-2">{row}</div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs mt-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-accent rounded-sm mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary rounded-sm mr-1"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-muted-foreground rounded-sm mr-1"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;