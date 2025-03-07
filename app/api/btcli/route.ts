import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const execPromise = promisify(exec);

interface ResearchResults {
  subnetList?: string;
  subnetShow?: string;
  burnCost?: string;
}

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    
    console.log(`[BTCLI API] Received command request: ${command}`);
    
    if (!command || typeof command !== 'string') {
      console.warn('[BTCLI API] Invalid command format received');
      return NextResponse.json(
        { error: 'Invalid command' },
        { status: 400 }
      );
    }
    
    // Check if this is a research command
    const researchMatch = command.match(/btcli subnet research --netuid (\d+)/);
    if (researchMatch) {
      const netuid = researchMatch[1];
      console.log(`[BTCLI API] Processing comprehensive research for subnet ${netuid}`);
      
      // Execute multiple commands and combine their results
      const commands = [
        `btcli subnet list`,
        `btcli subnet show --netuid ${netuid}`,
        `btcli subnet metagraph --netuid ${netuid}`
      ];
      
      // Initialize with the correct type
      const results: ResearchResults = {};
      
      // Execute each command
      for (const cmd of commands) {
        console.log(`[BTCLI API] Executing research component: ${cmd}`);
        try {
          const { stdout } = await execPromise(cmd);
          console.log(`[BTCLI API] Successfully executed: ${cmd} (output length: ${stdout.length})`);
          
          // Store results based on command type
          if (cmd.includes('subnet list')) {
            results.subnetList = formatSubnetListOutput(stdout);
            console.log(`[BTCLI API] Formatted subnet list (length: ${results.subnetList?.length || 0})`);
          } else if (cmd.includes('subnet show')) {
            results.subnetShow = formatSubnetShowOutput(stdout);
            console.log(`[BTCLI API] Formatted subnet show (length: ${results.subnetShow?.length || 0})`);
          }
        } catch (error: any) {
          console.error(`[BTCLI API] Error executing ${cmd}: ${error.message}`);
          // Continue with other commands even if one fails
        }
      }
      
      console.log(`[BTCLI API] Combining results for comprehensive report`);
      
      // Extract subnet info from the subnet list instead of subnet show
      const subnetInfo = extractSubnetInfoFromList(results.subnetList || '', netuid);
      
      // Combine all results into a comprehensive report
      const combinedResult = [
        `# Comprehensive Analysis for Subnet ${netuid}`,
        '',
        '## Subnet Overview',
        subnetInfo || results.subnetShow || 'Information not available',
        '',
        '## Subnet Context (All Subnets)',
        // Truncate the subnet list to just the first few lines and the specific subnet
        truncateSubnetList(results.subnetList || 'Information not available', netuid)
      ].join('\n');
      
      console.log(`[BTCLI API] Combined result length: ${combinedResult.length}`);
      console.log(`[BTCLI API] Returning research results for subnet ${netuid}`);
      
      return NextResponse.json({
        result: combinedResult,
        originalCommand: command,
        commandType: 'subnet_research'
      });
    }
    
    // Validate and sanitize the command to prevent command injection
    // Only allow specific btcli commands
    const allowedCommands = [
      'subnet list',
      'subnet show',
      'subnet hyperparameters',
      'subnet burn-cost'
    ];
    
    // Check if the command starts with any of the allowed commands
    const isAllowed = allowedCommands.some(allowed => 
      command.trim().startsWith(`btcli ${allowed}`)
    );
    
    if (!isAllowed) {
      console.warn(`[BTCLI API] Blocked disallowed command: ${command}`);
      return NextResponse.json(
        { error: 'Command not allowed' },
        { status: 403 }
      );
    }
    
    console.log(`[BTCLI API] Executing command: ${command}`);
    
    // Execute the btcli command
    const startTime = Date.now();
    const { stdout, stderr } = await execPromise(command);
    const executionTime = Date.now() - startTime;
    
    console.log(`[BTCLI API] Command executed in ${executionTime}ms`);
    
    if (stderr) {
      console.error(`[BTCLI API] Command error: ${stderr}`);
      return NextResponse.json(
        { error: stderr },
        { status: 500 }
      );
    }
    
    // Format the output based on the command type
    let formattedOutput = stdout;
    let commandType = '';
    
    if (command.includes('subnet show')) {
      formattedOutput = formatSubnetShowOutput(stdout);
      commandType = 'subnet_show';
    } else if (command.includes('subnet list')) {
      formattedOutput = formatSubnetListOutput(stdout);
      commandType = 'subnet_list';
    }
    
    // Log a truncated version of the output to avoid console flooding
    const truncatedOutput = formattedOutput.length > 200 
      ? `${formattedOutput.substring(0, 200)}... (${formattedOutput.length} chars total)`
      : formattedOutput;
    console.log(`[BTCLI API] Command output: ${truncatedOutput}`);
    
    return NextResponse.json({ 
      result: formattedOutput,
      commandType: commandType,
      originalCommand: command
    });
  } catch (error: any) {
    console.error('[BTCLI API] Error executing btcli command:', error);
    return NextResponse.json(
      { error: 'Failed to execute command' },
      { status: 500 }
    );
  }
}
   
