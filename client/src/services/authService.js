import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

const authService = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080:/api/",
  }),
  endpoints: (builder) => {
    return {
      authLogin: builder.mutation({
        query: (LoginData) => {
          return {
            url: "signin",
            method: "POST",
            body: LoginData,
          };
        },
      }),
    };
  },
});

export default authService;
