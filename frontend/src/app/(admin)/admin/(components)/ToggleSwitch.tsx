// src/app/admin/(panel)/(components)/ToggleSwitch.tsx
"use client";
import { useState } from 'react';

// 1. Define the component's props, including the new 'onChange' function
interface ToggleSwitchProps {
    initialValue: boolean;
    onChange: (newStatus: boolean) => void;
}

const ToggleSwitch = ({ initialValue, onChange }: ToggleSwitchProps) => {
  const [isOn, setIsOn] = useState(initialValue);

  const handleToggle = () => {
      // 2. Calculate the new state
      const newState = !isOn;
      
      // 3. Update the component's internal visual state
      setIsOn(newState);
      
      // 4. Call the parent's function with the new state
      onChange(newState);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span className="sr-only">Toggle feature</span>
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;