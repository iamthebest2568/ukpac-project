/**
 * Request Logging Middleware
 * Logs detailed information about incoming requests
 */

/**
 * Request logger middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request details
  console.log(`📥 ${req.method} ${req.url}`, {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    origin: req.get('Origin'),
    referer: req.get('Referer')
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    console.log(`📤 ${req.method} ${req.url} - ${res.statusCode}`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      responseSize: JSON.stringify(body).length + ' bytes'
    });

    return originalJson.call(this, body);
  };

  next();
};

module.exports = {
  requestLogger
};
