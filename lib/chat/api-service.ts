import { APIError } from './types'

export class APIService {
  static async sendMessage(
    userAddress: string | undefined,
    message: string
  ): Promise<string> {
    if (!userAddress) {
      throw new APIError('User address is required')
    }

    try {
      const response = await fetch('/api/virtuals/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          message,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        throw new APIError(`Failed to send message: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.response) {
        return data.response
      } else if (data.text) {
        return data.text
      } else {
        throw new APIError('Invalid response format from API')
      }
    } catch (error) {
      console.error('Message error:', error)
      throw error
    }
  }

  static async detectImage(image: string): Promise<{
    isAI: boolean
    confidence: number
    similarity: number
    fqdn: string
    predictions: number[]
  }> {
    if (!image) {
      throw new APIError('Base64 encoded image is required')
    }

    try {
      const response = await fetch('/api/bitmind/detect-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Detect Image API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        throw new APIError(`Failed to detect image: ${response.statusText}`)
      }

      const data = await response.json()

      console.log(data)
      return {
        isAI: data.isAI,
        confidence: data.confidence,
        similarity: data.similarity,
        fqdn: data.fqdn,
        predictions: data.predictions,
      }
    } catch (error) {
      console.error('Detect Image error:', error)
      throw error
    }
  }
}
