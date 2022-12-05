import React from "react";
import { useWorkers } from "./hooks/useWorkers";
import { useQueryClient } from "@tanstack/react-query";

const url = "http://localhost:4020/graphql";
const queryKey = "workersGraphqlServerSentEvents";

export const ClientServerSentEvents = () => {
  const { data } = useWorkers({ queryKey, url });
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const theUrl = new URL(url);

    theUrl.searchParams.append(
      "query",
      /* GraphQL */ `
        subscription {
          workers {
            id
            name
            status
          }
        }
      `
    );

    const eventsource = new EventSource(theUrl.toString(), {
      // used to deal with Server sent events
      withCredentials: true, // This is required for cookies
    });

    eventsource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      queryClient.setQueriesData(queryKey, { data: data.data.workers });
    };
  }, []);

  return (
    <div>
      <h3>Subscription using Server-sent events</h3>
      <p>
        to trigger a new update create a new mutation:
        <a href={`http:${url}`} target="blank">
          {`http:${url}`}
        </a>
      </p>
      <pre>{JSON.stringify(data, null, " ")}</pre>
    </div>
  );
};
