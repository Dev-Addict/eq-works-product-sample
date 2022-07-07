exports.getIp = (req) =>
	req.headers['x-client-ip'] ||
	req.headers['x-forwarded-for'] ||
	req.headers['cf-connecting-ip'] ||
	req.headers['fastly-client-ip'] ||
	req.headers['true-client-ip'] ||
	req.headers['x-real-ip'] ||
	req.headers['x-cluster-client-ip'] ||
	req.headers['x-forwarded'] ||
	req.headers['forwarded-for'] ||
	req.headers['forwarded'] ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress ||
	req.info.remoteAddress ||
	req.ip ||
	req.ips?.[0];