// Helper function to format subnet show output
function formatSubnetShowOutput(output: string): string {
  // First try to extract the subnet summary information from the bottom
  const subnetInfoMatch = output.match(/Subnet (\d+): ([^\n]+)\n\s+Owner: ([^\n]+)\n\s+Rate: ([^\n]+)\n\s+Emission: ([^\n]+)\n\s+TAO Pool: ([^\n]+)\n\s+Alpha Pool: ([^\n]+)\n\s+Tempo: ([^\n]+)\n\s+Registration cost[^:]*: ([^\n]+)/);
  
  if (subnetInfoMatch) {
    const [_, netuid, name, owner, rate, emission, taoPool, alphaPool, tempo, regCost] = subnetInfoMatch;
    
    const formattedLines = [
      `Subnet ${netuid}: ${name}`,
      `Owner: ${owner}`,
      `Rate: ${rate}`,
      `Emission: ${emission}`,
      `TAO Pool: ${taoPool}`,
      `Alpha Pool: ${alphaPool}`,
      `Tempo: ${tempo}`,
      `Registration cost: ${regCost}`
    ];
    
    return formattedLines.join('\n');
  }
  
  // If we couldn't extract the subnet info using regex, fall back to the original method
  const lines = output.split('\n');
  const formattedLines: string[] = [];
  let inTable = false;
  
  // Define which parameters we want to extract from the table
  const relevantParams = ['Rate', 'Emission', 'TAO Pool', 'Alpha Pool', 'Tempo', 'Registration'];
  
  for (const line of lines) {
    if (line.includes('Subnet') && !inTable) {
      formattedLines.push(line.trim());
      continue;
    }
    
    if (line.includes('──────┼')) {
      inTable = true;
      continue;
    }
    
    if (inTable && line.includes('──────')) {
      continue;
    }
    
    if (inTable && line.trim() === '') {
      break;
    }
    
    if (inTable) {
      // Check if this line contains one of our relevant parameters
      const param = relevantParams.find(p => line.includes(p));
      if (param) {
        // Clean up the line to make it more readable
        const cleanLine = line.trim().replace(/\s+/g, ' ');
        formattedLines.push(`  ${cleanLine}`);
      }
    }
  }
  
  return formattedLines.join('\n');
}

