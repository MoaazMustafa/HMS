import type { NextRequest } from 'next/server';
// eslint-disable-next-line no-duplicate-imports
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/appointments/booked-slots
 * Returns already booked time slots for a specific doctor on a specific date
 * This helps prevent double-booking by showing only available slots in the UI
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const dateStr = searchParams.get('date');

    if (!doctorId || !dateStr) {
      return NextResponse.json(
        { error: 'Missing required parameters: doctorId and date' },
        { status: 400 }
      );
    }

    // Parse the date
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);

    // Get all booked appointments for this doctor on this date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledDate: selectedDate,
        status: {
          in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
      select: {
        startTime: true,
        endTime: true,
        duration: true,
      },
    });

    // Extract all booked time slots (including overlapping ranges)
    const bookedSlots: string[] = [];
    
    for (const apt of appointments) {
      // Add the start time
      bookedSlots.push(apt.startTime);

      // If appointment is longer than 30 minutes, mark intermediate slots as booked too
      if (apt.duration && apt.duration > 30) {
        const [startHour, startMinute] = apt.startTime.split(':').map(Number);
        const [endHour, endMinute] = apt.endTime.split(':').map(Number);
        
        let currentHour = startHour;
        let currentMinute = startMinute + 30; // Start from next 30-min slot

        while (
          currentHour < endHour ||
          (currentHour === endHour && currentMinute < endMinute)
        ) {
          if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour += 1;
          }

          const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
          bookedSlots.push(timeSlot);

          currentMinute += 30;
        }
      }
    }

    return NextResponse.json({
      bookedSlots: [...new Set(bookedSlots)], // Remove duplicates
      totalBooked: bookedSlots.length,
    });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booked slots' },
      { status: 500 }
    );
  }
}
