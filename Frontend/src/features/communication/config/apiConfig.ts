// API configuration
export const API_CONFIG = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || "",
  GROQ_API_URL: "https://api.groq.com/v1/chat/completions",
  MODEL: ""
} as const;