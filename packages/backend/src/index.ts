import 'reflect-metadata';

import RedisSession from 'connect-redis';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import redis from 'redis';
import { createConnection } from 'typeorm';

import typeormConfig from './typeorm-config';

dotenv.config();

const redisClient = redis.createClient({
	host: 'redis',
	password: String(process.env.REDIS_PASSWORD),
});
const RedisSessionStore = RedisSession(session);

(async function () {
	try {
		await createConnection(typeormConfig);

		const app = express();

		app.use(
			session({
				store: new RedisSessionStore({ client: redisClient }),
				secret: String(process.env.SESSION_SECRET),
				resave: false,
				saveUninitialized: false,
			}),
		);

		app.get('/', (req, res) => {
			return res.send(req.query);
		});

		app.listen(3000, () => {
			console.log(`Server ready`);
		});
	} catch (e) {
		console.error(e);
	}
})();
