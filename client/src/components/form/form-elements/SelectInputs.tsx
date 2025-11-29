"use client";
import React, { useState } from "react";
import Label from "../Label";
import Select from "../Select";
import { ChevronDownIcon } from "@/icons";

type Option = { value: string; label: string };

type Props = {
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function SelectInputs({
  options = [],
  value = "",
  onChange,
  placeholder = "Select Option",
}: Props) {
  const handleSelectChange = (v: string) => {
    if (onChange) onChange(v);
  };

  return (
      <div className="space-y-6">
        <div>
          {/* <Label>Select Input</Label> */}
         <div className="relative">
           <Select
            options={options}
            placeholder={placeholder}
            onChange={handleSelectChange}
            value={value}
            className="dark:bg-dark-900"
          />
          <span className="absolute  -translate-y-1/2 pointer-events-none right-3 top-1/2 ">
              <ChevronDownIcon/>
            </span>
         </div>
        </div>
      </div>
  );
}
