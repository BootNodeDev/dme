import { env } from '../../env.js';

import { instance } from './axios.js';
import type { RevertApiResponse } from './types.js';

/**
 * Fetches LP positions for a given wallet address from Revert Finance API
 * @param walletAddress - The Ethereum wallet address to fetch positions for
 * @returns Promise with the positions data
 */
export async function getPositions(walletAddress: string): Promise<RevertApiResponse> {
  const url = `${env.REVERT_API_URL}/positions/uniswapv3/account/${walletAddress}?active=true`;

  try {
    const { data } = await instance.get<RevertApiResponse>(url);
    return data;
  } catch (error) {
    console.error('Error fetching positions from Revert:', error);
    throw error;
  }
}
