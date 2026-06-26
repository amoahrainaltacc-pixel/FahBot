import { Message, EmbedBuilder } from "discord.js";
import { getUser, saveUser, getAllUsers, addXp } from "../data/store.js";
import { t } from "../i18n/translations.js";

const CRIME_CD   = 540_000;
const WORK_CD    =  60_000;
const ROB_CD     = 540_000;
const FINDJOB_CD = 3_600_000;
const DAILY_CD   = 86_400_000;
const WEEKLY_CD  = 604_800_000;
const BEG_CD     =  30_000;
const GAMBLE_CD  = 540_000;

const COLORS = {
  gold: 0xf1c40f, green: 0x2ecc71, red: 0xe74c3c, orange: 0xe67e22,
  blue: 0x3498db, purple: 0x9b59b6, dark: 0x2c2f33, teal: 0x1abc9c,
};

const JOBS = [
  { name: "McDonald's Worker",  pay: 120,  emoji: "🍔" },
  { name: "Pizza Delivery Guy", pay: 150,  emoji: "🍕" },
  { name: "Uber Driver",        pay: 200,  emoji: "🚗" },
  { name: "Software Engineer",  pay: 800,  emoji: "💻" },
  { name: "Drug Dealer",        pay: 600,  emoji: "💊" },
  { name: "Streamer",           pay: 350,  emoji: "🎮" },
  { name: "YouTuber",           pay: 400,  emoji: "📹" },
  { name: "Janitor",            pay: 90,   emoji: "🧹" },
  { name: "Bank Robber",        pay: 750,  emoji: "🏦" },
  { name: "Hitman",             pay: 1200, emoji: "🔫" },
  { name: "Plumber",            pay: 300,  emoji: "🪠" },
  { name: "Doctor",             pay: 950,  emoji: "🩺" },
  { name: "Lawyer",             pay: 850,  emoji: "⚖️" },
  { name: "Barista",            pay: 110,  emoji: "☕" },
  { name: "OnlyFans Creator",   pay: 700,  emoji: "📸" },
];

const CRIME_OUTCOMES = [
  { text: "You robbed a convenience store and got away with", emoji: "🔫", min: 100, max: 800 },
  { text: "You sold some sketchy pills and made",             emoji: "💊", min: 50,  max: 400 },
  { text: "You stole a car and sold it for",                  emoji: "🚗", min: 200, max: 1500 },
  { text: "You ran a scam on some old lady and pocketed",     emoji: "🎰", min: 80,  max: 500 },
  { text: "You hacked a small company's account and got",     emoji: "💻", min: 300, max: 2000 },
  { text: "You pickpocketed someone in the subway and found", emoji: "🧤", min: 20,  max: 200 },
  { text: "You forged a check and cashed it for",             emoji: "🏦", min: 150, max: 900 },
];

const CRIME_FAIL = [
  { text: "The cops tackled you outside the store.",     fine: [150, 300] as [number, number] },
  { text: "You got caught slipping. Night in jail.",     fine: [100, 200] as [number, number] },
  { text: "The cop was RIGHT THERE. Red handed.",        fine: [100, 150] as [number, number] },
  { text: "Your getaway driver left without you.",       fine: [200, 400] as [number, number] },
  { text: "Police dog sniffed you out immediately.",     fine: [150, 350] as [number, number] },
];

function fmt(n: number): string { return `$${n.toLocaleString()}`; }

function cdStr(remaining: number): string {
  const s = Math.ceil(remaining / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function cdEmbed(lang: string, cmd: string, remaining: number): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(COLORS.red)
    .setTitle("⏳ Cooldown")
    .setDescription(t(lang).cooldown(cmd, cdStr(remaining)));
}

function errEmbed(desc: string): EmbedBuilder {
  return new EmbedBuilder().setColor(COLORS.red).setDescription(`❌ ${desc}`);
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]!; }

