import { Client, GatewayIntentBits, Message } from "discord.js";
import { logger } from "../lib/logger.js";

import {
  balance, crime, work, findjob, acceptjob, rejectjob, rob,
  leaderboard, deposit, withdraw, pay, daily, weekly, beg,
  slots, coinflip, fish, hunt, dig, profile, gamble,
} from "./commands/economy.js";

import {
  howgay, ppsize, iq, roast, ship, rps, _8ball, rate, hack,
  wanted, rizz, ratio, sus, simp, clout, vibe, fortune, mock,
  reverse, fight, compliment, color, fact, joke, roll, choose, wyr,
} from "./commands/fun.js";

import { help } from "./commands/help.js";
import { cmdsPanel } from "./commands/panel.js";
import { lang } from "./commands/settings.js";

const PREFIX = ",";

const COMMANDS: Record<string, (msg: Message, args: string[]) => Promise<unknown>> = {
  // Economy — full + shortcuts
  balance,   bal: balance,
  profile,   prof: profile,
  leaderboard, lb: leaderboard,
  deposit,   dep: deposit,
  withdraw,  with: withdraw,   wd: withdraw,
  pay,
  daily,
  weekly,
  // Crime & work — full + shortcuts
  crime,     cr: crime,
  rob,
  beg,
  findjob,   fj: findjob,
  acceptjob, aj: acceptjob,   accept: acceptjob,
  rejectjob, rj: rejectjob,   reject: rejectjob,
  work,      w: work,
  // Games — full + shortcuts
  gamble,    gam: gamble,      g: gamble,
  slots,     slot: slots,
  coinflip,  cf: coinflip,
  rps,
  roll,
  choose,
  // Grind
  fish,
  hunt,
  dig,
  // Fun — full + shortcuts
  howgay,
  ppsize,    pp: ppsize,
  iq,
  roast,
  ship,
  "8ball": _8ball,
  rate,
  hack,
  wanted,
  rizz,
  ratio,
  sus,
  simp,
  clout,
  vibe,
  fortune,
  mock,
  reverse,   rev: reverse,
  fight,
  compliment,
  color,     colour: color,
  fact,
  joke,
  wyr,
  // Settings
  lang,      language: lang,
  // Help / panel
  help,
  cmds: cmdsPanel,  commands: cmdsPanel,  panel: cmdsPanel,
};

export function startBot() {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_TOKEN not set — Discord bot not started.");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  client.once("ready", () => {
    logger.info({ tag: client.user?.tag }, "FahBot is online!");
    client.user?.setActivity("the economy 💰 | ,cmds", { type: 0 });
  });

  client.on("messageCreate", async (msg: Message) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(PREFIX)) return;

    const [rawCmd, ...args] = msg.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = rawCmd.toLowerCase();

    const handler = COMMANDS[cmd];
    if (!handler) return;

    try {
      await handler(msg, args);
    } catch (err) {
      logger.error({ err, cmd }, "Command error");
      msg.reply("❌ Something went wrong. Try again.").catch(() => {});
    }
  });

  client.login(token).catch((err) => {
    logger.error({ err }, "Failed to login to Discord");
  });
}
