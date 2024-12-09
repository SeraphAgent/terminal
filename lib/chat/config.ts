export const VIRTUALS_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_VIRTUALS_API_KEY || '',
  ACCESS_TOKEN: process.env.NEXT_PUBLIC_VIRTUALS_ACCESS_TOKEN || '',
  BASE_URL: 'https://api.virtuals.io',
  CONVERSATION_URL: 'https://f1abfdrunner.tmole.virtuals.io/prompts',
  VIRTUAL_UID: '12398' // Seraph's ID
} as const;