// ─── BALANCE ────────────────────────────────────────────────────────────────
export async function balance(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const bars = Math.floor((u.xp / (u.level * 100)) * 10);
  const xpBar = "█".repeat(bars) + "░".repeat(10 - bars);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle(`💰 ${msg.author.username}'s ${s.balTitle}`)
      .setThumbnail(msg.author.displayAvatarURL())
      .addFields(
        { name: s.wallet,   value: fmt(u.balance), inline: true },
        { name: s.bank,     value: fmt(u.bank),    inline: true },
        { name: s.netWorth, value: fmt(u.balance + u.bank), inline: true },
        { name: `⭐ Level ${u.level}`, value: `\`[${xpBar}]\` ${u.xp}/${u.level * 100} XP`, inline: false },
      )
      .setFooter({ text: `💼 Job: ${u.job ?? "Unemployed"}` }),
  ] });
}

// ─── CRIME ──────────────────────────────────────────────────────────────────
export async function crime(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const now = Date.now();
  const diff = now - u.lastCrime;
  if (diff < CRIME_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "crime", CRIME_CD - diff)] }); return; }

  u.lastCrime = now;

  if (Math.random() < 0.3) {
    const fail = pick(CRIME_FAIL);
    const fine = Math.floor(Math.random() * (fail.fine[1] - fail.fine[0])) + fail.fine[0];
    u.balance = Math.max(0, u.balance - fine);
    saveUser(msg.author.id, u);
    await msg.reply({ embeds: [
      new EmbedBuilder()
        .setColor(COLORS.red)
        .setTitle(`🚔 ${s.crimeCaught}`)
        .setDescription(fail.text)
        .addFields(
          { name: s.crimeFine,   value: fmt(fine),      inline: true },
          { name: s.yourBalance, value: fmt(u.balance),  inline: true },
        ),
    ] });
    return;
  }

  const outcome = pick(CRIME_OUTCOMES);
  const earned = Math.floor(Math.random() * (outcome.max - outcome.min)) + outcome.min;
  u.balance += earned;
  saveUser(msg.author.id, u);
  const xp = addXp(msg.author.id, 25);

  const embed = new EmbedBuilder()
    .setColor(COLORS.orange)
    .setTitle(`${outcome.emoji} ${s.crimeSuccess}`)
    .setDescription(outcome.text)
    .addFields(
      { name: `💰 ${s.crimeEarned}`, value: fmt(earned),    inline: true },
      { name: s.yourBalance,          value: fmt(u.balance), inline: true },
    );
  if (xp.leveledUp) embed.setFooter({ text: s.levelUp(xp.level) });
  await msg.reply({ embeds: [embed] });
}

// ─── WORK ───────────────────────────────────────────────────────────────────
export async function work(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  if (!u.job) { await msg.reply({ embeds: [errEmbed(s.workNoJob)] }); return; }

  const diff = Date.now() - u.lastWork;
  if (diff < WORK_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "work", WORK_CD - diff)] }); return; }

  u.lastWork = Date.now();
  const variance = Math.floor(u.jobPay * 0.2);
  const earned = u.jobPay + Math.floor(Math.random() * variance * 2) - variance;
  u.balance += earned;
  saveUser(msg.author.id, u);
  const xp = addXp(msg.author.id, 15);

  const embed = new EmbedBuilder()
    .setColor(COLORS.blue)
    .setTitle(`💼 ${s.workDone}`)
    .setDescription(`You clocked out from your shift as **${u.job}**.`)
    .addFields(
      { name: s.workEarned,  value: fmt(earned),    inline: true },
      { name: s.yourBalance, value: fmt(u.balance),  inline: true },
    );
  if (xp.leveledUp) embed.setFooter({ text: s.levelUp(xp.level) });
  await msg.reply({ embeds: [embed] });
}

// ─── FINDJOB ────────────────────────────────────────────────────────────────
const pendingJobs = new Map<string, { name: string; pay: number; emoji: string }>();

