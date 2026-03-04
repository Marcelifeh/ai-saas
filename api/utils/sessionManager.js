// Auth middlewares for Vercel/Express Serverless
const { resolveRequestContext } = require('./contextResolver.js');

/**
 * Universal Auth Wrapper for API routes.
 * Blocks unauthenticated users, resolves the context, and injects it into req.platformContext.
 * 
 * Usage: 
 * export default requireAuth(async function handler(req, res) {
 *    const { user, workspace, usage } = req.platformContext;
 *    ...
 * });
 */
function requireAuth(handler) {
    return async (req, res) => {
        try {
            // Check for OPTIONS or standard Next.js bypasses
            if (req.method === 'OPTIONS') {
                return res.status(200).end();
            }

            const context = await resolveRequestContext(req);

            // Mutate request to pass along the unified state safely down the chain.
            req.platformContext = context;

            return handler(req, res);

        } catch (error) {
            console.error(`[MIDDLEWARE DEADLOCK]`, error.message);
            if (error.message.includes('401')) {
                return res.status(401).json({ success: false, error: 'Unauthorized', code: 401 });
            }
            if (error.message.includes('403')) {
                return res.status(403).json({ success: false, error: 'Forbidden Workspace Binding', code: 403 });
            }
            if (error.message.includes('404')) {
                return res.status(404).json({ success: false, error: 'Identity or Workspace Not Found', code: 404 });
            }

            // 500 fallback
            return res.status(500).json({ success: false, error: error.message || 'Internal Server Auth Error' });
        }
    };
}

module.exports = {
    requireAuth
};
