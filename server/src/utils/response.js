export const successResponse = (data, message = "Success") => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (error, message = "Error") => ({
  success: false,
  message,
  error,
});
