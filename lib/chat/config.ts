export const VIRTUALS_CONFIG = {
  API_KEY: process.env.VIRTUALS_API_KEY || '',
  BASE_URL: 'https://api.virtuals.io',
  CONVERSATION_URL: 'https://H7Uap4runner.tmole.virtuals.io/prompts',
  VIRTUAL_UID: '12398' // Seraph's ID
} as const;