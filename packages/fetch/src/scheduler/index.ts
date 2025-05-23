import ms from 'ms';

import { scheduleFetchRevertUniswapV3 } from './tasks/fetchRevertUniswapV3.js';

// Move the logic that prevents the task to run to the task function, instead of the implementation.
export function scheduleTasks() {
  scheduleFetchRevertUniswapV3({
    id: 'ReserveUniswapV3',
    logsEnabled: true,
    intervalMs: ms('1m'),
    runImmediately: true,
    preventOverrun: true,
  });
}
