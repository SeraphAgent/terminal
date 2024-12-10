export const VIRTUALS_CONFIG = {
  API_KEY: process.env.VIRTUALS_API_KEY || "",
  BASE_URL: process.env.VIRTUALS_BASE_URL || "",
  CONVERSATION_URL: process.env.VIRTUALS_CONVERSATION_URL || "",
  VIRTUAL_UID: process.env.VIRTUALS_VIRTUAL_UID || "",
} as const;
