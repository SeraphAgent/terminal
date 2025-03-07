'use client'

import { convertImageFileToBase64 } from '@/lib/utils'
import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { APIService } from '../api-service'
import { ChatMessage, ChatState } from '../types'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    type: 'output',
    content: 'Initializing Seraph Neural Interface...',
    timestamp: Date.now()
  },
  {
    type: 'output',
    content: 'Connected to Virtuals Protocol.',
    timestamp: Date.now() + 1
  },
  {
    type: 'output',
    content: 'Ready for interaction. Type a message to begin.',
    timestamp: Date.now() + 2
  },
  {
    type: 'output',
    content: 'Upload an image to analyze it.',
    timestamp: Date.now() + 3
  }
]

const isBittensorQuery = (message: string): boolean => {
  const bittensorKeywords = [
    'subnet', 'subnets', 'netuid', 'tao', 'bittensor', 'btcli',
    'price', 'emission', 'stake', 'registration', 'validator',
    'hyperparameters', 'burn cost', 'burn-cost',
    'show subnet', 'list subnet', 'subnet info', 'subnet list',
    'subnet price', 'subnet emission', 'subnet stake', 'subnet registration',
    'subnet validator', 'subnet hyperparameters',
    'research', 'due diligence', 'dd', 'tell me about'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check if the message contains Bittensor-related keywords
  return bittensorKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Function to determine the appropriate btcli command based on the user query
export const getBittensorCommand = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Check if the user is asking for comprehensive information about a subnet
  const subnetResearchMatch = lowerQuery.match(/(?:research|tell me about|due diligence|dd|more about|info on|information about|details on|details about)\s+(?:subnet|network)\s+(\d+)/i);
  
  if (subnetResearchMatch) {
    const netuid = subnetResearchMatch[1];
    // For comprehensive research, return a special command that our API will recognize
    return `btcli subnet research --netuid ${netuid}`;
  }
    
  // Map common query patterns to btcli commands
  if (lowerQuery.includes('list') && lowerQuery.includes('subnet')) {
    return 'btcli subnet list';
  }
  
  if (lowerQuery.includes('price') && lowerQuery.includes('subnet')) {
    // Extract netuid if specified
    const netuidMatch = lowerQuery.match(/subnet\s+(\d+)|netuid\s+(\d+)/);
    const netuid = netuidMatch ? (netuidMatch[1] || netuidMatch[2]) : null;
    
    return netuid 
      ? `btcli subnet price --netuid ${netuid}`
      : 'btcli subnet price --all';
  }
  
  if ((lowerQuery.includes('show') || lowerQuery.includes('info')) && lowerQuery.includes('subnet')) {
    const netuidMatch = lowerQuery.match(/subnet\s+(\d+)|netuid\s+(\d+)/);
    const netuid = netuidMatch ? (netuidMatch[1] || netuidMatch[2]) : '1'; // Default to netuid 1
    
    return `btcli subnet show --netuid ${netuid}`;
  }
  
  if (lowerQuery.includes('hyperparameters')) {
    const netuidMatch = lowerQuery.match(/subnet\s+(\d+)|netuid\s+(\d+)/);
    const netuid = netuidMatch ? (netuidMatch[1] || netuidMatch[2]) : '1'; // Default to netuid 1
    
    return `btcli subnet hyperparameters --netuid ${netuid}`;
  }
    
  if (lowerQuery.includes('burn') && (lowerQuery.includes('cost') || lowerQuery.includes('fee'))) {
    return 'btcli subnet burn-cost';
  }
  
  if (lowerQuery.includes('emission')) {
    return 'btcli subnet list'; // Emissions are shown in the subnet list
  }
  
  if (lowerQuery.includes('registration') || 
      (lowerQuery.includes('register') && lowerQuery.includes('cost'))) {
    return 'btcli subnet burn-cost';
  }
  
  if (lowerQuery.includes('validator') && lowerQuery.includes('list')) {
    const netuidMatch = lowerQuery.match(/subnet\s+(\d+)|netuid\s+(\d+)/);
    const netuid = netuidMatch ? (netuidMatch[1] || netuidMatch[2]) : '1'; // Default to netuid 1
    
    return `btcli subnet show --netuid ${netuid}`;
  }
  
  // Default to subnet list if no specific command is matched
  return 'btcli subnet list';
};

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: INITIAL_MESSAGES,
    isLoading: false,
    error: null
  })

  const { address } = useAccount()

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: 'input',
            content: message,
            timestamp: Date.now()
          }
        ],
        isLoading: true,
        error: null
      }))

      try {
        if (isBittensorQuery(message)) {
          console.log(`[BTCLI] Detected Bittensor query: "${message}"`);
          // Get the appropriate btcli command
          const btcliCommand = getBittensorCommand(message)
        
          console.log(`[BTCLI] Mapped to command: "${btcliCommand}"`);
        
          console.log(`[BTCLI] Sending request to /api/btcli endpoint`);
          const response = await fetch('/api/btcli', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command: btcliCommand })
          })
          console.log(`[BTCLI] Received response with status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`[BTCLI] API error (${response.status}): ${errorText}`);
            throw new Error(`Failed to execute btcli command: ${response.statusText}`)
          }
          
          const data = await response.json()
          console.log(`[BTCLI] Command executed successfully, output length: ${data.result?.length || 0} chars, command type: ${data.commandType}`);
        
          // Send the btcli output to the agent for processing with specific instructions
          console.log(`[BTCLI] Sending command output to agent for processing`);
          
          // Create specific instructions based on command type
          let agentInstructions = '';
          
          if (data.commandType === 'subnet_research') {
            agentInstructions = `Please provide a comprehensive investment analysis of this subnet based on all the data provided. Format your response as a clear due diligence report with these sections:
          
          SUBNET OVERVIEW:
          A summary of what this subnet does, its purpose in the Bittensor ecosystem, and its current status.
          
          KEY METRICS:
          - Rate: The exchange ratio between TAO (Bittensor's native token) and this subnet's Alpha token.
          - Emission: Current new TAO tokens being distributed to the subnet.
          - TAO Pool: Total TAO tokens allocated to this subnet for incentives and operations.
          - Alpha Pool: The subnet's own token supply used for staking and rewards within this specific subnet.
          - Tempo: The subnet's block production rate, indicating activity level.
          - Registration cost: Cost in TAO to join as a validator/miner.
          
          NETWORK STRUCTURE:
          Analysis of the subnet's validator distribution, decentralization level, and key participants.
          
          GOVERNANCE & PARAMETERS:
          Explanation of the key hyperparameters and what they mean for the subnet's operation and governance.
          
          MARKET POSITION:
          How this subnet compares to other subnets in the Bittensor ecosystem based on the subnet list data.
          
          INVESTMENT CONSIDERATIONS:
          A balanced analysis of investment potential, including both opportunities and risks.`;
          } else if (data.commandType === 'subnet_show') {
            agentInstructions = `Please provide a clear, investor-friendly explanation of this subnet information. Format your response for maximum readability:
          
          1. Use a clear title: "Subnet X: [name] - Investment Analysis"
          2. Use proper headings with a blank line before and after each heading
          3. DO NOT use asterisks or markdown formatting in your response
          4. Use plenty of line breaks between sections
          5. Use simple bullet points (just a dash followed by a space) for lists
          
          Include these sections:
          
          OVERVIEW:
          A brief introduction to what this subnet does and its purpose in the Bittensor ecosystem.
          
          KEY METRICS:
          - Rate: The exchange ratio between TAO (Bittensor's native token) and this subnet's Alpha token.
          - Emission: Current new TAO tokens being distributed to the subnet.
          - TAO Pool: Total TAO tokens allocated to this subnet for incentives and operations.
          - Alpha Pool: The subnet's own token supply used for staking and rewards within this specific subnet.
          - Tempo: The subnet's block production rate, indicating activity level.
          - Registration cost: Cost in TAO to join as a validator/miner.
          
          INVESTMENT CONSIDERATIONS:
          What these metrics mean for potential investors. Include both opportunities and risks.
          
          CONTEXT:
          Explain that TAO is Bittensor's main network token, while each subnet has its own Alpha token. TAO holders can swap for Alpha to stake in specific subnets and earn rewards.`;
          } else if (data.commandType === 'subnet_list') {
            agentInstructions = `Please analyze this list of subnets in a way that's accessible to retail investors. Format your response with clear headings, plenty of line breaks, and NO markdown formatting or asterisks. Highlight the top 3-5 subnets by key metrics, explain what each important column means in simple terms, and provide a brief overview of which subnets might be worth investigating further and why.`;
          } else if (data.commandType === 'burn_cost') {
            agentInstructions = `Please explain what the registration/burn cost means in simple terms that a retail investor would understand. Format your response with clear headings, plenty of line breaks, and NO markdown formatting or asterisks. Focus on how this affects the investment case, barriers to entry, and network security.`;
          } else if (data.commandType === 'hyperparameters') {
            agentInstructions = `Please explain these key hyperparameters in investor-friendly language. Format your response with clear headings, plenty of line breaks, and NO markdown formatting or asterisks. Focus on how each parameter affects the subnet's operation, governance, and potential investment value.`;
          } else {
            agentInstructions = `Please analyze this btcli command output in a way that's accessible to retail investors doing due diligence on Bittensor subnets. Format your response with clear headings, plenty of line breaks, and NO markdown formatting or asterisks. Focus on explaining what the data means for the investment case.`;
          }
          
          console.log(`[BTCLI] Prepared agent instructions (length: ${agentInstructions.length})`);

          const agentPrompt = `${agentInstructions}
          
          Command: ${data.originalCommand}
          
          Output:
          ${data.result}
          
          Your response should be concise, informative and investor-friendly. Use clear headings with proper spacing between paragraphs for readability. Use simple bullet points (just a dash followed by a space) for lists. Avoid technical jargon where possible, and when you must use technical terms, briefly explain them.
          
          Remember to explain that TAO is Bittensor's native currency that powers all subnets, while each subnet has its own Alpha token that TAO holders can stake in to earn rewards.
          
          Focus on what this information means for someone considering investing in or participating in this subnet. Highlight both potential opportunities and risks where relevant.
          
          IMPORTANT: DO NOT use markdown formatting or asterisks in your response. Use plain text with plenty of line breaks for readability.`;

          console.log(`[BTCLI] Full agent prompt prepared (length: ${agentPrompt.length})`);

          try {
            console.log(`[BTCLI] Sending request to agent API`);
      
            // Break the agent prompt into smaller chunks if it's too large
            const MAX_PROMPT_SIZE = 15000; // Adjust based on your API limits
            let agentPrompt = `${agentInstructions}\n\nCommand: ${data.originalCommand}\n\n`;
            
            // Calculate how much space we have left for the output
            const headerLength = agentPrompt.length;
            const footerLength = `\n\nYour response should be concise, informative and investor-friendly. Use clear headings with proper spacing between paragraphs for readability. Use simple bullet points (just a dash followed by a space) for lists. Avoid technical jargon where possible, and when you must use technical terms, briefly explain them.\n\nRemember to explain that TAO is Bittensor's native currency that powers all subnets, while each subnet has its own Alpha token that TAO holders can stake in to earn rewards.\n\nFocus on what this information means for someone considering investing in or participating in this subnet. Highlight both potential opportunities and risks where relevant.\n\nIMPORTANT: DO NOT use markdown formatting or asterisks in your response. Use plain text with plenty of line breaks for readability.`.length;
            
            const maxOutputLength = MAX_PROMPT_SIZE - headerLength - footerLength;
            
            // Truncate the output if necessary
            let truncatedOutput = data.result;
            if (data.result.length > maxOutputLength) {
              console.log(`[BTCLI] Output too large (${data.result.length} chars), truncating to ${maxOutputLength} chars`);
              truncatedOutput = data.result.substring(0, maxOutputLength) + "\n\n[Note: Output was truncated due to size limitations]";
            }
            
            // Complete the prompt
            agentPrompt += `Output:\n${truncatedOutput}\n\nYour response should be concise, informative and investor-friendly. Use clear headings with proper spacing between paragraphs for readability. Use simple bullet points (just a dash followed by a space) for lists. Avoid technical jargon where possible, and when you must use technical terms, briefly explain them.\n\nRemember to explain that TAO is Bittensor's native currency that powers all subnets, while each subnet has its own Alpha token that TAO holders can stake in to earn rewards.\n\nFocus on what this information means for someone considering investing in or participating in this subnet. Highlight both potential opportunities and risks where relevant.\n\nIMPORTANT: DO NOT use markdown formatting or asterisks in your response. Use plain text with plenty of line breaks for readability.`;
            
            console.log(`[BTCLI] Final agent prompt length: ${agentPrompt.length}`);

            const agentResponse = await APIService.sendMessage(address, agentPrompt);
            console.log(`[BTCLI] Received agent response (length: ${agentResponse.length})`);
            const cleanedResponse = agentResponse.replace(/(?:undefined: )+/g, '')
            console.log(`[BTCLI] Processed response, displaying to user`);
          
            setState((prev) => ({
              ...prev,
              messages: [
                ...prev.messages,
                {
                  type: 'output',
                  content: cleanedResponse,
                  timestamp: Date.now()
                }
              ],
              isLoading: false
            }))
            return
          } catch (agentError: any) {
            console.error(`[BTCLI] Agent API error: ${agentError.message}`, agentError);
            throw new Error(`Failed to process btcli output: ${agentError.message}`);
          }
        }

        const response = await APIService.sendMessage(address, message)
        const cleanedResponse = response.replace(/(?:undefined: )+/g, '')

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: cleanedResponse,
              timestamp: Date.now()
            }
          ],
          isLoading: false
        }))
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: `Error: ${errorMessage}. Please try again.`,
              timestamp: Date.now()
            }
          ],
          isLoading: false,
          error: errorMessage
        }))
      }
    },
    [address]
  )

  const sendImage = useCallback(
    async (file: File) => {
      if (!file) return

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: 'input',
            content: `detect ${file.name}`,
            timestamp: Date.now()
          }
        ],
        isLoading: true,
        error: null
      }))

      try {
        const base64Image = await convertImageFileToBase64(file)
        const response = await APIService.detectImage(address, base64Image)
        const cleanedResponse = response.replace(/(?:undefined: )+/g, '')

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: cleanedResponse,
              timestamp: Date.now()
            }
          ],
          isLoading: false
        }))
      } catch (error) {
        console.error('Image upload error:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: `Error: ${errorMessage}. Please try again.`,
              timestamp: Date.now()
            }
          ],
          isLoading: false,
          error: errorMessage
        }))
      }
    },
    [address]
  )

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    sendImage
  }
}
