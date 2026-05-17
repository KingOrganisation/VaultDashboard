module.exports = (ctx) => {
  const { message } = ctx;

  const bad = ["bit.ly", "grabify", "iplogger"];

  if (bad.some(b => message.content.includes(b))) {
    message.delete().catch(() => {});
  }
};