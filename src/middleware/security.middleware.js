/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import aj from '../config/arcjet.js';
import { slidingWindow } from '@arcjet/node';
import logger from '../config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin access exceeded.';
        break;
      case 'user':
        limit = 10;
        message = 'User access exceeded.';
        break;
      default:
        limit = 5;
        message = 'Guest access exceeded.';
        break;
    }

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );
    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked.', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Automated requests not allowed.' });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request.', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res.status(403).json({ error: 'Forbidden', message: 'Requests blocked by Shield.' });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded.', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
      });
      return res.status(403).json({ error: 'Forbidden', message: 'Rate limit exceeded.' });
    }
    next();
  } catch (e) {
    console.error('Security middleware error:', e);
    res
      .status(500)
      .json({ error: 'Internal Server Error', msg: 'something went wrong with sec middleware' });
  }
};

export default securityMiddleware;
