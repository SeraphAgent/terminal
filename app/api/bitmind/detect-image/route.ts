export interface DetectImageResponse {
  isAI: boolean
  predictions: number[]
  confidence: number
  similarity: number
  fqdn: string
}

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return Response.json(
        { error: 'Base64 encoded image is required' },
        { status: 400 }
      )
    }

    const detectImageRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BITMIND_API_KEY}`,
      },
      body: JSON.stringify({
        image: image,
      }),
    }

    const detectImageResponse = await fetch(
      'https://subnet-api.bitmindlabs.ai/detect-image',
      detectImageRequestOptions
    )

    if (!detectImageResponse.ok) {
      const errorText = await detectImageResponse.text()
      console.error('Detect Image API Error:', {
        status: detectImageResponse.status,
        statusText: detectImageResponse.statusText,
        body: errorText,
      })
      return Response.json(
        { error: `Failed to detect image: ${detectImageResponse.statusText}` },
        { status: detectImageResponse.status }
      )
    }

    const data: DetectImageResponse = await detectImageResponse.json()
    return Response.json(data)
  } catch (error) {
    console.error('Detect Image route error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
