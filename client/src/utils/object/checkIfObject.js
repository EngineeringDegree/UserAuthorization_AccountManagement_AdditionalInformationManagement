/**
 * Checks if object is empty.
 * @param {object} obj to run check
 * @returns if object is empty - true, else false
 */
export const checkIfEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype
}