// src/auth/passportSetup.ts
import passport from "passport";
import type { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { findOrCreateOAuthUser } from "./users";

export function initPassport() {
  passport.serializeUser((user: any, done) => done(null, user._id));

  passport.deserializeUser(async (id: string, done) => {
    // not used with JWT but kept for compatibility
    done(null, { id });
  });

   // GOOGLE STRATEGY (Correct)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: "google",
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });

          return done(null, user);
        } catch (err) {
          return done(err as any);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL!,
      },

      async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        try {
          const user = await findOrCreateOAuthUser({
            provider: "github",
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
          });

          return done(null, user);
        } catch (err) {
          return done(err as any);
        }
      }
    )
  );
}
