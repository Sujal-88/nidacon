// lib/userId.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUserId() {
  // Atomically increment the counter in the database
  const counter = await prisma.counter.update({
    where: { id: 'user_counter' },
    data: { value: { increment: 1 } },
  });

  // The 'counter.value' now holds the newly incremented number.
  // Use this value directly.
  const nextId = counter.value;

  // The rest of your formatting is correct
  return `2026NIDA0${nextId}`;
}