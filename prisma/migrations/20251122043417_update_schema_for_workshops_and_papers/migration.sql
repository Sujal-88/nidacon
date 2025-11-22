-- DropIndex
DROP INDEX "public"."User_payuId_key";

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "msdcNumber" TEXT,
    "transactionId" TEXT,
    "payuId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workshops" TEXT[],
    "transactionId" TEXT,
    "payuId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperPoster" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "enrollName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fullPaperUrl" TEXT,
    "posterUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperPoster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_memberId_key" ON "Membership"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_transactionId_key" ON "Membership"("transactionId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopRegistration" ADD CONSTRAINT "WorkshopRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperPoster" ADD CONSTRAINT "PaperPoster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
