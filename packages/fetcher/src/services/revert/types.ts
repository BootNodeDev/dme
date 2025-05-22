// Types for the Revert Finance API response

export interface RevertApiResponse {
  success: boolean;
  total_count: number;
  exited_count: number;
  data: Position[];
}

export interface Position {
  // Basic position info
  nft_id: number;
  og_owner: string;
  pool: string;
  token0: string;
  token1: string;
  fee_tier: string;
  in_range: boolean;

  // Current amounts and prices
  current_amount0: string;
  current_amount1: string;
  pool_price: string;
  price_lower: string;
  price_upper: string;

  // Performance metrics
  performance: {
    usd: {
      pnl: string;
      roi: string;
      apr: string;
      pool_pnl: string;
      pool_roi: string;
      pool_apr: string;
      il: string;
      fee_apr: string;
    };
  };

  // Fees
  uncollected_fees0: string;
  uncollected_fees1: string;

  // Token info
  tokens: {
    [key: string]: {
      address: string;
      decimals: number;
      symbol: string;
      price: string;
      prices: {
        usd: string;
        source: string;
      };
    };
  };

  // Cash flows for current state
  cash_flows: CashFlow[];
}

export interface CashFlow {
  type: string;
  timestamp: number;
  prices?: {
    token0?: {
      usd: number;
      token1: number;
      token_key: string;
    };
    token1?: {
      usd: number;
      token0: number;
      token_key: string;
    };
  };
  amount0?: string;
  amount1?: string;
  current?: boolean;
}


