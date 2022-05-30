import session from 'express-session';
import MySQLStore from 'express-mysql-session';

const sessionStoreOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}
  
const sessionStore = new MySQLStore(sessionStoreOptions);
  
const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  cookie: {
    // (days * hours * minutes * seconds * milliseconds)
    maxAge: (7 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'strict',
  },
  saveUninitialized: false,
  resave: false,
  unset: 'destroy'
})

export default sessionMiddleware;