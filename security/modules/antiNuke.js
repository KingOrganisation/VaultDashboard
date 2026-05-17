module.exports = async (ctx) => {
  const { event, guild, executor } = ctx;

  if (event === "ROLE_DELETE") {
    const audit = await guild.fetchAuditLogs({ type: 32 });
    const entry = audit.entries.first();

    if (entry && entry.executor) {
      const member = await guild.members.fetch(entry.executor.id);

      if (member) {
        member.ban({ reason: "AntiNuke: role deletion detected" });
      }
    }
  }
};