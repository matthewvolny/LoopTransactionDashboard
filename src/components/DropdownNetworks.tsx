import { NetworkStatus } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { NetworkInfo } from "../models";

interface DropdownProps {
  networkURLs: NetworkInfo[];
  setNetwork: React.Dispatch<React.SetStateAction<string>>;
}

export const DropdownNetworks = ({
  networkURLs,
  setNetwork,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    "https://api.thegraph.com/subgraphs/name/loopcrypto/loop-polygon"
  );

  const handleChange = (e: string) => {
    setSelectedOption(e);
  };

  useEffect(() => {
    setNetwork(selectedOption);
  }, [selectedOption]);

  return (
    <div>
      <select
        onChange={(e) => handleChange(e.target.value)}
        value={selectedOption}
      >
        {networkURLs.map((network) => {
          return (
            <option
              value={network.url}
              key={Math.floor(Math.random() * 1000000)}
            >
              {network.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};
