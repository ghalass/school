const { buildSchema } = require('graphql');


module.exports = buildSchema(`
        type Booking {
            id: ID!
            event: Event!   
            user: User!
            createdAt: String!
            updatedAt: String!            
        }
            
        type Event {
            id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            id: ID!
            first_name: String
            last_name: String
            email: String!
            role: String!
            active: Boolean!
            createdEvents: [Event!]            
        }

        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            first_name: String!
            last_name: String!
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)