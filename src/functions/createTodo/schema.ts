export default {
  type: "object",
  properties: {
    title: { type: "string" },
    deadline: { type: "string" },
  },
  required: ["title", "deadline"],
} as const;
