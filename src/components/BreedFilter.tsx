import React from "react";

interface BreedFilterProps {
  breeds: string[];
  selectedBreed: string;
  onSelectBreed: (breed: string) => void;
}

const BreedFilter: React.FC<BreedFilterProps> = ({ breeds, selectedBreed, onSelectBreed }) => {
  return (
    <select
      value={selectedBreed}
      onChange={(e) => onSelectBreed(e.target.value)}
      className="border p-2 rounded-lg"
    >
      <option value="">Select Breed</option>
      {breeds.map((breed) => (
        <option key={breed} value={breed}>{breed}</option>
      ))}
    </select>
  );
};

export default BreedFilter;