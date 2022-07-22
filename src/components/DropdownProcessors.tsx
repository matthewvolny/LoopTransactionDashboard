import React from "react";
import {
  Box,
  Select,
  FormControl,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface DropdownProps {
  processors: string[];
  processor: string;
  setProcessor: React.Dispatch<React.SetStateAction<string>>;
}

export const DropdownProcessors = ({
  processors,
  processor,
  setProcessor,
}: DropdownProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    setProcessor(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          sx={{ letterSpacing: "0.04rem" }}
          value={processor}
          onChange={handleChange}
        >
          {processors.map((processor) => {
            return (
              <MenuItem
                sx={{ letterSpacing: "0.04rem" }}
                key={processor}
                value={processor}
              >
                {processor}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
