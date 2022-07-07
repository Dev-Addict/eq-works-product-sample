class LimitStore {
	constructor({duration = 60000} = {}) {
		this.duration = duration;
		this.hits = {};
	}

	newHit(key) {
		const totalHits = (this.hits[key] || 0) + 1;

		this.hits[key] = totalHits;

		setTimeout(() => {
			this.hits[key] = (this.hits[key] || 1) - 1;
		}, this.duration);

		return totalHits;
	}
}

exports.LimitStore = LimitStore;