function extractSubnetInfoFromList(subnetList: string, targetNetuid: string): string {
  try {
    console.log(`[DEBUG] Full subnet list table:\n${subnetList}`);
    
    // First, find the complete subnet entry in the original table
    const tableLines = subnetList.split('\n');
    
    // Find the header line to understand where the data starts
    const headerIndex = tableLines.findIndex(line => line.includes('Netuid') && line.includes('Name'));
    if (headerIndex === -1) {
      throw new Error('Could not find table header');
    }
    
    // Find all subnet entries to calculate rank
    const subnetEntries = [];
    let currentSubnetId = '';
    
    for (let i = headerIndex + 1; i < tableLines.length; i++) {
      const line = tableLines[i].trim();
      const match = line.match(/^\s*(\d+)\s+/);
      
      if (match) {
        currentSubnetId = match[1];
        subnetEntries.push(currentSubnetId);
      }
    }
    
    // Calculate rank (position in the table)
    const rank = subnetEntries.indexOf(targetNetuid);
    const totalSubnets = subnetEntries.length;
    
    // Find the line for our target subnet
    let targetLineIndex = -1;
    for (let i = 0; i < tableLines.length; i++) {
      const line = tableLines[i].trim();
      if (line.startsWith(`${targetNetuid} `) || line.match(new RegExp(`^\\s*${targetNetuid}\\s+`))) {
        targetLineIndex = i;
        break;
      }
    }
    
    if (targetLineIndex === -1) {
      throw new Error(`Could not find information for subnet ${targetNetuid}`);
    }
    
    // Get the target line and the continuation lines (there might be multiple)
    const targetLine = tableLines[targetLineIndex];
    const continuationLines = [];
    
    // Collect continuation lines (they don't start with a number and follow the target line)
    for (let i = targetLineIndex + 1; i < tableLines.length; i++) {
      const line = tableLines[i].trim();
      if (line.match(/^\d+\s+/)) {
        // This is the start of a new subnet entry
        break;
      }
      if (line.length > 0) {
        continuationLines.push(tableLines[i]);
      }
    }
    
    console.log(`[DEBUG] Target line: ${targetLine}`);
    continuationLines.forEach((line, i) => {
      console.log(`[DEBUG] Continuation line ${i+1}: ${line}`);
    });
    
    // Extract information from the lines
    // Split the target line by the pipe character
    const targetColumns = targetLine.split('│').map(col => col.trim());
    const continuationColumns = continuationLines.map(line => 
      line.split('│').map(col => col.trim())
    );
    
    // Extract name (from target line, column 1)
    const name = targetColumns[1] || '';
    
    // Extract symbol (from continuation line, column 1, after τ/)
    let symbol = '';
    for (const cols of continuationColumns) {
      if (cols[1] && cols[1].includes('τ/')) {
        const match = cols[1].match(/τ\/([^\s]+)/);
        if (match) {
          symbol = match[1];
          break;
        }
      }
    }
    
    // Extract price (from target line, column 2)
    const price = targetColumns[2] || '';
    
    // Extract market cap (from continuation line 1, column 3)
    const marketCap = continuationColumns[0] && continuationColumns[0][3] ? continuationColumns[0][3] : '';
    
    // Extract emission (from continuation line 1, column 4)
    const emission = continuationColumns[0] && continuationColumns[0][4] ? continuationColumns[0][4] : '';
    
    // Extract pool values
    // First part of pool (τ value from continuation line 1, column 5)
    const poolTao = continuationColumns[0] && continuationColumns[0][5] ? continuationColumns[0][5].replace('…', '') : '';
    
    // Second part of pool (symbol value from continuation line 2, column 5)
    const poolAlpha = continuationColumns[1] && continuationColumns[1][5] ? continuationColumns[1][5].replace('…', '') : '';
    
    // Extract stake (from target line, column 6)
    const stake = targetColumns[6] ? targetColumns[6].replace('…', '') : '';
    
    // Extract supply (from target line, column 7)
    const supply = targetColumns[7] ? targetColumns[7].replace('…', '') : '';
    
    // Extract tempo (from target line, column 8)
    const tempo = targetColumns[8] ? targetColumns[8] : '';
    
    // Format the subnet info as a markdown string
    console.log(`## Subnet ${targetNetuid}: ${name} ${symbol}`);
    console.log('');
    console.log(`- **Price**: ${price} τ/${symbol}`);
    console.log(`- **Market Cap**: ${marketCap}`);
    console.log(`- **Emission**: τ ${emission}`);
    console.log(`- **Pool**: τ ${poolTao}, ${poolAlpha} ${symbol}`);
    console.log(`- **Stake**: ${stake} ${symbol}`);
    console.log(`- **Supply**: ${supply} ${symbol}`);
    console.log(`- **Tempo**: ${tempo}`);
    console.log(`- **Rank by Emission**: ${rank}`);
    const formattedInfo = [
      `## Subnet ${targetNetuid}: ${name} ${symbol}`,
      '',
      `- **Price**: ${price} τ/${symbol}`,
      `- **Market Cap**: ${marketCap}`,
      `- **Emission**: τ ${emission}`,
      `- **Pool**: τ ${poolTao}, ${poolAlpha} ${symbol}`,
      `- **Stake**: ${stake} ${symbol}`,
      `- **Supply**: ${supply} ${symbol}`,
      `- **Tempo**: ${tempo}`,
      `- **Rank**: ${rank} out of ${totalSubnets}`
    ].join('\n');
    
    return formattedInfo;
  } catch (error) {
    console.error(`[DEBUG] Error extracting subnet info: ${error}`);
    return `## Subnet ${targetNetuid}\n\nInformation not available`;
  }
}

// Function to calculate subnet rank based on emission
function calculateSubnetRank(subnetList: string, targetNetuid: string): string {
  try {
    const lines = subnetList.split('\n');
    const subnets: Array<{netuid: string, emission: number}> = [];
    
    // Extract all subnet emissions
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const netuidMatch = line.match(/^\s*(\d+)\s+/);
      
      if (netuidMatch) {
        const netuid = netuidMatch[1];
        
        // Skip root subnet (netuid 0)
        if (netuid === '0') continue;
        
        // Extract emission value
        const columns = line.split('│');
        if (columns.length > 4) {
          const emissionText = columns[4].trim();
          // Parse emission value - looking for format like "τ 0.0663"
          const emissionMatch = emissionText.match(/τ\s+([\d.]+)/);
          if (emissionMatch) {
            const emission = parseFloat(emissionMatch[1]);
            subnets.push({ netuid, emission });
          }
        }
      }
    }
    
    // Sort by emission (descending)
    subnets.sort((a, b) => b.emission - a.emission);
    
    // Find the rank
    const rankIndex = subnets.findIndex(s => s.netuid === targetNetuid);
    if (rankIndex !== -1) {
      return `${rankIndex + 1} out of ${subnets.length}`;
    }
    
    return 'Unknown';
  } catch (error) {
    console.error(`Error calculating rank: ${error}`);
    return 'Unknown';
  }
}

