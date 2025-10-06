import React from 'react';

function TicketQuantity({ quantity, onChange, maxAvailable }) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxAvailable) {
      onChange(quantity + 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxAvailable) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= 1}
        className="w-10 h-10 rounded-l-md border flex items-center justify-center bg-muted hover:bg-accent transition-colors disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min="1"
        max={maxAvailable}
        className="w-12 h-10 border-t border-b text-center [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= maxAvailable}
        className="w-10 h-10 rounded-r-md border flex items-center justify-center bg-muted hover:bg-accent transition-colors disabled:opacity-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <span className="ml-2 text-sm text-muted-foreground">
        {maxAvailable} available
      </span>
    </div>
  );
}

export default TicketQuantity;