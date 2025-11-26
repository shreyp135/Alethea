"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function TextAreaInput({ value = "", onChange }: Props) {
  const [internal, setInternal] = useState(value);

  // keep internal in sync when parent changes value
  React.useEffect(() => {
    setInternal(value);
  }, [value]);

  return (
      <div className="space-y-6">
        {/* Default TextArea */}
        <div>
          <Label className="text-md "> </Label>
          <TextArea
            value={internal}
            onChange={(v) => {
              setInternal(v);
              if (onChange) onChange(v);
            }}
            rows={13}
          />
        </div>

      </div>
  );
}
