import { EntityCache } from '../../entity-cache';
import { RetryOperation } from './retry-operation';

export class RetryOperationCached extends RetryOperation {

  /**
   * @type {EntityCache}
   * @private
   */
  _cache = null;

  /**
   * @type {number}
   * @private
   */
  _maxCacheSize = 0;

  /**
   * @param {number} maxCacheSize
   */
  constructor (maxCacheSize = 0) {
    super();
    this._initCache( maxCacheSize );
  }

  /**
   * @param {string} operation
   * @param {number} attemptsNumber
   * @param {string} cacheKey
   * @returns {Promise<*>}
   */
  async retry (operation, attemptsNumber = 15, cacheKey = null) {
    cacheKey = cacheKey || operation;

    if (this._cache.hasEntity( cacheKey )) {
      return {
        cached: true,
        cacheKey,
        item: this._cache.getEntity( cacheKey )
      };
    }

    return super.retry( operation, attemptsNumber ).then(item => {
      this._cache.addEntity( cacheKey, item );

      return {
        cached: false,
        cacheKey,
        item
      };
    });
  }

  /**
   * @returns {EntityCache}
   */
  get cache () {
    return this._cache;
  }

  /**
   * @returns {number}
   */
  get maxCacheSize () {
    return this._maxCacheSize;
  }

  /**
   * @returns {number}
   */
  get cacheSize () {
    return this._cache.size;
  }

  /**
   * @param {number} maxCacheSize
   * @private
   */
  _initCache (maxCacheSize) {
    this._maxCacheSize = maxCacheSize;
    this._cache = new EntityCache( maxCacheSize );
  }
}
