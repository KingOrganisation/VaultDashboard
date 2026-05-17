const modules = {
  anti_nuke: require("./modules/antiNuke"),
  raid_protection: require("./modules/raidProtection"),
  link_filter: require("./modules/linkFilter"),
  audit_logs: require("./modules/auditLogs")
};

let enabledModules = {};

function setGuildConfig(guildId, config) {
  enabledModules[guildId] = config;
}

function runModule(guildId, name, context) {
  if (!enabledModules[guildId]) return;
  if (!enabledModules[guildId][name]) return;

  if (modules[name]) {
    modules[name](context);
  }
}

module.exports = {
  setGuildConfig,
  runModule
};