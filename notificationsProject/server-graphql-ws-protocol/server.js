import { GraphQLServer, PubSub } from "graphql-yoga";

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

const typeDefs = `
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
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
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
      subscribers.forEach((fn) => fn());
      return id;
    },
  },
  Subscription: {
    workers: {
      subscribe: (_, args, { pubsub }) => {
        const channel = "workers";
        onMessagesUpdates(() => pubsub.publish(channel, { workers }));
        return pubsub.asyncIterator(channel);
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
