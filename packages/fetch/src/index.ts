//import createMissingSlots from "@/src/feed/createMissingSlots.js";
import createLogger from '@/src/lib/pino.js';
import { getPrisma } from '@/src/lib/prisma.js';
import { scheduleTasks } from '@/src/scheduler/index.js';

const prisma = getPrisma();
const logger = createLogger('index');

async function main() {
  await prisma.$connect();

  scheduleTasks();
}

main()
  .catch((e) => {
    logger.error('', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
