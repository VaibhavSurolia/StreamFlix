import { nile } from "../lib/nile.js";

export async function getUsers(req, res) {
  const users = await nile.db("users").select("*");
  res.json(users);
}
