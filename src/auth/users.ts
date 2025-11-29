import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { memoryClient } from "../utils/mongodb.js";

const USERS_COLLECTION = "users";

export async function getUsersCollection() {
  return memoryClient.db.collection(USERS_COLLECTION);
}


// create or ensure user by OAuth profile
export async function findOrCreateOAuthUser({ provider, providerId, email, name, avatar, githubAccessToken, githubUsername }: { provider: string; providerId: string; email?: string | null; name?: string | null; avatar?: string | null; githubAccessToken?: string | null; githubUsername?: string | null }) {
  const users = await getUsersCollection();
  let user = await users.findOne({ [`oauth.${provider}.id`]: providerId });
  if (user) return user;

  let oauthData = {};
  if(provider==='github'){
    oauthData= { id: providerId, email, name, avatar, githubAccessToken, githubUsername };
  } else {
    oauthData= { id: providerId, email, name, avatar };
  }
    

  // if email exists, link provider
  if (email) {
    user = await users.findOne({ email });
    if (user) {
      await users.updateOne({ _id: user._id }, { $set: { [`oauth.${provider}`]: oauthData } });
      return await users.findOne({ _id: user._id });
    }
  }
  const fname = name ? name.split(" ")[0] : null;
  const newUser = {
    _id: uuid(),
    email: email ?? null,
    name: fname ?? null,
    avatar: avatar ?? null,
    oauth: { [provider]: oauthData },
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
