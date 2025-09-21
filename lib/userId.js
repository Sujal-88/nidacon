// lib/userId.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUserId() {
  const counter = await prisma.counter.update({
    where: { id: 'user_counter' },
    data: { value: { increment: 1 } },
  });

  const nextId = counter.value;

  return `NIDA0${nextId}`;
}