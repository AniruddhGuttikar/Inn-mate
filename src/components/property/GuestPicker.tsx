import React, { useState } from 'react';
import { Button } from '../ui/button'; // Assuming Shadcn Button is used

interface GuestPickerProps {
  onChange?: (adults: number, children: number) => void;
  max: number | null; // Accept max as a prop
}

const GuestPicker: React.FC<GuestPickerProps> = ({ onChange, max }) => {
  const [adults, setAdults] = useState(1); // Default value for adults
  const [children, setChildren] = useState(0); // Default value for children
  console.log("Adults+chilid",adults + children,max)
  const totalGuests = adults + children; // Total number of guests

  const incrementAdults = () => {
    if (max !== null && totalGuests < max) {
      setAdults((prev) => prev + 1);
      onChange?.(adults + 1, children); // Trigger the onChange handler if provided
    }
  };

  const decrementAdults = () => {
    setAdults((prev) => Math.max(prev - 1, 1)); // Prevent going below 1
    onChange?.(adults - 1, children);
  };

  const incrementChildren = () => {
    if (max !== null && totalGuests < max) {
      setChildren((prev) => prev + 1);
      onChange?.(adults, children + 1);
    }
  };

  const decrementChildren = () => {
    setChildren((prev) => Math.max(prev - 1, 0)); // Prevent going below 0
    onChange?.(adults, children - 1);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center">
        <span>Adults</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={decrementAdults}>-</Button>
          <span>{adults}</span>
          <Button variant="outline" onClick={incrementAdults}>+</Button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span>Children</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={decrementChildren}>-</Button>
          <span>{children}</span>
          <Button variant="outline" onClick={incrementChildren}>+</Button>
        </div>
      </div>

      {max !== null && totalGuests >= max && (
        <p className="text-red-500 text-sm mt-2">Max guests limit reached.</p>
      )}
    </div>
  );
};

export default GuestPicker;
