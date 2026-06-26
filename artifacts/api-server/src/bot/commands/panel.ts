import { Message, EmbedBuilder } from "discord.js";

const COLORS = { gold: 0xf1c40f, orange: 0xe67e22, purple: 0x9b59b6, teal: 0x1abc9c, red: 0xe74c3c, blue: 0x3498db, green: 0x2ecc71 };

interface CommandEntry { cmd: string; short?: string; desc: string; cd?: string }

const SECTIONS: { label: string; color: number; emoji: string; cmds: CommandEntry[] }[] = [
  {
    label: "Economy", color: COLORS.gold, emoji: "💰",
    cmds: [
      { cmd: ",balance", short: ",bal", desc: "Wallet, bank & level" },
      { cmd: ",profile", short: ",prof", desc: "Full stats card" },
      { cmd: ",leaderboard", short: ",lb", desc: "Top 10 richest" },
      { cmd: ",deposit <amt|all>", short: ",dep", desc: "Move money to bank" },
      { cmd: ",withdraw <amt|all>", short: ",with", desc: "Take from bank" },
      { cmd: ",pay @user <amt>", short: ",pay", desc: "Send money to someone" },
      { cmd: ",daily", desc: "Daily reward", cd: "24h" },
      { cmd: ",weekly", desc: "Weekly reward", cd: "7d" },
    ],
  },
  {
    label: "Crime & Work", color: COLORS.orange, emoji: "🦹",
    cmds: [
      { cmd: ",crime", short: ",cr", desc: "Commit a crime", cd: "9m" },
      { cmd: ",rob @user", short: ",rob", desc: "Rob someone", cd: "9m" },
      { cmd: ",beg", desc: "Beg for change", cd: "30s" },
      { cmd: ",findjob", short: ",fj", desc: "Find a job offer", cd: "1h" },
      { cmd: ",acceptjob", short: ",aj", desc: "Accept job offer" },
      { cmd: ",rejectjob", short: ",rj", desc: "Reject job offer" },
      { cmd: ",work", short: ",w", desc: "Work your shift", cd: "1m" },
    ],
  },
  {
    label: "Games", color: COLORS.purple, emoji: "🎮",
    cmds: [
      { cmd: ",gamble <amt|all|half>", short: ",gam", desc: "Risk it all", cd: "9m" },
      { cmd: ",slots <amt>", short: ",slot", desc: "Slot machine", cd: "15s" },
      { cmd: ",cf heads/tails <amt>", short: ",cf", desc: "Coin flip" },
      { cmd: ",rps rock/paper/scissors", desc: "vs the bot" },
      { cmd: ",roll [sides]", desc: "Roll a dice" },
      { cmd: ",choose opt1 | opt2", desc: "Let bot decide" },
    ],
  },
  {
    label: "Grind", color: COLORS.teal, emoji: "🌿",
    cmds: [
      { cmd: ",fish", short: ",fish", desc: "Go fishing", cd: "45s" },
      { cmd: ",hunt", desc: "Go hunting", cd: "1m" },
      { cmd: ",dig", desc: "Dig for treasure", cd: "30s" },
    ],
  },
  {
    label: "Fun", color: COLORS.red, emoji: "😂",
    cmds: [
      { cmd: ",howgay [@user]", desc: "Gay meter" },
      { cmd: ",ppsize [@user]", short: ",pp", desc: "PP size check" },
      { cmd: ",iq [@user]", desc: "IQ test" },
      { cmd: ",roast [@user]", desc: "Roast someone" },
      { cmd: ",ship @u @u", desc: "Compatibility check" },
      { cmd: ",rizz [@user]", desc: "Rizz level" },
      { cmd: ",sus [@user]", desc: "Sussy meter" },
      { cmd: ",simp [@user]", desc: "Simp meter" },
      { cmd: ",clout [@user]", desc: "Clout score" },
      { cmd: ",vibe", desc: "Vibe check" },
      { cmd: ",wanted [@user]", desc: "Wanted poster" },
      { cmd: ",hack [@user]", desc: "Fake hack someone" },
      { cmd: ",fight @user", desc: "Fight someone" },
      { cmd: ",compliment [@user]", desc: "Give a compliment" },
      { cmd: ",ratio [@user]", desc: "Ratio attempt" },
      { cmd: ",fortune", desc: "Fortune cookie" },
      { cmd: ",8ball <question>", desc: "Magic 8-ball" },
      { cmd: ",rate <thing>", desc: "Rate anything" },
      { cmd: ",mock <text>", desc: "SpOnGeBoBiFy text" },
      { cmd: ",reverse <text>", short: ",rev", desc: "Reverse text" },
      { cmd: ",wyr", desc: "Would you rather" },
      { cmd: ",joke", desc: "Random joke" },
      { cmd: ",fact", desc: "Random fact" },
      { cmd: ",color", short: ",colour", desc: "Random color" },
    ],
  },
  {
    label: "Settings", color: COLORS.blue, emoji: "⚙️",
    cmds: [
      { cmd: ",lang <language>", desc: "Change bot language (per user)" },
      { cmd: ",lang list", desc: "See all available languages" },
      { cmd: ",lang current", desc: "Check your current language" },
    ],
  },
];

function buildRow(e: CommandEntry): string {
  const shortTag = e.short ? ` *(or \`${e.short}\`)* ` : " ";
  const cdTag = e.cd ? ` — ⏱ \`${e.cd}\`` : "";
  return `\`${e.cmd}\`${shortTag}— ${e.desc}${cdTag}`;
}

export async function cmdsPanel(msg: Message, args: string[]): Promise<void> {
  const sub = args[0]?.toLowerCase();

  if (sub) {
    const section = SECTIONS.find(s =>
      s.label.toLowerCase().startsWith(sub) || s.emoji === sub
    );
    if (section) {
      const embed = new EmbedBuilder()
        .setColor(section.color)
        .setTitle(`${section.emoji} ${section.label} Commands`)
        .setDescription(section.cmds.map(buildRow).join("\n"))
        .setFooter({ text: "FahBot • prefix: ,  |  Use ,cmds <category> for a category" });
      await msg.reply({ embeds: [embed] });
      return;
    }
  }

  // Overview panel
  const overview = new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle("📋 FahBot — All Commands")
    .setDescription("Use **`,cmds <category>`** to see detailed commands for that section.\n\u200b")
    .addFields(
      SECTIONS.map(s => ({
        name: `${s.emoji} ${s.label}`,
        value: `${s.cmds.length} commands${s.cmds.some(c => c.short) ? " *(shortcuts available)*" : ""}`,
        inline: true,
      }))
    )
    .addFields({
      name: "\u200b",
      value: [
        "**Quick shortcuts:**",
        "`bal` `prof` `lb` `dep` `with` `cr` `w` `fj` `aj` `rj` `gam` `slot` `cf` `pp` `rev`",
      ].join("\n"),
      inline: false,
    })
    .setFooter({ text: "FahBot Money Simulator • prefix: ,  |  e.g. ,dep all  ,with 500  ,cr" });

  await msg.reply({ embeds: [overview] });
}