export async function findjob(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const diff = Date.now() - u.lastFindJob;
  if (diff < FINDJOB_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "findjob", FINDJOB_CD - diff)] }); return; }

  const job = pick(JOBS);
  pendingJobs.set(msg.author.id, job);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.teal)
      .setTitle(`📋 ${s.jobFound}`)
      .addFields(
        { name: s.jobPosition, value: `${job.emoji} **${job.name}**`, inline: true },
        { name: s.jobPay,      value: fmt(job.pay),                   inline: true },
      )
      .setDescription("Do you want to take this job?")
      .setFooter({ text: "Use ,acceptjob or ,rejectjob • expires in 60s" }),
  ] });

  setTimeout(() => { pendingJobs.delete(msg.author.id); }, 60_000);
}

export async function acceptjob(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const pending = pendingJobs.get(msg.author.id);
  if (!pending) { await msg.reply({ embeds: [errEmbed(s.jobNoPending)] }); return; }

  u.job = pending.name;
  u.jobPay = pending.pay;
  u.lastFindJob = Date.now();
  saveUser(msg.author.id, u);
  pendingJobs.delete(msg.author.id);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.green)
      .setTitle(`✅ Hired as ${pending.emoji} ${pending.name}`)
      .setDescription(s.jobAccepted(pending.name)),
  ] });
}

export async function rejectjob(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  if (!pendingJobs.has(msg.author.id)) { await msg.reply({ embeds: [errEmbed(s.jobNoPending)] }); return; }

  u.lastFindJob = Date.now();
  saveUser(msg.author.id, u);
  pendingJobs.delete(msg.author.id);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.red)
      .setTitle("🚫 Job Declined")
      .setDescription(s.jobRejected),
  ] });
}

// ─── ROB ────────────────────────────────────────────────────────────────────
export async function rob(msg: Message, args: string[]): Promise<void> {
  void args;
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const target = msg.mentions.users.first();
  if (!target)             { await msg.reply({ embeds: [errEmbed("Mention someone to rob! `,rob @user`")] }); return; }
  if (target.id === msg.author.id) { await msg.reply({ embeds: [errEmbed(s.cantSelf)] }); return; }
  if (target.bot)          { await msg.reply({ embeds: [errEmbed("You can't rob a bot 💀")] }); return; }

  const diff = Date.now() - u.lastRob;
  if (diff < ROB_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "rob", ROB_CD - diff)] }); return; }

  const victim = getUser(target.id);
  if (victim.balance < 50) {
    await msg.reply({ embeds: [new EmbedBuilder().setColor(COLORS.dark).setDescription(`😂 ${s.robBroke(target.username)}`)] });
    return;
  }

  u.lastRob = Date.now();

  if (Math.random() < 0.35) {
    const fine = Math.floor(Math.random() * 300) + 100;
    u.balance = Math.max(0, u.balance - fine);
    saveUser(msg.author.id, u);
    await msg.reply({ embeds: [
      new EmbedBuilder()
        .setColor(COLORS.red)
        .setTitle("🚔 gng you got caught!")
        .setDescription(s.robCaught(target.username))
        .addFields(
          { name: "Fine Paid",      value: fmt(fine),      inline: true },
          { name: s.yourBalance,    value: fmt(u.balance),  inline: true },
        ),
    ] });
    return;
  }

  const maxRob = Math.max(1, Math.floor(victim.balance * 0.4));
  const stolen = Math.max(1, Math.floor(Math.random() * maxRob) + 1);
  u.balance += stolen;
  victim.balance -= stolen;
  saveUser(msg.author.id, u);
  saveUser(target.id, victim);
  const xp = addXp(msg.author.id, 20);

  const embed = new EmbedBuilder()
    .setColor(COLORS.orange)
    .setTitle("🦹 Successful Robbery")
    .setDescription(s.robSuccess(target.username))
    .addFields(
      { name: s.robStolen,   value: fmt(stolen),    inline: true },
      { name: s.yourBalance, value: fmt(u.balance),  inline: true },
    );
  if (xp.leveledUp) embed.setFooter({ text: s.levelUp(xp.level) });
  await msg.reply({ embeds: [embed] });
}

