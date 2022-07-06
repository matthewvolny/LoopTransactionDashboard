import React, { useState } from "react";

const processors: string[] = [
  "0xcbda2f4d091331c5ca4c91ebbf5bd51162edd73e",
  "0x0000000000000000000000000000000000000000",
];

interface DropdownProps {
  setProcessor: React.Dispatch<React.SetStateAction<string>>;
}

export const Dropdown = ({ setProcessor }: DropdownProps) => {
  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);

  return (
    <div className="dropdown-container" style={{ color: "blue" }}>
      {dropdownVisibility ? (
        <div>hi</div>
      ) : (
        processors.map((processor) => {
          return <div onClick={() => setProcessor(processor)}>{processor}</div>;
        })
      )}
    </div>
  );
};

// : {
//         processors.map((processor)=>{
//             return <div>{processor}</div>
//         })
//     }
