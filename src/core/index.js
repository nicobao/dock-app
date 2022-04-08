/**
 * JSON.stringify with error handler
 *
 * @param value
 * @returns {string}
 */
export function getJsonOrError(value) {
  try {
    return JSON.stringify(value);
  } catch (err) {
    return err;
  }
}