// ─── LEADERBOARD ────────────────────────────────────────────────────────────
export async function leaderboard(msg: Message): Promise<void> {
  const all = getAllUsers();
  const sorted = [...all.entries()]
    .map(([id, d]) => ({ id, total: d.balance + d.bank }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  if (sorted.length === 0) {
    await msg.reply({ embeds: [new EmbedBuilder().setColor(COLORS.dark).setDescription("📊 No one has any money yet!")] });
    return;
  }

  const medals = ["🥇", "🥈", "🥉"];
  const lines = sorted.map((e, i) => `${medals[i] ?? `**${i + 1}.**`} <@${e.id}> — **${fmt(e.total)}**`);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle("🏆 FahBot Leaderboard")
      .setDescription(lines.join("\n"))
      .setFooter({ text: "Net worth = wallet + bank" }),
  ] });
}

// ─── DEPOSIT / WITHDRAW / PAY ───────────────────────────────────────────────
export async function deposit(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const raw = args[0];
  if (!raw) { await msg.reply({ embeds: [errEmbed("Usage: `,dep <amount|all>`")] }); return; }
  const amount = raw === "all" ? u.balance : parseInt(raw);
  if (isNaN(amount) || amount <= 0) { await msg.reply({ embeds: [errEmbed(s.invalidAmount)] }); return; }
  if (amount > u.balance)            { await msg.reply({ embeds: [errEmbed(s.noMoney)] }); return; }

  u.balance -= amount;
  u.bank    += amount;
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.blue)
      .setTitle(`🏦 ${s.deposited}`)
      .addFields(
        { name: s.deposited,  value: fmt(amount),  inline: true },
        { name: s.bank,       value: fmt(u.bank),  inline: true },
        { name: s.wallet,     value: fmt(u.balance), inline: true },
      ),
  ] });
}

export async function withdraw(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const raw = args[0];
  if (!raw) { await msg.reply({ embeds: [errEmbed("Usage: `,with <amount|all>`")] }); return; }
  const amount = raw === "all" ? u.bank : parseInt(raw);
  if (isNaN(amount) || amount <= 0) { await msg.reply({ embeds: [errEmbed(s.invalidAmount)] }); return; }
  if (amount > u.bank)               { await msg.reply({ embeds: [errEmbed(s.noMoney)] }); return; }

  u.bank    -= amount;
  u.balance += amount;
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.blue)
      .setTitle(`💵 ${s.withdrawn}`)
      .addFields(
        { name: s.withdrawn, value: fmt(amount),   inline: true },
        { name: s.bank,      value: fmt(u.bank),   inline: true },
        { name: s.wallet,    value: fmt(u.balance), inline: true },
      ),
  ] });
}

export async function pay(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const target = msg.mentions.users.first();
  if (!target)                      { await msg.reply({ embeds: [errEmbed("Usage: `,pay @user <amount>`")] }); return; }
  if (target.id === msg.author.id)  { await msg.reply({ embeds: [errEmbed(s.cantSelf)] }); return; }
  const amount = parseInt(args[1] ?? "");
  if (isNaN(amount) || amount <= 0) { await msg.reply({ embeds: [errEmbed(s.invalidAmount)] }); return; }
  if (amount > u.balance)            { await msg.reply({ embeds: [errEmbed(s.noMoney)] }); return; }

  const v = getUser(target.id);
  u.balance -= amount;
  v.balance += amount;
  saveUser(msg.author.id, u);
  saveUser(target.id, v);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.green)
      .setTitle(`✅ ${s.sent}`)
      .addFields(
        { name: s.recipient,  value: target.username, inline: true },
        { name: s.sent,       value: fmt(amount),     inline: true },
        { name: s.yourBalance, value: fmt(u.balance), inline: true },
      ),
  ] });
}

