import { clampNumber } from '../../helpers';

const delay = delayMs => new Promise(resolve => setTimeout(resolve, delayMs));

let OPERATION_ID = 1;

export class RetryOperation {

  /**
   * @type {number}
   * @private
   */
  _id = OPERATION_ID++;

  /**
   * @abstract
   * @param {Function} operation
   * @return {Promise<*>}
   * @private
   */
  async action (operation, attempt) {
    return Promise.resolve().then(_ => {
      return operation && operation( attempt );
    });
  }

  /**
   * @param {*} operation
   * @param {number} attemptsNumber
   * @returns {Promise<*>}
   */
  async retry (operation, attemptsNumber = 15) {
    return this._retryUntil(attempt => this.action( operation, attempt ), attemptsNumber);
  }

  /**
   * @returns {number}
   */
  get id () {
    return this._id;
  }

  /**
   * @param {function} asyncAction
   * @param {number} maxAttemptsNumber
   * @returns {Promise<*>}
   * @private
   */
  async _retryUntil (asyncAction, maxAttemptsNumber) {
    maxAttemptsNumber = clampNumber( maxAttemptsNumber, 1 );

    let attempts = 0;

    while (attempts < maxAttemptsNumber) {
      try {
        const result = await asyncAction( attempts ); // split by variable to prevent unhandled errors
        return result;
      } catch (e) {
        console.error( '[RetryOperation]', e );
        attempts++;
        await delay(25 * Math.min(10, attempts) ** 2 + 500);
      }
    }

    throw new Error( 'Retry operation failed' );
  }
}
