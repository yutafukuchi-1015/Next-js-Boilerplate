import prisma from './prisma';

// This file provides database access using Prisma ORM
// Replaces the previous Drizzle ORM implementation

// Export the prisma client for use throughout the application
export { default as db } from './prisma';

// Export specific models for easier access
export const counterModel = prisma.counter;

// Helper functions for common operations
export const dbHelpers = {
  // Get current counter value
  async getCurrentCount() {
    const counter = await prisma.counter.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    return counter?.count ?? 0;
  },

  // Update counter value
  async updateCount(newCount: number) {
    const existingCounter = await prisma.counter.findFirst();

    if (existingCounter) {
      return await prisma.counter.update({
        where: { id: existingCounter.id },
        data: { count: newCount },
      });
    } else {
      return await prisma.counter.create({
        data: { count: newCount },
      });
    }
  },

  // Increment counter
  async incrementCount() {
    const current = await this.getCurrentCount();
    return await this.updateCount(current + 1);
  },
};
