import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { memoryClient } from "../utils/mongodb.js";

const USERS_COLLECTION = "users";

export async function getUsersCollection() {
  return memoryClient.db.collection(USERS_COLLECTION);
}




// create or ensure user by OAuth profile
export async function findOrCreateOAuthUser({ provider, providerId, email, name, avatar }: { provider: string; providerId: string; email?: string | null; name?: string | null; avatar?: string | null }) {
  const users = await getUsersCollection();
  let user = await users.findOne({ [`oauth.${provider}.id`]: providerId });
  if (user) return user;

  // if email exists, link provider
  if (email) {
    user = await users.findOne({ email });
    if (user) {
      await users.updateOne({ _id: user._id }, { $set: { [`oauth.${provider}`]: { id: providerId, email, name, avatar } } });
      return await users.findOne({ _id: user._id });
    }
  }

  const newUser = {
    _id: uuid(),
    email: email ?? null,
    name: name ?? null,
    avatar: avatar ?? null,
    oauth: { [provider]: { id: providerId, email, name, avatar } },
    projects: [], // user projects
    createdAt: new Date(),
  };

  await users.insertOne(newUser);
  return newUser;
}

export async function createLocalUser({ email, password, name }: { email: string; password: string; name?: string | null }) {
  const users = await getUsersCollection();
  const existing = await users.findOne({ email });
  if (existing) throw new Error("User already exists");
  const hash = await bcrypt.hash(password, 10);
  const user = {
    _id: uuid(),
    email,
    name: name ?? null,
    passwordHash: hash,
    oauth: {},
    projects: [],
    createdAt: new Date(),
  };
  await users.insertOne(user);
  return user;
}

export async function verifyLocalUser({ email, password }: { email: string; password: string }) {
  const users = await getUsersCollection();
  const user = await users.findOne({ email });
  if (!user || !user.passwordHash) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function findUserById(id: string) {
  const users = await getUsersCollection();
  return users.findOne({ _id: id });
}
