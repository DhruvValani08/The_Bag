import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './FloatingAddButton.css';

export const FloatingAddButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/add');
  };

  return (
    <button className="floating-add-button" onClick={handleClick} aria-label="Add item">
      <Plus size={24} />
      <span className="fab-label">Add item</span>
    </button>
  );
};
