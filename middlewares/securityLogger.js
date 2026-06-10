function logSecurityEvent(eventData) {
    const log = {
        timestamp: new Date().toISOString(),
        level: eventData.level || "INFO",
        event: eventData.event || "UNKNOWN_EVENT",
        username: eventData.username || "unknown",
        ip: eventData.ip || "unknown",
        userAgent: eventData.userAgent || "unknown",
        details: eventData.details || "-"
    };

    console.log(JSON.stringify(log, null, 2));
}

module.exports = {
    logSecurityEvent
};