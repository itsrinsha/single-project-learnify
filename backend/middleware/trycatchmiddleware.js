
export const asyncHandler = (fn) => (req, res, next) => {
  try {
    const maybePromise = fn(req, res, next);
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.catch(next);
    }
  } catch (err) {
    next(err);
  }
};