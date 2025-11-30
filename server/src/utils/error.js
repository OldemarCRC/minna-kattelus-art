export const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  err.statusCode = status;
  Error.captureStackTrace(err, createError);
  return err;
};