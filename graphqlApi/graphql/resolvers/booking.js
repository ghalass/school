const prisma = require('../../prismaClient');
const { dateToString } = require('../../helpers/date.');

const transformEvent = event => {
    return { ...event, date: dateToString(event.date) }
}

module.exports = {
    bookings: async () => {
        try {
            const bookings = await prisma.booking.findMany({
                include: { event: { include: { creator: true } }, user: true }
            });
            return bookings.map(booking => {
                return {
                    ...booking,
                    createdAt: dateToString(booking.createdAt),
                    updatedAt: dateToString(booking.updatedAt),
                };
            });
        } catch (error) {
            throw new Error(error?.message || "Failed to fetch bookings");
        }
    },
    bookEvent: async (args) => {
        try {
            const fetchedEvent = await prisma.event.findFirst({
                where: { id: parseInt(args.eventId) }
            });
            if (!fetchedEvent) {
                throw new Error('Event not found.');
            }
            const alreadyBooked = await prisma.booking.findFirst({
                where: {
                    eventId: parseInt(args.eventId),
                    userId: "14481300-3a76-44f3-9f31-387f4dfa7ff2"
                }
            });
            if (alreadyBooked) {
                throw new Error('Already booked.');
            }
            const booking = await prisma.booking.create({
                data: {
                    event: { connect: { id: fetchedEvent.id } },
                    user: { connect: { id: "14481300-3a76-44f3-9f31-387f4dfa7ff2" } } // hardcoded user ID for demonstration
                },
                include: { event: { include: { creator: true } }, user: true }
            });
            return {
                ...booking,
                createdAt: dateToString(booking.createdAt),
                updatedAt: dateToString(booking.updatedAt),
            };
        } catch (error) {
            throw new Error(error?.message || "Failed to book event");
        }
    },
    cancelBooking: async (args) => {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: parseInt(args.bookingId) },
                include: { event: { include: { creator: true } }, user: true }
            });
            if (!booking) {
                throw new Error('Booking not found.');
            }
            const event = transformEvent(booking?.event);
            await prisma.booking.delete({
                where: { id: parseInt(args.bookingId) }
            });
            return event;
        } catch (error) {
            throw new Error(error?.message || "Failed to cancel booking");
        }
    }
}