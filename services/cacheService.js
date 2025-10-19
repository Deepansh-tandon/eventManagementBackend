// Simple in-memory cache using Map for super fast lookups
class CacheService {
	constructor() {
		this.cache = new Map(); 
		this.ttl = 5 * 60 * 1000; 
	}

	// Save something to cache
	set(key, value) {
		this.cache.set(key, {
			value,
			timestamp: Date.now()
		});
	}

	// Retrieve from cache if it exists and isn't expired
	get(key) {
		const cached = this.cache.get(key);
		if (!cached) return null;

		// Too old? Delete it and return null
		if (Date.now() - cached.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}

		return cached.value;
	}

	// Remove a specific cache entry
	invalidate(key) {
		this.cache.delete(key);
	}

	// Remove all cache entries that match a pattern (e.g., "events:")
	invalidatePattern(pattern) {
		for (const key of this.cache.keys()) {
			if (key.startsWith(pattern)) {
				this.cache.delete(key);
			}
		}
	}

	// Wipe everything from cache
	clear() {
		this.cache.clear();
	}
}

module.exports = new CacheService();

