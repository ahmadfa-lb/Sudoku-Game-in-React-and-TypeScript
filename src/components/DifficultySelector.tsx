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
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectedLabel = items.find(item => item.value === selectedValue)?.label || '🤔⁉️';

  return (
    <div>
      <button onClick={toggleDropdown} className='dropdownButtonStyle'>
        {selectedLabel}
      </button>
      
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
