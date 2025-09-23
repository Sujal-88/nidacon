// lib/userId.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUserId() {
  // Use 'upsert' to create the counter if it doesn't exist, or update it if it does.
  const counter = await prisma.counter.upsert({
    where: { id: 'user_counter' },
    update: {
      value: {
        increment: 1,
      },
    },
    create: {
      id: 'user_counter',
      value: 100, // Start counting from 100
    },
  });

  const nextId = counter.value;

  // Format the user ID
  return `NIDA${nextId}`;
}