// ─── DAILY / WEEKLY ─────────────────────────────────────────────────────────
export async function daily(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const diff = Date.now() - u.lastDaily;
  if (diff < DAILY_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "daily", DAILY_CD - diff)] }); return; }

  const reward = 500 + u.level * 50;
  u.balance += reward;
  u.lastDaily = Date.now();
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle(`🌅 ${s.dailyClaimed}`)
      .addFields(
        { name: s.reward,      value: fmt(reward),    inline: true },
        { name: s.yourBalance, value: fmt(u.balance), inline: true },
      )
      .setFooter({ text: "Come back tomorrow!" }),
  ] });
}

export async function weekly(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const diff = Date.now() - u.lastWeekly;
  if (diff < WEEKLY_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "weekly", WEEKLY_CD - diff)] }); return; }

  const reward = 5000 + u.level * 200;
  u.balance += reward;
  u.lastWeekly = Date.now();
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle(`📅 ${s.weeklyClaimed}`)
      .addFields(
        { name: s.reward,      value: fmt(reward),    inline: true },
        { name: s.yourBalance, value: fmt(u.balance), inline: true },
      )
      .setFooter({ text: "Come back next week!" }),
  ] });
}

// ─── BEG ────────────────────────────────────────────────────────────────────
const BEG_RESPONSES = [
  { text: "A kind stranger tossed you some change.", amount: true,  min: 5,  max: 50 },
  { text: "Someone felt bad and helped you out.",    amount: true,  min: 1,  max: 30 },
  { text: "You found a coin on the ground.",         amount: true,  min: 1,  max: 10 },
  { text: "Nobody cares. You got nothing.",          amount: false, min: 0,  max: 0  },
  { text: "Someone called you pathetic and left.",   amount: false, min: 0,  max: 0  },
  { text: "A pigeon stole your sign. Nothing.",      amount: false, min: 0,  max: 0  },
];

export async function beg(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const diff = Date.now() - u.lastBeg;
  if (diff < BEG_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "beg", BEG_CD - diff)] }); return; }

  u.lastBeg = Date.now();
  const r = pick(BEG_RESPONSES);

  if (r.amount) {
    const earned = Math.floor(Math.random() * (r.max - r.min)) + r.min;
    u.balance += earned;
    saveUser(msg.author.id, u);
    await msg.reply({ embeds: [
      new EmbedBuilder()
        .setColor(COLORS.teal)
        .setTitle("🙏 Begging Result")
        .setDescription(r.text)
        .addFields({ name: "Received", value: fmt(earned), inline: true }, { name: "Wallet", value: fmt(u.balance), inline: true }),
    ] });
    return;
  }

  saveUser(msg.author.id, u);
  await msg.reply({ embeds: [new EmbedBuilder().setColor(COLORS.dark).setTitle("🙏 Begging Result").setDescription(`😔 ${r.text}`)] });
}

