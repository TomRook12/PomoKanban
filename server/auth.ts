import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { storage } from './storage';
import type { Express, RequestHandler } from 'express';
import connectPg from 'connect-pg-simple';

// Configure session
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Configure Google OAuth strategy
export async function setupAuth(app: Express) {
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Only setup Google OAuth if credentials are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
        },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (!user) {
            // Create new user
            user = await storage.createUser({
              email: profile.emails?.[0]?.value || '',
              name: profile.displayName || '',
              googleId: profile.id,
              profilePicture: profile.photos?.[0]?.value || null,
            });
          } else {
            // Update user info
            await storage.updateUser(user.id, {
              name: profile.displayName || '',
              profilePicture: profile.photos?.[0]?.value || null,
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  } else {
    console.log('Google OAuth credentials not provided. Authentication will be disabled for development.');
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Auth middleware - bypass in development if no Google OAuth
export const requireAuth: RequestHandler = (req, res, next) => {
  // In development without Google OAuth, create a mock user
  if (!process.env.GOOGLE_CLIENT_ID && process.env.NODE_ENV === 'development') {
    if (!req.user) {
      // Create a mock user for development
      req.user = {
        id: 'dev-user-1',
        email: 'dev@example.com',
        name: 'Development User',
        googleId: 'dev-google-id',
        profilePicture: null,
        createdAt: new Date(),
      };
    }
    return next();
  }
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};