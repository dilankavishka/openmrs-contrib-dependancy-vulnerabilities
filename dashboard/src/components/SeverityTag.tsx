import React from "react";
import { Tag } from "@carbon/react";
import type { SeverityLevel } from "../types";

interface SeverityTagProps {
  severity: SeverityLevel;
}

export const SeverityTag: React.FC<SeverityTagProps> = ({ severity }) => {
  let carbonType:
    | "red"
    | "magenta"
    | "purple"
    | "cyan"
    | "teal"
    | "gray"
    | "cool-gray" = "cool-gray";
  switch (severity) {
    case "Critical":
      carbonType = "red";
      break;
    case "High":
      carbonType = "magenta";
      break;
    case "Medium":
      carbonType = "purple";
      break;
    case "Low":
      carbonType = "teal";
      break;
    default:
      carbonType = "cool-gray";
  }
  return (
    <Tag type={carbonType} size="sm" title={severity}>
      {severity}
    </Tag>
  );
};

export default SeverityTag;
