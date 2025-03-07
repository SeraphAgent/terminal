import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const execPromise = promisify(exec);

interface ResearchResults {
  subnetList?: string;
  subnetShow?: string;
  hyperparameters?: string;
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
        `btcli subnet hyperparameters --netuid ${netuid}`,
        `btcli subnet burn-cost`
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
          } else if (cmd.includes('hyperparameters')) {
            results.hyperparameters = formatHyperparametersOutput(stdout);
            console.log(`[BTCLI API] Formatted hyperparameters (length: ${results.hyperparameters?.length || 0})`);
          } else if (cmd.includes('burn-cost')) {
            results.burnCost = formatBurnCostOutput(stdout);
            console.log(`[BTCLI API] Formatted burn cost (length: ${results.burnCost?.length || 0})`);
          }
        } catch (error: any) {
          console.error(`[BTCLI API] Error executing ${cmd}: ${error.message}`);
          // Continue with other commands even if one fails
        }
      }
      
      console.log(`[BTCLI API] Combining results for comprehensive report`);
  
      // Combine all results into a comprehensive report
      const combinedResult = [
        `# Comprehensive Analysis for Subnet ${netuid}`,
        '',
        '## Subnet Overview',
        results.subnetShow || 'Information not available',
        '',
        '## Registration Cost',
        results.burnCost || 'Information not available',
        '',
        '## Key Hyperparameters',
        results.hyperparameters || 'Information not available',
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
    } else if (command.includes('subnet burn-cost')) {
      formattedOutput = formatBurnCostOutput(stdout);
      commandType = 'burn_cost';
    } else if (command.includes('subnet hyperparameters')) {
      formattedOutput = formatHyperparametersOutput(stdout);
      commandType = 'hyperparameters';
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

function truncateSubnetList(subnetList: string, targetNetuid: string): string {
  const lines = subnetList.split('\n');
  const header = lines[0]; // Keep the header
  const relevantLines = [];
  
  // Add the header
  relevantLines.push(header);
  
  // Find the line for our target subnet
  const targetLine = lines.find(line => {
    const parts = line.split(/\s+/);
    return parts[0] === targetNetuid;
  });
  
  if (targetLine) {
    relevantLines.push(targetLine);
  }
  
  // Add a few top subnets (by emission or another metric)
  // First, skip the header
  const dataLines = lines.slice(1);
  
  // Sort by emission (assuming emission is in column 3)
  const sortedLines = dataLines
    .filter(line => line.trim() !== '')
    .sort((a, b) => {
      const emissionA = parseFloat(a.split(/\s+/)[3] || '0');
      const emissionB = parseFloat(b.split(/\s+/)[3] || '0');
      return emissionB - emissionA; // Sort descending
    });
  
  // Add top 5 subnets
  const topLines = sortedLines.slice(0, 5);
  for (const line of topLines) {
    if (!relevantLines.includes(line)) {
      relevantLines.push(line);
    }
  }
  
  return relevantLines.join('\n') + '\n\n(Showing target subnet and top subnets by emission)';
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