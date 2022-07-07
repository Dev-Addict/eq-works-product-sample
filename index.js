const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, './.env'),
});

const express = require('express');
const pg = require('pg');

const {limitRate} = require('./middlewares/limit-rate.middleware');

const app = express();

const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
	pool
		.query(req.sqlQuery)
		.then((r) => {
			return res.json(r.rows || []);
		})
		.catch(next);
};

app.get('/', limitRate(), (req, res) => {
	res.send('Welcome to EQ Works 😎');
});

app.get(
	'/events/hourly',
	limitRate(),
	(req, res, next) => {
		req.sqlQuery = `
        SELECT date, hour, events
        FROM public.hourly_events
        ORDER BY date, hour
            LIMIT 168;
		`;
		return next();
	},
	queryHandler
);

app.get(
	'/events/daily',
	limitRate(),
	(req, res, next) => {
		req.sqlQuery = `
        SELECT date, SUM (events) AS events
        FROM public.hourly_events
        GROUP BY date
        ORDER BY date
            LIMIT 7;
		`;
		return next();
	},
	queryHandler
);

app.get(
	'/stats/hourly',
	limitRate(),
	(req, res, next) => {
		req.sqlQuery = `
        SELECT date, hour, impressions, clicks, revenue
        FROM public.hourly_stats
        ORDER BY date, hour
            LIMIT 168;
		`;
		return next();
	},
	queryHandler
);

app.get(
	'/stats/daily',
	limitRate(),
	(req, res, next) => {
		req.sqlQuery = `
        SELECT date,
            SUM (impressions) AS impressions,
            SUM (clicks) AS clicks,
            SUM (revenue) AS revenue
        FROM public.hourly_stats
        GROUP BY date
        ORDER BY date
            LIMIT 7;
		`;
		return next();
	},
	queryHandler
);

app.get(
	'/poi',
	limitRate(),
	(req, res, next) => {
		req.sqlQuery = `
        SELECT *
        FROM public.poi;
		`;
		return next();
	},
	queryHandler
);

app.listen(process.env.PORT || 5555, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	} else {
		console.log(`Running on ${process.env.PORT || 5555}`);
	}
});

process.on('uncaughtException', (err) => {
	console.log(`Caught exception: ${err}`);
	process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	process.exit(1);
});
