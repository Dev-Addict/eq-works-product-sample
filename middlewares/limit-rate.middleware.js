const {LimitStore} = require('../utils/stores/limit.store');
const {getIp} = require('../utils/get-ip.util');

exports.limitRate = ({cronPattern = '* * * * *', maxRequests = 5} = {}) => {
	const store = new LimitStore({cronPattern});

	return (req, res, next) => {
		const key = getIp(req);

		if (!key) {
			return res.status(400).json({
				message: "couldn't resolve the ip address.",
			});
		}

		if (store.hits[key] >= maxRequests) {
			return res.status(429).json({
				message: 'too many requests in a short period.',
			});
		}

		const totalHits = store.newHit(key);

		res.setHeader('X-RateLimit-Limit', maxRequests);
		res.setHeader('X-RateLimit-Remaining', maxRequests - totalHits);
		res.setHeader('RateLimit-Limit', maxRequests);
		res.setHeader('RateLimit-Remaining', maxRequests - totalHits);

		next();
	};
};