// ─── SLOTS ──────────────────────────────────────────────────────────────────
export async function slots(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const diff = Date.now() - u.lastSlots;
  if (diff < 15_000) { await msg.reply({ embeds: [cdEmbed(u.lang, "slots", 15_000 - diff)] }); return; }

  const bet = parseInt(args[0] ?? "");
  if (isNaN(bet) || bet <= 0)  { await msg.reply({ embeds: [errEmbed("Usage: `,slots <amount>`")] }); return; }
  if (bet > u.balance)          { await msg.reply({ embeds: [errEmbed(t(u.lang).noMoney)] }); return; }

  u.lastSlots = Date.now();
  const symbols = ["🍒","🍋","🍊","🍇","⭐","💎","7️⃣"];
  const r = [pick(symbols), pick(symbols), pick(symbols)];
  u.balance -= bet;

  let winnings = 0; let resultMsg = ""; let color = COLORS.red;

  if (r[0] === r[1] && r[1] === r[2]) {
    if      (r[0] === "💎")  { winnings = bet * 20; resultMsg = "💎 JACKPOT!! DIAMONDS!! 💎"; color = COLORS.gold; }
    else if (r[0] === "7️⃣") { winnings = bet * 15; resultMsg = "7️⃣ TRIPLE SEVENS!! 7️⃣";   color = COLORS.gold; }
    else if (r[0] === "⭐")  { winnings = bet * 10; resultMsg = "⭐ TRIPLE STARS!! ⭐";       color = COLORS.gold; }
    else                      { winnings = bet *  5; resultMsg = "🎰 TRIPLE MATCH!!";          color = COLORS.green; }
  } else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
    winnings = Math.floor(bet * 1.5); resultMsg = "✨ Two of a kind!"; color = COLORS.teal;
  } else {
    resultMsg = "No match. Better luck next time!";
  }

  u.balance += winnings;
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(color)
      .setTitle("🎰 Slot Machine")
      .setDescription(`**| ${r[0]} | ${r[1]} | ${r[2]} |**\n\n${resultMsg}`)
      .addFields(
        { name: winnings > 0 ? "💰 Won" : "💸 Lost", value: winnings > 0 ? fmt(winnings) : fmt(bet), inline: true },
        { name: "👜 Wallet", value: fmt(u.balance), inline: true },
      ),
  ] });
}

// ─── COINFLIP ───────────────────────────────────────────────────────────────
export async function coinflip(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const side = args[0]?.toLowerCase();
  const bet  = parseInt(args[1] ?? "");
  if (!side || !["heads","tails","h","t"].includes(side) || isNaN(bet) || bet <= 0) {
    await msg.reply({ embeds: [errEmbed("Usage: `,cf heads/tails <amount>`")] }); return;
  }
  if (bet > u.balance) { await msg.reply({ embeds: [errEmbed(s.noMoney)] }); return; }

  const flip       = Math.random() < 0.5 ? "heads" : "tails";
  const playerSide = side === "h" ? "heads" : side === "t" ? "tails" : side;
  const won        = playerSide === flip;

  u.balance += won ? bet : -bet;
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(won ? COLORS.green : COLORS.red)
      .setTitle(`🪙 Coin Flip — ${flip.toUpperCase()}`)
      .setDescription(won ? `✅ **You won!** Correct call on **${flip}**.` : `❌ **You lost.** Landed on **${flip}**.`)
      .addFields(
        { name: won ? "💰 Won" : "💸 Lost", value: fmt(bet),       inline: true },
        { name: "👜 Wallet",                 value: fmt(u.balance), inline: true },
      ),
  ] });
}

// ─── FISH ───────────────────────────────────────────────────────────────────
export async function fish(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const diff = Date.now() - u.lastFish;
  if (diff < 45_000) { await msg.reply({ embeds: [cdEmbed(u.lang, "fish", 45_000 - diff)] }); return; }
  u.lastFish = Date.now();

  const catches = [
    { name: "Tuna",              emoji: "🐟", value: 80   },
    { name: "Pufferfish",        emoji: "🐡", value: 120  },
    { name: "Shark",             emoji: "🦈", value: 500  },
    { name: "Clownfish",         emoji: "🐠", value: 60   },
    { name: "Squid",             emoji: "🦑", value: 90   },
    { name: "Old Boot",          emoji: "👟", value: 1    },
    { name: "Trash",             emoji: "🗑️", value: 0   },
    { name: "Diamond Ring",      emoji: "💎", value: 1000 },
    { name: "Dolphin (released)",emoji: "🐬", value: 200  },
  ];

  if (Math.random() < 0.2) {
    saveUser(msg.author.id, u);
    await msg.reply({ embeds: [new EmbedBuilder().setColor(COLORS.dark).setTitle("🎣 Nothing Caught").setDescription("The fish are laughing at you today.")] });
    return;
  }

  const caught = pick(catches);
  u.balance += caught.value;
  saveUser(msg.author.id, u);
  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.teal)
      .setTitle(`🎣 You caught a ${caught.emoji} ${caught.name}!`)
      .addFields({ name: "💰 Sold For", value: fmt(caught.value), inline: true }, { name: "👜 Wallet", value: fmt(u.balance), inline: true }),
  ] });
}

