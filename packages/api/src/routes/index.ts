import { Router } from 'express';

import { uniswapV3Router } from './uniswapV3.js';

export const apiRouter = Router();

// Mount all route modules
apiRouter.use('/uniswapV3', uniswapV3Router);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
