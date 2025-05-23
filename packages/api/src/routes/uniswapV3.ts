import { Router } from 'express';
import { isAddress } from 'viem';

import { getPrisma } from '../lib/prisma.js';

const router = Router();

// Get positions by wallet address
router.get('/positions/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    if (!isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    const prisma = getPrisma();
    const positions = await prisma.uniswapV3.findMany({
      where: {
        walletAddress: walletAddress.toLowerCase(),
      },
    });

    const formattedPositions = positions.map((position) => ({
      name: `${position.token0Symbol}/${position.token1Symbol} ${Number(position.feeTier) / 10000}%`,
      price: Number(position.poolPrice),
      positionLowerRange: Number(position.priceLower),
      positionUpperRange: Number(position.priceUpper),
      totalValue:
        Number(position.currentAmount0) * Number(position.token0PriceUSD) +
        Number(position.currentAmount1) * Number(position.token1PriceUSD),
      pnl: Number(position.pnlUSD),
      unclaimedFees:
        Number(position.uncollectedFees0) * Number(position.token0PriceUSD) +
        Number(position.uncollectedFees1) * Number(position.token1PriceUSD),
      inRange: position.inRange,
    }));

    res.json(formattedPositions);
  } catch (error) {
    console.error('Error fetching UniswapV3 positions:', error);
    res.status(500).json({ error: 'Failed to fetch UniswapV3 positions' });
  }
});

export const uniswapV3Router = router;
