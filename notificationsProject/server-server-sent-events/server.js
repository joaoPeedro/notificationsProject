import { createYoga, createPubSub, createSchema } from "graphql-yoga";
import { createServer } from "node:http";

const pubSub = createPubSub();
const workers = [
  {
    id: 1,
    name: "worker 001",
    status: "Started",
  },
  {
    id: 2,
    name: "worker 002",
    status: "Started",
  },
  {
    id: 3,
    name: "worker 003",
    status: "Started",
  },
];

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
      type Worker {
        id: ID!
        name: String!
        status: String!
      }
      type Query {
        workers: [Worker!]
      }

      type Mutation {
        updateWorker(id: ID!, status: String!): ID!
      }

      type Subscription {
        workers: [Worker!]
      }
    `,
    resolvers: {
      Query: {
        workers: () => workers,
      },
      Mutation: {
        updateWorker: (_, { id, status }) => {
          let index;
          workers.map((ele, idx) => {
            if (ele.id === +id) {
              index = idx;
              return;
            }
          });

          workers[index].status = status;

          pubSub.publish("workers", workers);
          return id;
        },
      },
      Subscription: {
        workers: {
          subscribe: () => pubSub.subscribe("workers"),
          resolve: (payload) => payload,
        },
      },
    },
  }),
});

const server = createServer(yoga);
server.listen(4020, () => {
  console.info("Server is running on http://localhost:4020/graphql");
});
