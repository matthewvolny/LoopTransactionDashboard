import React, { useEffect, useState } from "react";

interface DropdownProps {
  processors: string[];
  setProcessor: React.Dispatch<React.SetStateAction<string>>;
}

export const DropdownProcessors = ({
  processors,
  setProcessor,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e"
  );

  const handleChange = (e: string) => {
    setSelectedOption(e);
  };

  useEffect(() => {
    setProcessor(selectedOption);
  }, [selectedOption]);

  return (
    <div>
      <select
        onChange={(e) => handleChange(e.target.value)}
        value={selectedOption}
      >
        {processors.map((processor) => {
          return (
            <option key={Math.floor(Math.random() * 1000000)}>
              {processor}
            </option>
          );
        })}
      </select>
    </div>
  );
};
