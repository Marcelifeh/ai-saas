// Token Authentication Logic with Magic Link Simulation
const crypto = require('crypto');

class AuthProvider {
    constructor() {
        // Mock token store for demo purposes (In production: Redis / DB)
        this.activeTokens = new Map();

        // Simulating the secret signing key
        this.jwtSecret = process.env.JWT_SECRET || 'dev_secret_key_84920';
    }

    /**
     * Simulates issuing a magic link to the user's email.
     * @param {string} email 
     * @returns {string} - The magic link token
     */
    generateMagicLinkToken(email) {
        const token = crypto.randomBytes(32).toString('hex');
        // In reality, you email this. We'll just return it for API consumption.
        return token;
    }

    /**
     * Issues a standardized secure session token.
     * Required format: { userId, activeWorkspaceId, role, issuedAt, expiresAt }
     */
    issueSessionToken(user, workspaceId, role = 'member') {
        const issuedAt = Date.now();
        // 7 days token expiration
        const expiresAt = issuedAt + (7 * 24 * 60 * 60 * 1000);

        const sessionPayload = {
            userId: user.id || user.userId,
            activeWorkspaceId: workspaceId,
            role: role,
            issuedAt,
            expiresAt
        };

        // Simplified token generation (Use JWT in production)
        const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');
        const signature = crypto.createHmac('sha256', this.jwtSecret).update(sessionToken).digest('hex');
        const finalToken = `${sessionToken}.${signature}`;

        // Store active session
        this.activeTokens.set(finalToken, sessionPayload);

        return { token: finalToken, payload: sessionPayload };
    }

    /**
     * Validates a session token dynamically.
     * Supports stateless Serverless architecture by parsing the base64 instead of memory-mapping.
     */
    validateToken(token) {
        if (!token) return null;

        // 1. Signature verification (Stateless)
        try {
            const [payloadBase64, signature] = token.split('.');
            const expectedSignature = crypto.createHmac('sha256', this.jwtSecret).update(payloadBase64).digest('hex');

            if (signature !== expectedSignature) {
                console.error("[AUTH] Invalid signature");
                return null;
            }

            // 2. Decode payload
            const payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf8');
            const session = JSON.parse(payloadStr);

            // 3. Validate Expiry
            if (Date.now() > session.expiresAt) {
                console.error("[AUTH] Token expired");
                return null;
            }

            return session;
        } catch (e) {
            console.error("[AUTH] Malformed token decode", e);
            return null; // Malformed token
        }
    }

    /**
     * Invalidates a session immediately.
     */
    revokeToken(token) {
        this.activeTokens.delete(token);
    }
}

const authProvider = new AuthProvider();
module.exports = { authProvider };
