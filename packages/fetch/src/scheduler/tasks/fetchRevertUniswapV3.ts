import { AsyncTask, SimpleIntervalJob } from 'toad-scheduler';

import createLogger, { CustomLogger } from '@/src/lib/pino.js';
import { getPrisma } from '@/src/lib/prisma.js';
import { scheduler } from '@/src/lib/scheduler.js';
import { TaskOptions } from '@/src/scheduler/tasks/types.js';
import { getPositions } from '@/src/services/revert/index.js';

const prisma = getPrisma();

export const fetchRevertUniswapV3 = async (logger: CustomLogger) => {
  try {
    const WALLET_ADDRESS = '0x0453173979c74ff0cb59235ed6c59af9f9749193';
    logger.addContext(`walletAddress: ${WALLET_ADDRESS}`);

    logger.info('Fetching...');
    const positions = await getPositions(WALLET_ADDRESS);
    logger.info('Fetched');

    // Process each position and save to database
    const fetchedAt = new Date();
    for (const position of positions.data) {
      const currentState = position.cash_flows.find((cf) => cf.current);

      await prisma.uniswapV3.create({
        data: {
          fetchedAt,
          walletAddress: position.og_owner,
          nftId: position.nft_id,
          poolAddress: position.pool,
          token0Address: position.token0,
          token1Address: position.token1,
          token0Symbol: position.tokens[position.token0].symbol,
          token1Symbol: position.tokens[position.token1].symbol,
          feeTier: position.fee_tier,
          currentAmount0: position.current_amount0,
          currentAmount1: position.current_amount1,
          token0PriceUSD: currentState?.prices?.token0?.usd ?? '0',
          token1PriceUSD: currentState?.prices?.token1?.usd ?? '0',
          pnlUSD: position.performance.usd.pnl,
          uncollectedFees0: position.uncollected_fees0,
          uncollectedFees1: position.uncollected_fees1,
          inRange: position.in_range,
          poolPrice: position.pool_price,
          priceLower: position.price_lower,
          priceUpper: position.price_upper,
        },
      });
    }

    logger.info(`Saved to database`);
  } catch (error) {
    logger.error('Error:', error);
  }
};

export function scheduleFetchRevertUniswapV3({
  id,
  logsEnabled,
  intervalMs,
  runImmediately,
  preventOverrun,
}: TaskOptions) {
  const logger = createLogger(id, logsEnabled);

  const task = new AsyncTask(`${id}_task`, () => {
    return fetchRevertUniswapV3(logger).catch((e) => logger.error('TASK-CATCH', e));
  });

  scheduler.addSimpleIntervalJob(
    new SimpleIntervalJob({ milliseconds: intervalMs, runImmediately }, task, {
      id,
      preventOverrun,
    }),
  );
}
