import { createServer } from "node:http";
import { createYoga, createPubSub, createSchema } from "graphql-yoga";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

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

const yogaApp = createYoga({
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
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: "WS",
  },
});

// Get NodeJS Server from Yoga
const httpServer = createServer(yogaApp);
// Create WebSocket server instance from our Node server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: yogaApp.graphqlEndpoint,
});

// Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      console.log(ctx, msg);
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yogaApp.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        });

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      };

      const errors = validate(args.schema, args.document);
      if (errors.length) return errors;
      return args;
    },
  },
  wsServer
);

httpServer.listen(4010, () => {
  console.info("Server is running on http://localhost:4010/graphql");
});
