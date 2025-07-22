'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';
import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { CounterValidation } from '@/validations/CounterValidation';

export async function incrementCounter(_: unknown, formData: FormData) {
  try {
    // Validate form data
    const json = Object.fromEntries(formData.entries());
    const parse = CounterValidation.safeParse(json);

    if (!parse.success) {
      logger.warn('Counter validation failed', { errors: parse.error.issues });
      return { errors: z.treeifyError(parse.error) };
    }

    // Parse header with error handling
    let id = 0;
    try {
      const headerValue = (await headers()).get('x-e2e-random-id');
      if (headerValue) {
        const parsedId = Number(headerValue);
        if (Number.isNaN(parsedId)) {
          logger.warn('Invalid x-e2e-random-id header value', { headerValue });
          // Continue with default id = 0
        } else {
          id = parsedId;
        }
      }
    } catch (headerError) {
      logger.error('Failed to read headers', { error: headerError });
      // Continue with default id = 0
    }

    // Database operation with error handling
    let counter;
    try {
      // Check if counter with this ID exists
      const existingCounter = await db.counter.findUnique({
        where: { id },
      });

      if (existingCounter) {
        // Update existing counter
        counter = await db.counter.update({
          where: { id },
          data: { count: existingCounter.count + parse.data.increment },
        });
      } else {
        // Create new counter
        counter = await db.counter.create({
          data: { id, count: parse.data.increment },
        });
      }
    } catch (dbError) {
      logger.error('Database operation failed', {
        error: dbError,
        id,
        increment: parse.data.increment,
      });
      return {
        error: 'Failed to update counter. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined,
      };
    }

    // Validate database result
    if (!counter || counter.count === undefined) {
      logger.error('Database returned invalid result', { result: counter });
      return {
        error: 'Counter update completed but result is invalid. Please refresh and try again.',
      };
    }

    // Log success
    try {
      logger.info('Counter has been incremented', {
        id,
        increment: parse.data.increment,
        newCount: counter.count,
      });
    } catch (logError) {
      // Don't fail the operation if logging fails
      console.error('Failed to log counter increment:', logError);
    }

    // Revalidate the counter page to update the CurrentCount component
    revalidatePath('/[locale]/counter', 'page');

    return { count: counter.count };
  } catch (error) {
    // Catch-all error handler for unexpected errors
    logger.error('Unexpected error in incrementCounter', { error });
    return {
      error: 'An unexpected error occurred. Please try again.',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    };
  }
}
