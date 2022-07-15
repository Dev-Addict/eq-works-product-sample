const {LimitStore} = require('../utils/stores/limit.store');
const {getIp} = require('../utils/get-ip.util');

exports.limitRate = ({
	cronPattern = '* * * * *',
	maxRequests = 5,
	Store = LimitStore,
} = {}) => {
	const store = Store.getInstance({cronPattern});

	return (req, res, next) => {
		const key = getIp(req);

		if (!key)
			return res.status(400).json({
				message: "couldn't resolve the ip address.",
			});

		const {totalHits, resetDate} = store.newHit(key);

		if (totalHits > maxRequests) {
			if (req.xhr || req.headers.accept.indexOf('json') > -1)
				return res.status(429).json({
					message: 'too many requests in a short period.',
				});
			else return res.status(429).render('_429', {date: resetDate});
		}

		res.setHeader('X-RateLimit-Limit', maxRequests);
		res.setHeader('X-RateLimit-Remaining', maxRequests - totalHits);
		res.setHeader('RateLimit-Limit', maxRequests);
		res.setHeader('RateLimit-Remaining', maxRequests - totalHits);

		next();
	};
};