// ─── HUNT ───────────────────────────────────────────────────────────────────
export async function hunt(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const diff = Date.now() - u.lastHunt;
  if (diff < 60_000) { await msg.reply({ embeds: [cdEmbed(u.lang, "hunt", 60_000 - diff)] }); return; }
  u.lastHunt = Date.now();

  const animals = [
    { name: "Rabbit",    emoji: "🐇", value: 50   },
    { name: "Deer",      emoji: "🦌", value: 200  },
    { name: "Wild Boar", emoji: "🐗", value: 150  },
    { name: "Eagle",     emoji: "🦅", value: 300  },
    { name: "Bear",      emoji: "🐻", value: 600  },
    { name: "Lion",      emoji: "🦁", value: 1000 },
    { name: "Fox",       emoji: "🦊", value: 100  },
  ];

  if (Math.random() < 0.25) {
    const lost = Math.floor(Math.random() * 200) + 50;
    u.balance = Math.max(0, u.balance - lost);
    saveUser(msg.author.id, u);
    await msg.reply({ embeds: [
      new EmbedBuilder()
        .setColor(COLORS.red)
        .setTitle("🏹 Hunting Gone Wrong")
        .setDescription("The animal fought back and sent you to the hospital.")
        .addFields({ name: "🏥 Hospital Bill", value: fmt(lost), inline: true }, { name: "👜 Wallet", value: fmt(u.balance), inline: true }),
    ] });
    return;
  }

  const animal = pick(animals);
  u.balance += animal.value;
  saveUser(msg.author.id, u);
  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.green)
      .setTitle(`🏹 Hunted a ${animal.emoji} ${animal.name}!`)
      .addFields({ name: "💰 Sold For", value: fmt(animal.value), inline: true }, { name: "👜 Wallet", value: fmt(u.balance), inline: true }),
  ] });
}

// ─── DIG ────────────────────────────────────────────────────────────────────
export async function dig(msg: Message): Promise<void> {
  const u = getUser(msg.author.id);
  const diff = Date.now() - u.lastDig;
  if (diff < 30_000) { await msg.reply({ embeds: [cdEmbed(u.lang, "dig", 30_000 - diff)] }); return; }
  u.lastDig = Date.now();

  const finds = [
    { name: "Old Coin",    emoji: "🪙", value: 30  },
    { name: "Ring",        emoji: "💍", value: 250 },
    { name: "Gem",         emoji: "💎", value: 500 },
    { name: "Useless Key", emoji: "🗝️", value: 5  },
    { name: "Bone",        emoji: "🦴", value: 1   },
    { name: "Buried Cash", emoji: "💰", value: 800 },
    { name: "A Rock",      emoji: "🪨", value: 0   },
    { name: "Mystery Box", emoji: "📦", value: Math.floor(Math.random() * 1000) },
  ];

  const found = pick(finds);
  u.balance += found.value;
  saveUser(msg.author.id, u);
  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(found.value > 0 ? COLORS.gold : COLORS.dark)
      .setTitle(`⛏️ Found: ${found.emoji} ${found.name}`)
      .addFields({ name: "💰 Worth", value: fmt(found.value), inline: true }, { name: "👜 Wallet", value: fmt(u.balance), inline: true }),
  ] });
}

