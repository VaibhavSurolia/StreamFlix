import { NileServer } from "@niledatabase/server";

export const nile = new NileServer({
  databaseUrl: process.env.POSTGRES_NILEDB_URL,
  apiUrl: process.env.POSTGRES_NILEDB_API_URL,
  user: process.env.POSTGRES_NILEDB_USER,
  password: process.env.POSTGRES_NILEDB_PASSWORD,
  secureCookies: process.env.VERCEL === "1",
});
