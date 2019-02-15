import { RetryOperation } from './operations';

export class ImageLoader extends RetryOperation {

  /**
   * @param {string} imageUrl
   * @returns {Promise<*>}
   * @private
   */
  async action (imageUrl) {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        return resolve();
      }

      const image = window.Image
        ? new Image()
        : document.createElement( 'img' );

      image.onload = event => resolve( image );
      image.onerror = error => reject( error );

      image.src = imageUrl;
    });
  }
}
