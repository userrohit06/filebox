import { api } from "../../../services/api";

interface AuthResponse {
  token: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation<AuthResponse, AuthRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {} = authApi;