// ─── GAMBLE ─────────────────────────────────────────────────────────────────
export async function gamble(msg: Message, args: string[]): Promise<void> {
  const u = getUser(msg.author.id);
  const s = t(u.lang);
  const diff = Date.now() - u.lastGamble;
  if (diff < GAMBLE_CD) { await msg.reply({ embeds: [cdEmbed(u.lang, "gamble", GAMBLE_CD - diff)] }); return; }

  const raw = args[0];
  if (!raw) { await msg.reply({ embeds: [errEmbed("Usage: `,gamble <amount|all|half>`")] }); return; }

  let bet: number;
  if      (raw === "all")  bet = u.balance;
  else if (raw === "half") bet = Math.floor(u.balance / 2);
  else                     bet = parseInt(raw);

  if (isNaN(bet) || bet <= 0)  { await msg.reply({ embeds: [errEmbed(s.invalidAmount)] }); return; }
  if (u.balance === 0)          { await msg.reply({ embeds: [errEmbed("You're broke. Nothing to gamble.")] }); return; }
  if (bet > u.balance)          { await msg.reply({ embeds: [errEmbed(s.noMoney)] }); return; }

  u.lastGamble = Date.now();
  u.balance -= bet;

  const roll = Math.random() * 100;
  let returnMultiplier: number; let resultLine: string; let color: number;

  if      (roll < 5)  { returnMultiplier = 10;  resultLine = "🌟 JACKPOT!! 10x!! You hit the rarest roll!"; color = COLORS.gold; }
  else if (roll < 15) { returnMultiplier = 4;   resultLine = "💎 MASSIVE WIN! 4x!";                         color = COLORS.gold; }
  else if (roll < 35) { returnMultiplier = 2;   resultLine = "✅ You doubled it! 2x!";                      color = COLORS.green; }
  else if (roll < 50) { returnMultiplier = 1.5; resultLine = "📈 Small win! 1.5x";                          color = COLORS.teal; }
  else if (roll < 65) { returnMultiplier = 1;   resultLine = "😐 Break even. You got your bet back.";       color = COLORS.dark; }
  else if (roll < 85) { returnMultiplier = 0.5; resultLine = "📉 You lost half your bet.";                  color = COLORS.orange; }
  else                { returnMultiplier = 0;   resultLine = "💀 L. You lost it all.";                      color = COLORS.red; }

  const payout = Math.floor(bet * returnMultiplier);
  const net    = payout - bet;
  u.balance += payout;
  saveUser(msg.author.id, u);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(color)
      .setTitle(`🎲 ${s.gambleResult}`)
      .setDescription(`**${s.gambleBet}:** ${fmt(bet)}\n\n${resultLine}`)
      .addFields(
        { name: net >= 0 ? `💰 ${s.gambleNet} Gain` : `💸 ${s.gambleNet} Loss`, value: fmt(Math.abs(net)), inline: true },
        { name: s.payout,      value: fmt(payout),    inline: true },
        { name: s.yourBalance, value: fmt(u.balance), inline: true },
      ),
  ] });
}

// ─── PROFILE ────────────────────────────────────────────────────────────────
export async function profile(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const u = getUser(target.id);
  const s = t(u.lang);
  const bars  = Math.floor((u.xp / (u.level * 100)) * 10);
  const xpBar = "█".repeat(bars) + "░".repeat(10 - bars);

  await msg.reply({ embeds: [
    new EmbedBuilder()
      .setColor(COLORS.purple)
      .setTitle(`👤 ${target.username}'s Profile`)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: s.wallet,   value: fmt(u.balance), inline: true },
        { name: s.bank,     value: fmt(u.bank),    inline: true },
        { name: s.netWorth, value: fmt(u.balance + u.bank), inline: true },
        { name: `⭐ Level ${u.level}`, value: `\`[${xpBar}]\` ${u.xp}/${u.level * 100} XP`, inline: false },
        { name: "💼 Job", value: u.job ? `${u.job} (${fmt(u.jobPay)}/shift)` : "Unemployed", inline: true },
        { name: "🎒 Inventory", value: `${u.inventory.length} items`, inline: true },
      ),
  ] });
}
