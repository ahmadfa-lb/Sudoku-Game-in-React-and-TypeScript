import React, { useState } from 'react';
import '../index.css'

interface DifficultyItem {
  label: string;
  value: string;
}

interface DifficultySelectorProps {
  items: DifficultyItem[];
  onSelect: (value: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ items, onSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false); // Close the dropdown when an option is selected
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Find the label of the selected option for display
  const selectedLabel = items.find(item => item.value === selectedValue)?.label || '🤔⁉️';

  return (
    <div>
      {/* Main button to toggle dropdown */}
      <button onClick={toggleDropdown} className='dropdownButtonStyle'>
        {selectedLabel}
      </button>
      
      {/* Render options as a list of buttons, shown only when the dropdown is open */}
      {isOpen && (
        <div className='dropdownMenuStyle'>
          {items.map(item => (
            <button
              key={item.value}
              onClick={() => handleSelect(item.value)}
              className={`optionButtonStyle ${item.value === selectedValue ? 'selected' : ''}`
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DifficultySelector;