function truncateSubnetList(subnetList: string, targetNetuid: string): string {
  const lines = subnetList.split('\n');
  
  // Find the header line (contains "Netuid")
  const headerIndex = lines.findIndex(line => line.includes('Netuid'));
  if (headerIndex === -1) {
    return subnetList; // Return the original if we can't find the header
  }
  
  // Get both header lines
  const header1 = lines[headerIndex];
  const header2 = headerIndex + 1 < lines.length ? lines[headerIndex + 1] : '';
  const relevantLines = [header1, header2];
  
  // Find the line for our target subnet
  const targetLine = lines.find(line => {
    const parts = line.trim().split(/\s+/);
    return parts[0] === targetNetuid;
  });
  
  if (targetLine) {
    relevantLines.push(targetLine);
    
    // Find the next line which might contain additional information
    const nextLineIndex = lines.indexOf(targetLine) + 1;
    if (nextLineIndex < lines.length && lines[nextLineIndex].trim() !== '' && !lines[nextLineIndex].includes('─')) {
      relevantLines.push(lines[nextLineIndex]);
    }
  }
  
  // Add top subnets by emission
  // First, collect all data lines
  const dataLines = [];
  let inDataSection = false;
  
  for (const line of lines) {
    if (line.includes('Netuid')) {
      inDataSection = true;
      continue;
    }
    
    if (inDataSection && line.trim() !== '' && !line.includes('─')) {
      // Check if this is a subnet line (starts with a number)
      if (/^\s*\d+\s/.test(line)) {
        dataLines.push(line);
      }
    }
  }
  
  // Sort by emission (column 4 in the table)
  const sortedLines = dataLines
    .filter(line => !line.includes(targetNetuid)) // Remove target subnet to avoid duplication
    .sort((a, b) => {
      try {
        // Extract emission values (τ X.XXXX)
        const emissionA = parseFloat(a.match(/τ\s+(\d+\.\d+)/)?.[1] || '0');
        const emissionB = parseFloat(b.match(/τ\s+(\d+\.\d+)/)?.[1] || '0');
        return emissionB - emissionA; // Sort descending
      } catch (e) {
        return 0;
      }
    });
  
  // Add top 5 subnets
  const topLines = sortedLines.slice(0, 5);
  for (const line of topLines) {
    relevantLines.push(line);
  }
  
  return relevantLines.join('\n') + '\n\n(Showing target subnet and top 5 subnets by emission)';
}

// Helper function to format subnet list output
function formatSubnetListOutput(output: string): string {
  // The subnet list output is already well-formatted, but we can make it more concise
  // by removing some of the decorative elements
  const lines = output.split('\n');
  const relevantLines = [];
  
  // Find the table header and data
  let foundHeader = false;
  
  for (const line of lines) {
    // Skip empty lines and decorative lines
    if (line.trim() === '' || line.includes('━━━━') || line.includes('────')) {
      continue;
    }
    
    // Include the header and data rows
    if (line.includes('Netuid') || foundHeader) {
      foundHeader = true;
      relevantLines.push(line);
    }
  }
  
  return relevantLines.join('\n');
}

// Helper function to format burn cost output
function formatBurnCostOutput(output: string): string {
  // Extract just the burn cost value
  const match = output.match(/Subnet burn cost: (τ \d+\.\d+)/);
  if (match) {
    return `Registration cost: ${match[1]}`;
  }
  return output;
}

// Helper function to format hyperparameters output
function formatHyperparametersOutput(output: string): string {
  // Extract the most important hyperparameters
  const lines = output.split('\n');
  const relevantParams = [
    'rho', 'tempo', 'registration_allowed', 'min_burn', 'max_burn',
    'target_regs_per_interval', 'max_validators', 'difficulty'
  ];
  
  const formattedLines = [];
  let netuidLine = '';
  
  // Find the netuid line
  for (const line of lines) {
    if (line.includes('NETUID:')) {
      netuidLine = line.trim();
      formattedLines.push(netuidLine);
      break;
    }
  }
  
  // Find the hyperparameters table
  let inTable = false;
  for (const line of lines) {
    if (line.includes('HYPERPARAMETER') && line.includes('VALUE')) {
      inTable = true;
      formattedLines.push('Key Hyperparameters:');
      continue;
    }
    
    if (inTable && line.includes('──────')) {
      continue;
    }
    
    if (inTable && line.trim() === '') {
      break;
    }
    
    if (inTable) {
      // Check if this line contains one of our relevant parameters
      const param = relevantParams.find(p => line.includes(p));
      if (param) {
        // Clean up the line to make it more readable
        const cleanLine = line.trim().replace(/\s+/g, ' ');
        formattedLines.push(`  ${cleanLine}`);
      }
    }
  }
  
  return formattedLines.join('\n');
}