import { AuditLog } from '../models/AuditLog.js';

export const logAudit = async ({
  req,
  actor,
  action,
  resource,
  resourceId = '',
  details = {},
  status = 'SUCCESS',
}) => {
  try {
    const user = actor || req?.user;
    const ipAddress =
      req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';

    await AuditLog.create({
      actor: user?._id || user?.id,
      actorName: user?.name || 'System / Guest',
      actorRole: user?.role || 'system',
      action,
      resource,
      resourceId: String(resourceId),
      details,
      ipAddress: String(ipAddress),
      status,
    });
  } catch (error) {
    console.error('[Audit Log Error]:', error.message);
  }
};
