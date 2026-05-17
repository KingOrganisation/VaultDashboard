module.exports = async (ctx) => {
  const { joinCount, guild } = ctx;

  if (joinCount > 15) {
    guild.channels.cache.forEach(c => {
      if (c.isTextBased()) {
        c.permissionOverwrites.edit(guild.roles.everyone, {
          SendMessages: false
        });
      }
    });
  }
};