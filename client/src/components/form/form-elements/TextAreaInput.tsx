"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import TextArea from "../input/TextArea";
import Label from "../Label";

export default function TextAreaInput() {
  const [message, setMessage] = useState("");
  return (
      <div className="space-y-6">
        {/* Default TextArea */}
        <div>
          <Label className="text-md "> </Label>
          <TextArea
            value={message}
            onChange={(value) => setMessage(value)}
            rows={13}
          />
        </div>

      </div>
  );
}
