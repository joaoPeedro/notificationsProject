import React from "react";
import { useWorkers } from "./hooks/useWorkers";
import { useQueryClient } from "@tanstack/react-query";

const url = "//localhost:4010/graphql";
const queryKey = "workersGraphqlTransportWsProtocolWebSocket";

export const ClientGraphqlTransportWsProtocolWebSocket = () => {
  const { data } = useWorkers({ queryKey, url: `http:${url}` });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const ws = new WebSocket(`ws:${url}`, "graphql-transport-ws");

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "connection_init", payload: {} }));
      ws.send(
        JSON.stringify({
          id: "1",
          type: "start",
          payload: {
            // variables: {},
            extensions: {},
            operationName: "mySubscription",
            query: `subscription mySubscription{
              workers {
                id
                name
                status
                }
            }`,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const msgData = JSON.parse(event.data);

      if (msgData.type === "data") {
        queryClient.setQueriesData(queryKey, { data: msgData.payload.data });
      }
    };

    return () => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({ id: "1", type: "stop" }));
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      <h3>Subscription using graphql-transport-ws protocol - WebSocket API</h3>
      <p>
        to trigger a new update create a new mutation:{" "}
        <a href={`http:${url}`} target="blank">
          {`http:${url}`}
        </a>
      </p>
      <pre>{JSON.stringify(data, null, " ")}</pre>
    </div>
  );
};
