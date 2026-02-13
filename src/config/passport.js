import passport from "passport";
import jwtStrategy from "passport-jwt";
import { UsersRepository } from "../repositories/users.repository.js";
import { env } from "./env.js";

const JWTStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;
const usersRepository = new UsersRepository();

export const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: env.jwtSecret
      },
      async (jwtPayload, done) => {
        try {
          const user = await usersRepository.getById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
