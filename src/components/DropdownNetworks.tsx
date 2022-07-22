import React from "react";
import {
  Box,
  Select,
  FormControl,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { NetworkInfo } from "../models";

interface DropdownProps {
  networkURLs: NetworkInfo[];
  network: string;
  setNetwork: React.Dispatch<React.SetStateAction<string>>;
}

export const DropdownNetworks = ({
  networkURLs,
  network,
  setNetwork,
}: DropdownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    setNetwork(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select value={network} onChange={handleChange}>
          {networkURLs.map((network) => {
            return (
              <MenuItem
                value={network.url}
                key={Math.floor(Math.random() * 1000000)}
              >
                {network.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
