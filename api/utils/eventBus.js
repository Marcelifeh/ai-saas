const EventEmitter = require('events');

class PlatformEventBus extends EventEmitter {
    constructor() {
        super();
        this.logEvents = process.env.NODE_ENV !== 'production';
    }

    /**
     * Emit a platform lifecycle event securely.
     * @param {string} eventName - Standardized event name (e.g., 'credits.used')
     * @param {object} payload - Action context and relevant state changes
     */
    emitPlatformEvent(eventName, payload) {
        const enrichedPayload = {
            ...payload,
            timestamp: Date.now(),
            _eventId: Math.random().toString(36).substring(2, 9)
        };

        if (this.logEvents) {
            console.log(`[EVENT BUS] 📡 ${eventName} ->`, enrichedPayload._eventId);
        }

        this.emit(eventName, enrichedPayload);
    }
}

// Singleton global instance
const eventBus = new PlatformEventBus();

const PlatformEvents = {
    STRATEGY_GENERATED: 'strategy.generated',
    AUTOPILOT_COMPLETED: 'autopilot.completed',
    CREDITS_USED: 'credits.used',
    DESIGN_PUBLISHED: 'design.published',
    WORKSPACE_SWITCHED: 'workspace.switched'
};

module.exports = {
    eventBus,
    PlatformEvents
};
