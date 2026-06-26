import { Message, EmbedBuilder } from "discord.js";
import { getUser, saveUser } from "../data/store.js";
import { LANG_NAMES, LANG_ALIASES, t } from "../i18n/translations.js";

const COLORS = { gold: 0xf1c40f, red: 0xe74c3c, teal: 0x1abc9c, dark: 0x2c2f33, blue: 0x3498db };

export async function lang(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const input = args[0]?.toLowerCase();

  if (!input || input === "current") {
    const embed = new EmbedBuilder()
      .setColor(COLORS.blue)
      .setTitle("🌐 Language Settings")
      .setDescription(s.langCurrent(LANG_NAMES[u.lang as keyof typeof LANG_NAMES] ?? u.lang))
      .setFooter({ text: "Use ,lang list to see all languages • ,lang <name> to change" });
    await msg.reply({ embeds: [embed] });
    return;
  }

  if (input === "list") {
    const list = Object.entries(LANG_NAMES)
      .map(([code, name]) => `\`${code}\` — ${name}`)
      .join("\n");
    const embed = new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle("🌐 Available Languages")
      .setDescription(list)
      .setFooter({ text: "Use ,lang <code or name> to set your language" });
    await msg.reply({ embeds: [embed] });
    return;
  }

  const resolved = LANG_ALIASES[input];
  if (!resolved) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.red)
      .setDescription(`❌ ${s.langUnknown}`);
    await msg.reply({ embeds: [embed] });
    return;
  }

  u.lang = resolved;
  saveUser(msg.author.id, u);

  const newS = t(resolved);
  const langName = LANG_NAMES[resolved];

  const embed = new EmbedBuilder()
    .setColor(COLORS.teal)
    .setTitle("🌐 Language Updated")
    .setDescription(newS.langSet(langName));

  await msg.reply({ embeds: [embed] });
}
