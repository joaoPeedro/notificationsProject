import { useQuery } from "@tanstack/react-query";

const requestBody = {
  query: `query {
    workers {
      id
      name
      status
    }
  }`,
};

const fetchWorkers = async (url) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

const useWorkers = ({ queryKey, url }) => {
  return useQuery([queryKey], () => fetchWorkers(url), {
    staleTime: Infinity,
  });
};

export { useWorkers };
