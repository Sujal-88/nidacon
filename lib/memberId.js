// lib/memberId.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateMemberId() {
  // Use 'upsert' to create the counter if it doesn't exist, or update it if it does.
  const counter = await prisma.memberCounter.upsert({
    where: { id: 'member_counter' },
    update: {
      value: {
        increment: 1,
      },
    },
    create: {
      id: 'member_counter',
      value: 1001, // Start counting from 1001
    },
  });

  const nextId = counter.value;

  // Format the member ID
  return `IDAMEM-${nextId}`;
}