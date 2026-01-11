import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9001/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token as string | null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["File"],
  endpoints: () => ({}),
});
