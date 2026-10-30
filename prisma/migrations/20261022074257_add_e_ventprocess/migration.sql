-- CreateTable
CREATE TABLE "processedEvent" (
    "Event" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processedEvent_pkey" PRIMARY KEY ("Event")
);
