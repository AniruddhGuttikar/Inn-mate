// pages/api/scheduler.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Queue to store properties for deletion with FIFO round-robin processing
let deletionQueue: { id: string; deleteDate: Date }[] = [];

// Function to process the deletion queue in round-robin
async function processDeletionQueue() {
  const now = new Date();

  for (let i = 0; i < deletionQueue.length; i++) {
    const property = deletionQueue[i];
    
    // Check if the deleteDate has passed
    if (property.deleteDate <= now) {
      await prisma.property.update({
        where: { id: property.id },
        data: { isDeleted: true },
      });
      console.log(`Deleted property with ID: ${property.id}`);

      // Remove the property from the queue after deletion
      deletionQueue.splice(i, 1);
      i--; // Adjust the index after deletion
    }
  }
}

// Schedule to process the deletion queue daily
cron.schedule('0 0 * * *', async () => {
  processDeletionQueue();
});

// API handler to receive individual properties for deletion scheduling
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, maxDate } = req.body;

    if (!id || !maxDate) {
      return res.status(400).json({ error: 'Invalid property data provided.' });
    }

    // Calculate deleteDate as the day after maxDate
    const deleteDate = new Date(maxDate);
    deleteDate.setDate(deleteDate.getDate() + 1);

    // Add property to the queue
    deletionQueue.push({ id, deleteDate });
    console.log(`Scheduled property with ID: ${id} for deletion on ${deleteDate}`);

    res.status(200).json({ message: 'Property scheduled for deletion.' });
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
