import * as React from "react";
import apiClient from "@/api/api-client";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type UseFetchResponse<T> = [T | null, boolean, Error | null, (dataOrOptions?: any) => Promise<T>];

const useFetch = <T>(endpoint: string, method: HttpMethod = "GET"): UseFetchResponse<T> => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(
    async (dataOrOptions?: any): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        let response;
        let body: any;
        let headers: Record<string, string> | undefined;

        // Manejar la retrocompatibilidad
        if (typeof dataOrOptions === "object" && dataOrOptions !== null) {
          if (dataOrOptions.body || dataOrOptions.headers) {
            body = dataOrOptions.body;
            headers = dataOrOptions.headers;
          } else {
            body = dataOrOptions;
          }

          // Convertir `undefined` a `null` en el cuerpo
          if (body) {
            body = JSON.parse(JSON.stringify(body, (_, value) => (value === undefined ? null : value)));
          }
        }

        if (method === "GET" || method === "DELETE") {
          response = method === "GET"
            ? await apiClient.get<T>(endpoint, { headers })
            : await apiClient.delete<T>(endpoint, { headers });
        } else {
          response = method === "POST"
            ? await apiClient.post<T>(endpoint, body, { headers })
            : await apiClient.put<T>(endpoint, body, { headers });
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method]
  );

  React.useEffect(() => {
    if (method === "GET") {
      fetchData();
    }
  }, [endpoint, method, fetchData]);

  return [data, loading, error, fetchData];
};


export default useFetch;
