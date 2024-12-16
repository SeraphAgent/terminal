import { AccessTokenResponse } from './types'

export class VirtualsAPI {
  private static accessToken: string | null = null
  private static tokenExpiryTime: number | null = null

  static async getAccessToken(userAddress: string): Promise<string> {
    if (!userAddress) {
      throw new Error('User address is required for authentication')
    }

    // Check if token exists and is not expired (giving 1 minute buffer)
    const now = Date.now()
    if (
      this.accessToken &&
      this.tokenExpiryTime &&
      now < this.tokenExpiryTime - 60000
    ) {
      return this.accessToken
    }

    try {
      const response = await fetch('/api/virtuals/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userAddress
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`)
      }

      const data: AccessTokenResponse = await response.json()
      this.accessToken = data.data.accessToken
      this.tokenExpiryTime = now + 30 * 60 * 1000
      return this.accessToken
    } catch (error) {
      console.error('Error getting access token:', error)
      throw error
    }
  }

  static async sendMessage(
    userAddress: string | undefined,
    message: string
  ): Promise<string> {
    try {
      if (!userAddress) {
        throw new Error('User address is required')
      }

      const response = await fetch('/api/virtuals/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userAddress,
          message
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}
