import React from "react";
import { createClient } from "graphql-ws";
import { useWorkers } from "./hooks/useWorkers";
import { useQueryClient } from "@tanstack/react-query";

const url = "//localhost:4010/graphql";
const queryKey = "workersGraphqlTransportWsProtocol";

export const ClientGraphqlTransportWsProtocol = () => {
  const { data } = useWorkers({ queryKey, url: `http:${url}` });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const client = createClient({
      url: `ws:${url}`,
    });

    (async () => {
      const onNext = (data) => {
        queryClient.setQueriesData(queryKey, { data: data.data.workers });
      };

      let unsubscribe = () => {
        /* complete the subscription */
      };

      await new Promise((resolve, reject) => {
        unsubscribe = client.subscribe(
          {
            query: `subscription {
                       workers {
                          id
                          name 
                          status 
                      } 
                  }`,
          },
          {
            next: onNext,
            error: reject,
            complete: resolve,
          }
        );
      });
    })();
  }, []);

  return (
    <div>
      <h3>
        Subscription using graphql-transport-ws protocol - graphql-ws library
      </h3>
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
