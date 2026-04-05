function canManageWorkspace(member) {
    return member.role === "owner" || member.role === "admin";
}

function canGenerate(member) {
    return member.role === "owner" || member.role === "admin" || member.role === "designer";
}

// Future: viewers can only view results.

module.exports = { canManageWorkspace, canGenerate };
