const {CronJob} = require('cron');

class LimitStore {
	constructor({cronPattern = '* * * * *'} = {}) {
		this.cronPattern = cronPattern;
		this.hits = {};

		this.cronJob = new CronJob(this.cronPattern, () => {
			this.hits = {};
		});

		this.cronJob.start();
	}

	newHit(key) {
		const totalHits = (this.hits[key] || 0) + 1;

		this.hits[key] = totalHits;

		return totalHits;
	}
}

LimitStore.getInstance = function ({cronPattern = '* * * * *'}) {
	if (!LimitStore.limitStoreInstance)
		LimitStore.limitStoreInstance = new LimitStore({cronPattern});

	return LimitStore.limitStoreInstance;
};

exports.LimitStore = LimitStore;
