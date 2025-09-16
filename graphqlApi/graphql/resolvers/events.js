const prisma = require('../../prismaClient');
const { dateToString } = require('../../helpers/date.');

const transformEvent = event => {
    return { ...event, date: dateToString(event.date) }
}

module.exports = {
    events: async () => {
        try {
            const events = await prisma.event.findMany({
                include: { creator: true }
            });
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            throw new Error(error?.message || "Failed to fetch events");
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated");
        }
        try {
            const newEvent = {
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: { connect: { id: req.userId } },
            };
            const createdEvent = await prisma.event.create({
                data: newEvent,
                include: { creator: true }
            });
            return transformEvent(createdEvent);
        } catch (error) {
            throw new Error(error?.message || "Failed to create event");
        }
    },
}