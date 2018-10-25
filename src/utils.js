/**
 *
 * @param item
 * @returns {*|boolean}
 */
const isObject = item => item && typeof item === 'object';

/**
 *
 * @param item
 * @returns {(*|boolean)|boolean}
 */
const isObjectAndNotArray = item => isObject(item) && !Array.isArray(item);

/**
 * @param obj
 * @param path
 * @returns {*}
 */
const get = (obj, path) => {
  if (typeof path === 'string') {
    return get(obj, path.split('.'));
  }

  return path.reduce((acc, key) => ((acc && acc[key] !== 'undefined') ? acc[key] : undefined), obj);
};

module.exports = {
  isObject,
  isObjectAndNotArray,
  get,
};
