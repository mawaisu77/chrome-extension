import type { MappingConfig } from "./schema";

export const defaultMapping: MappingConfig = {
  version: "1.0.0",
  fieldMappings: [
    {
      sourceField: "firstName",
      targetSelectors: ["#firstName", "input[name='firstName']"],
      required: true,
      type: "text",
      transform: "trim"
    },
    {
      sourceField: "lastName",
      targetSelectors: ["#lastName", "input[name='lastName']"],
      required: true,
      type: "text",
      transform: "trim"
    },
    {
      sourceField: "dateOfBirth",
      targetSelectors: ["#dob", "input[name='dob']"],
      required: false,
      type: "text",
      transform: "none"
    }
  ]
};
