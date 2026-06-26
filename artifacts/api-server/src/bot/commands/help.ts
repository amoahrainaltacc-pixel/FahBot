import { Message, EmbedBuilder } from "discord.js";

const COLORS = {
  gold: 0xf1c40f,
  green: 0x2ecc71,
  red: 0xe74c3c,
  orange: 0xe67e22,
  blue: 0x3498db,
  purple: 0x9b59b6,
  dark: 0x2c2f33,
  teal: 0x1abc9c,
};

const categories: Record<string, { label: string; color: number; emoji: string; commands: string[] }> = {
  economy: {
    label: "Economy",
    color: COLORS.gold,
    emoji: "💰",
    commands: [
      "`,balance` / `,bal` — Wallet, bank & level",
      "`,profile [@user]` — Full stats card",
      "`,daily` — Claim $500+ daily reward",
      "`,weekly` — Claim $5000+ weekly reward",
      "`,deposit <amount|all>` — Move money to bank",
      "`,withdraw <amount|all>` — Take from bank",
      "`,pay @user <amount>` — Send money",
      "`,leaderboard` / `,lb` — Top 10 richest",
    ],
  },
  crime: {
    label: "Crime & Work",
    color: COLORS.orange,
    emoji: "🦹",
    commands: [
      "`,crime` — Commit a crime *(30s cd)*",
      "`,findjob` — Find a job *(1h cd)*",
      "`,acceptjob` — Accept job offer",
      "`,rejectjob` — Decline job offer",
      "`,work` — Work your shift *(1m cd)*",
      "`,rob @user` — Rob someone *(10s cd)*",
      "`,beg` — Beg for change *(30s cd)*",
    ],
  },
  games: {
    label: "Games",
    color: COLORS.purple,
    emoji: "🎮",
    commands: [
      "`,slots <amount>` — Slot machine *(15s cd)*",
      "`,gamble <amount|all|half>` — Risk it all",
      "`,cf heads/tails <amount>` — Coin flip",
      "`,rps rock/paper/scissors` — vs the bot",
      "`,roll [sides]` — Roll a dice",
      "`,choose opt1 | opt2` — Let bot decide",
    ],
  },
  grind: {
    label: "Grind",
    color: COLORS.teal,
    emoji: "🌿",
    commands: [
      "`,fish` — Go fishing *(45s cd)*",
      "`,hunt` — Go hunting *(1m cd)*",
      "`,dig` — Dig for treasure *(30s cd)*",
    ],
  },
  fun: {
    label: "Fun",
    color: COLORS.red,
    emoji: "😂",
    commands: [
      "`,howgay [@user]` — Gay meter",
      "`,ppsize [@user]` — PP size check",
      "`,iq [@user]` — IQ test",
      "`,roast [@user]` — Roast someone",
      "`,ship @u1 @u2` — Compatibility",
      "`,rizz [@user]` — Rizz level",
      "`,sus [@user]` — Sussy meter",
      "`,simp [@user]` — Simp meter",
      "`,clout [@user]` — Clout score",
      "`,vibe` — Vibe check",
      "`,wanted [@user]` — Wanted poster",
      "`,hack [@user]` — Fake hack",
      "`,fight @user` — Fight someone",
      "`,compliment [@user]` — Compliment",
      "`,ratio [@user]` — Ratio attempt",
      "`,fortune` — Fortune cookie",
      "`,8ball <question>` — Magic 8-ball",
      "`,rate <thing>` — Rate anything",
      "`,mock <text>` — SpOnGeBoBiFy",
      "`,reverse <text>` — Reverse text",
      "`,wyr` — Would you rather",
      "`,joke` — Random joke",
      "`,fact` — Random fact",
      "`,color` — Random color",
    ],
  },
};

export async function help(msg: Message, args: string[]): Promise<void> {
  const sub = args[0]?.toLowerCase();

  if (sub && categories[sub]) {
    const cat = categories[sub]!;
    const embed = new EmbedBuilder()
      .setColor(cat.color)
      .setTitle(`${cat.emoji} ${cat.label} Commands`)
      .setDescription(cat.commands.join("\n"))
      .setFooter({ text: "FahBot • prefix: ," });
    await msg.reply({ embeds: [embed] });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle("🤖 FahBot — Command List")
    .setDescription("Use `,help <category>` for detailed command info.\nPrefix: **`,`**")
    .addFields(
      Object.values(categories).map(cat => ({
        name: `${cat.emoji} ${cat.label}`,
        value: `${cat.commands.length} commands`,
        inline: true,
      }))
    )
    .addFields({ name: "📖 Examples", value: "`,help economy`  `,help fun`  `,help games`", inline: false })
    .setFooter({ text: "FahBot Money Simulator • made with ❤️" });

  await msg.reply({ embeds: [embed] });
}
