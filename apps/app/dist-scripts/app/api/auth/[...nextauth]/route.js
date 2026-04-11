"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = exports.authOptions = void 0;
exports.auth = auth;
const next_auth_1 = __importStar(require("next-auth"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const env_1 = require("../../../../env");
exports.authOptions = {
    providers: [
        (0, google_1.default)({
            clientId: env_1.env.GOOGLE_CLIENT_ID || "",
            clientSecret: env_1.env.GOOGLE_CLIENT_SECRET || "",
        }),
        (0, github_1.default)({
            clientId: env_1.env.GITHUB_CLIENT_ID || "",
            clientSecret: env_1.env.GITHUB_CLIENT_SECRET || "",
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                // @ts-expect-error - next-auth default Session type does not declare user.id
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    }
};
function auth() {
    return (0, next_auth_1.getServerSession)(exports.authOptions);
}
const handler = (0, next_auth_1.default)(exports.authOptions);
exports.GET = handler;
exports.POST = handler;
