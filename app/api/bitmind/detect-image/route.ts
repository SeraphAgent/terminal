export interface DetectImageResponse {
  isAI: boolean
  predictions: number[]
  confidence: number
  similarity: number
  fqdn: string
}

import { VIRTUALS_CONFIG } from '@/lib/chat/config'
import { AccessTokenResponse, ConversationResponse } from '@/lib/chat/types'

export async function POST(request: Request) {
  try {
    const { image, userAddress } = await request.json()

    if (!image || !userAddress) {
      return Response.json(
        { error: 'Image and user address are required' },
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

    const detectionResults: DetectImageResponse =
      await detectImageResponse.json()

    const additionalContext = `
      Image Detection Task:
      - This analysis request was processed by BitTensor Subnet 34 (BitMind) to determine if the image is AI-generated.
    
      Detection Results:
      - AI Generated: ${detectionResults.isAI ? 'Yes' : 'No'}
        (Indicates whether the image is classified as AI-generated.)
      - Confidence Level: ${(detectionResults.confidence * 100).toFixed(2)}%
        (Represents the likelihood of AI generation as a percentage.)
      - Predictions (Top 3 in %): ${detectionResults.predictions
        .slice(0, 3)
        .map((p) => `${(p * 100).toFixed(2)}%`)
        .join(', ')}
        (Probability scores from miners indicating the likelihood of AI generation.)
      - Processed By Node (FQDN): ${detectionResults.fqdn}
        (The validator node used to request image analysis from miners.)
    
      Response Expectations:
      - Provide a clear, professional summary of whether the image is AI-generated.
      - Reference the confidence level and predictions in your explanation.
      - Include the processing node (FQDN) for transparency.
      - Do not use self-referential phrases (e.g., "I believe" or "I'll continue").
      - Maintain a strictly neutral, factual tone.
    `.trim()

    const tokenRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': VIRTUALS_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        data: {
          userUid: userAddress,
          virtualUid: VIRTUALS_CONFIG.VIRTUAL_UID,
        },
      }),
    }

    const tokenResponse = await fetch(
      `${VIRTUALS_CONFIG.BASE_URL}/api/accesses/tokens`,
      tokenRequestOptions
    )

    if (!tokenResponse.ok) {
      console.error('Token Error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
      })
      return Response.json(
        { error: 'Failed to get access token' },
        { status: tokenResponse.status }
      )
    }

    const tokenData: AccessTokenResponse = await tokenResponse.json()
    const accessToken = tokenData.data.accessToken

    const message = `
    Analyze the image detection results and provide a factual explanation based on the following context:
    - AI Generated: ${detectionResults.isAI ? 'Yes' : 'No'}
    - Confidence Level: ${(detectionResults.confidence * 100).toFixed(2)}%
    - Predictions (Top 3 in %): ${detectionResults.predictions
      .slice(0, 3)
      .map((p) => `${(p * 100).toFixed(2)}%`)
      .join(', ')}
    - Processed By Node (FQDN): ${detectionResults.fqdn}
  
    Your response should:
    - Summarize whether the image is AI-generated.
    - Clearly explain the decision based on the confidence level and predictions.
    - Include the processing node (FQDN) as part of the explanation.
    - Avoid any self-referential or conversational language.
  `.trim()

    const messageRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        data: {
          useCaseId: 'roleplay',
          text: message,
          opponent: userAddress,
          additionalContext,
        },
      }),
    }

    const messageResponse = await fetch(
      VIRTUALS_CONFIG.CONVERSATION_URL,
      messageRequestOptions
    )

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text()
      console.error('Virtuals API Error:', {
        status: messageResponse.status,
        statusText: messageResponse.statusText,
        body: errorText,
      })
      return Response.json(
        { error: `Failed to send message: ${messageResponse.statusText}` },
        { status: messageResponse.status }
      )
    }

    const data: ConversationResponse = await messageResponse.json()
    return Response.json(data)
  } catch (error) {
    console.error('Error in processing detect image response:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
