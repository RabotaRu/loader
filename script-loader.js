import { RetryOperation } from './operations';

export class ScriptLoader extends RetryOperation {

  /**
   * @param {string} resourceUrl
   * @returns {Promise<*>}
   * @private
   */
  async action (resourceUrl) {
    return new Promise((resolve, reject) => {
      const resourceLoader = document.createElement( 'script' );
      resourceLoader.type = 'text/javascript';
      resourceLoader.async = true;

      if (resourceLoader.readyState) {  // IE
        resourceLoader.onreadystatechange = () => {
          if (resourceLoader.readyState === 'loaded' || resourceLoader.readyState === 'complete') {
            resourceLoader.onreadystatechange = null;
            resolve( resourceLoader );
          }
        };
      } else {  // other browsers
        resourceLoader.onload = () => resolve( resourceLoader );
        resourceLoader.onerror = () => reject( resourceLoader );
      }

      resourceLoader.src = resourceUrl;

      document.getElementsByTagName( 'head' )[0].appendChild( resourceLoader );
    });
  }
}
