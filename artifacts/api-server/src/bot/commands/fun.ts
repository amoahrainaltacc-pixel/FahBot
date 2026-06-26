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
  pink: 0xff6b9d,
  rainbow: 0xff6bcb,
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function errEmbed(desc: string): EmbedBuilder {
  return new EmbedBuilder().setColor(COLORS.red).setDescription(`❌ ${desc}`);
}

export async function howgay(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const pct = Math.floor(Math.random() * 101);
  const filled = Math.floor(pct / 10);
  const bar = "🟣".repeat(filled) + "⬜".repeat(10 - filled);
  const comments = [
    "certified queer", "straighter than a ruler", "somewhere in the middle",
    "very sus", "absolutely flaming", "not gay at all bro trust",
    "Rainbow Warrior", "suspicious activity detected",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.rainbow)
    .setTitle("🌈 Gay Meter")
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}** is **${pct}% gay**\n\n${bar}\n\n*${pick(comments)}*`);

  await msg.reply({ embeds: [embed] });
}

export async function ppsize(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const size = Math.floor(Math.random() * 21);
  const pp = "8" + "=".repeat(size) + "D";
  const comments = [
    "that's a weapon", "microscopic ngl", "perfectly average",
    "doctors are concerned", "FBI has been notified", "certified monster truck",
    "you could rent that out", "bro has a pinky finger down there", "it has its own zip code",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.pink)
    .setTitle("📏 PP Size Machine")
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: "User", value: target.username, inline: true },
      { name: "Size", value: `${size} inches`, inline: true },
      { name: "PP", value: `\`${pp}\``, inline: false },
    )
    .setFooter({ text: pick(comments) });

  await msg.reply({ embeds: [embed] });
}

export async function iq(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const iqVal = Math.floor(Math.random() * 201);
  const low = pick(["certified NPC", "room temperature IQ", "bro thinks the earth is flat", "couldn't tie their shoes with help"]);
  const mid = pick(["average human being", "passes most tests", "could operate a microwave"]);
  const high = pick(["potential sigma", "reads books for fun", "chess club president", "could cure cancer maybe"]);
  const mega = pick(["galaxy brain", "10 simultaneous chess games", "probably an AI", "actually terrifying"]);
  const comment = iqVal < 70 ? low : iqVal < 110 ? mid : iqVal < 150 ? high : mega;
  const color = iqVal < 70 ? COLORS.red : iqVal < 110 ? COLORS.orange : iqVal < 150 ? COLORS.teal : COLORS.gold;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("🧠 IQ Test Results")
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: "User", value: target.username, inline: true },
      { name: "IQ Score", value: `**${iqVal}**`, inline: true },
    )
    .setFooter({ text: comment });

  await msg.reply({ embeds: [embed] });
}

export async function roast(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const roasts = [
    "so ugly their mom had to tie a steak around their neck to get the dog to play with them.",
    "so dumb they stared at an orange juice carton because it said 'concentrate'.",
    "has a face that could stop a clock.",
    "is the reason they put instructions on shampoo.",
    "so broke they can't even pay attention.",
    "has the personality of a wet sock.",
    "like a software update — nobody asked for them and they ruin everything.",
    "so old their blood type is discontinued.",
    "would be lost without Google Maps in their own house.",
    "proof that evolution can go in reverse.",
    "has a face that launched a thousand ships... into the sunset to get away.",
    "so slow they got lapped by a parked car.",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.orange)
    .setTitle(`🔥 Roasting ${target.username}`)
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}** is ${pick(roasts)}`);

  await msg.reply({ embeds: [embed] });
}

export async function ship(msg: Message, args: string[]): Promise<void> {
  void args;
  const users = [...msg.mentions.users.values()];
  if (users.length < 2) { await msg.reply({ embeds: [errEmbed("Mention 2 people! `,ship @user1 @user2`")] }); return; }
  const [a, b] = users as [typeof users[0], typeof users[0]];
  const pct = Math.floor(Math.random() * 101);
  const hearts = pct >= 80 ? "💘💘💘" : pct >= 50 ? "❤️❤️" : pct >= 30 ? "💔" : "🚫";
  const color = pct >= 70 ? COLORS.pink : pct >= 40 ? COLORS.orange : COLORS.dark;
  const comment =
    pct >= 90 ? "absolute soulmates fr fr" :
    pct >= 70 ? "pretty solid tbh" :
    pct >= 50 ? "it could work with effort" :
    pct >= 30 ? "unlikely but stranger things happened" :
    "zero chemistry. stay away from each other";

  const filled = Math.floor(pct / 10);
  const bar = "❤️".repeat(filled) + "🖤".repeat(10 - filled);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`💞 Ship: ${a.username} & ${b.username}`)
    .setDescription(`${bar}\n\n**${pct}% compatible** ${hearts}\n*${comment}*`);

  await msg.reply({ embeds: [embed] });
}

export async function rps(msg: Message, args: string[]): Promise<void> {
  const choices = ["rock", "paper", "scissors"];
  const emojis: Record<string, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
  const player = args[0]?.toLowerCase() ?? "";
  if (!choices.includes(player)) { await msg.reply({ embeds: [errEmbed("Usage: `,rps rock/paper/scissors`")] }); return; }
  const bot = pick(choices);
  let result: string;
  let color: number;
  if (player === bot) { result = "🤝 It's a tie!"; color = COLORS.dark; }
  else if (
    (player === "rock" && bot === "scissors") ||
    (player === "scissors" && bot === "paper") ||
    (player === "paper" && bot === "rock")
  ) { result = "✅ You win!"; color = COLORS.green; }
  else { result = "❌ You lose!"; color = COLORS.red; }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("✂️ Rock Paper Scissors")
    .addFields(
      { name: "You", value: `${emojis[player]} ${player}`, inline: true },
      { name: "Bot", value: `${emojis[bot]} ${bot}`, inline: true },
      { name: "Result", value: result, inline: false },
    );

  await msg.reply({ embeds: [embed] });
}

export async function _8ball(msg: Message, args: string[]): Promise<void> {
  if (!args.length) { await msg.reply({ embeds: [errEmbed("Ask a question! `,8ball will I be rich?`")] }); return; }
  const question = args.join(" ");
  const answers = [
    { text: "It is certain.", positive: true },
    { text: "Without a doubt.", positive: true },
    { text: "You may rely on it.", positive: true },
    { text: "Yes, definitely.", positive: true },
    { text: "Ask again later.", positive: null },
    { text: "Cannot predict now.", positive: null },
    { text: "Concentrate and ask again.", positive: null },
    { text: "Don't count on it.", positive: false },
    { text: "My reply is no.", positive: false },
    { text: "Very doubtful.", positive: false },
    { text: "Outlook not so good.", positive: false },
  ];
  const answer = pick(answers);
  const color = answer.positive === true ? COLORS.green : answer.positive === false ? COLORS.red : COLORS.dark;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("🎱 Magic 8-Ball")
    .addFields(
      { name: "Question", value: question, inline: false },
      { name: "Answer", value: `**${answer.text}**`, inline: false },
    );

  await msg.reply({ embeds: [embed] });
}

export async function rate(msg: Message, args: string[]): Promise<void> {
  const thing = args.join(" ");
  if (!thing) { await msg.reply({ embeds: [errEmbed("Rate what? `,rate <thing>`")] }); return; }
  const score = Math.floor(Math.random() * 11);
  const comments = ["absolute garbage", "yikes", "meh", "decent", "pretty good", "solid", "great", "amazing", "legendary", "GOATED", "PERFECT"];
  const color = score >= 7 ? COLORS.green : score >= 4 ? COLORS.orange : COLORS.red;
  const stars = "⭐".repeat(score) || "💀";

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("⭐ Rating Machine")
    .addFields(
      { name: "Thing", value: thing, inline: true },
      { name: "Score", value: `**${score}/10**`, inline: true },
      { name: "Stars", value: stars || "none", inline: false },
    )
    .setFooter({ text: comments[score]! });

  await msg.reply({ embeds: [embed] });
}

export async function hack(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const steps = [
    "🖥️ Initializing hack sequence...",
    "🔐 Bypassing firewall...",
    "📡 Accessing mainframe...",
    "💾 Downloading files...",
    "✅ HACK COMPLETE",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.green)
    .setTitle(`💻 Hacking ${target.username}`)
    .setDescription(steps.join("\n"))
    .setFooter({ text: "jk this is fake lol" });

  await msg.reply({ embeds: [embed] });
}

export async function wanted(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const crimes = [
    "tax evasion", "stealing memes", "being too sigma", "eating pizza with a fork",
    "saying 'gif' wrong", "skipping leg day for 3 years", "liking pineapple on pizza",
    "talking during movies", "replying 'k' to a paragraph",
  ];
  const bounty = Math.floor(Math.random() * 900_000) + 100_000;

  const embed = new EmbedBuilder()
    .setColor(COLORS.red)
    .setTitle("🚨 WANTED")
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: "Suspect", value: target.username, inline: true },
      { name: "Bounty", value: `$${bounty.toLocaleString()}`, inline: true },
      { name: "Crime", value: pick(crimes), inline: false },
    )
    .setFooter({ text: "Considered armed and... probably vibing" });

  await msg.reply({ embeds: [embed] });
}

export async function rizz(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const score = Math.floor(Math.random() * 101);
  const tier =
    score >= 90 ? "W Rizz God 👑" :
    score >= 70 ? "High Rizz ✨" :
    score >= 50 ? "Mid Rizz 😐" :
    score >= 30 ? "Low Rizz 😬" :
    "L Rizz — stay home 💀";
  const color = score >= 70 ? COLORS.gold : score >= 40 ? COLORS.orange : COLORS.red;
  const filled = Math.floor(score / 10);
  const bar = "💜".repeat(filled) + "⬛".repeat(10 - filled);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("😏 Rizz Calculator")
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}**\n\n${bar}\n\n**${score}% rizz** — ${tier}`);

  await msg.reply({ embeds: [embed] });
}

export async function ratio(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const outcomes = [
    { text: `**${target.username}** has been ratioed. Absolutely cooked. 💀`, color: COLORS.red },
    { text: `The ratio attempt failed. **${target.username}** is built different. 💪`, color: COLORS.green },
    { text: `It's a tie. Both parties are cringe. 😐`, color: COLORS.dark },
    { text: `**${target.username}** ratio'd themselves somehow. 💀`, color: COLORS.orange },
  ];
  const outcome = pick(outcomes);

  const embed = new EmbedBuilder()
    .setColor(outcome.color)
    .setTitle("📊 Ratio Attempt")
    .setDescription(outcome.text);

  await msg.reply({ embeds: [embed] });
}

export async function sus(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const pct = Math.floor(Math.random() * 101);
  const verdict = pct >= 80 ? "🔴 RED. EJECT IMMEDIATELY." : pct >= 50 ? "🟡 pretty sus ngl" : pct >= 20 ? "🟢 kinda sus" : "✅ not sus at all";
  const color = pct >= 80 ? COLORS.red : pct >= 50 ? COLORS.orange : COLORS.green;
  const filled = Math.floor(pct / 10);
  const bar = "🟥".repeat(filled) + "⬛".repeat(10 - filled);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("📮 Sussy Meter")
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}** is **${pct}% sus**\n\n${bar}\n\n${verdict}`);

  await msg.reply({ embeds: [embed] });
}

export async function simp(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const pct = Math.floor(Math.random() * 101);
  const verdict = pct >= 70 ? "🚨 CERTIFIED SIMP. INTERVENTION NEEDED." : pct >= 40 ? "average levels of simping" : "not a simp. respect.";
  const color = pct >= 70 ? COLORS.red : pct >= 40 ? COLORS.orange : COLORS.green;
  const filled = Math.floor(pct / 10);
  const bar = "💗".repeat(filled) + "🖤".repeat(10 - filled);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("😍 Simp-o-Meter")
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}** is **${pct}% simp**\n\n${bar}\n\n${verdict}`);

  await msg.reply({ embeds: [embed] });
}

export async function clout(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const score = Math.floor(Math.random() * 1_000_001);
  const tier = score > 750_000 ? "🌟 MEGA INFLUENCER" : score > 400_000 ? "📱 Rising Star" : score > 100_000 ? "👤 Local Celebrity" : "💀 Nobody Knows You";
  const color = score > 750_000 ? COLORS.gold : score > 400_000 ? COLORS.purple : score > 100_000 ? COLORS.blue : COLORS.dark;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("☁️ Clout Check")
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: "User", value: target.username, inline: true },
      { name: "Clout Points", value: score.toLocaleString(), inline: true },
      { name: "Tier", value: tier, inline: false },
    );

  await msg.reply({ embeds: [embed] });
}

export async function vibe(msg: Message): Promise<void> {
  const vibes = [
    { text: "immaculate vibes — everyone wants to be around you", color: COLORS.gold },
    { text: "sleepy vibes — you need a nap and some coffee", color: COLORS.dark },
    { text: "chaotic vibes — everyone around you is stressed", color: COLORS.red },
    { text: "glowing vibes — you're literally radiating today", color: COLORS.teal },
    { text: "neutral vibes — existing, nothing more", color: COLORS.dark },
    { text: "ice cold vibes — unbothered, unbothered, unbothered", color: COLORS.blue },
    { text: "good vibes only — suspiciously positive", color: COLORS.green },
    { text: "high energy vibes — did you eat sugar?", color: COLORS.orange },
    { text: "rainy day vibes — brooding and dramatic", color: COLORS.purple },
  ];
  const v = pick(vibes);

  const embed = new EmbedBuilder()
    .setColor(v.color)
    .setTitle("🎵 Vibe Check")
    .setDescription(`You're giving off:\n\n**${v.text}**`);

  await msg.reply({ embeds: [embed] });
}

export async function fortune(msg: Message): Promise<void> {
  const fortunes = [
    "💰 A great windfall of money is coming your way.",
    "⚠️ Beware of the person who replies with 'k'.",
    "🎯 Your next big decision will define your future.",
    "😴 Rest. You're fighting battles in your sleep.",
    "🤝 An unexpected alliance will surprise you.",
    "📱 Stop scrolling. Touch grass. Now.",
    "🧠 Your biggest enemy is your own overthinking.",
    "🌟 Someone is watching you and impressed. Keep going.",
    "💔 Let it go. Whatever it is, let it go.",
    "🍕 Order the pizza. You deserve it.",
    "🚀 The risk you're afraid to take is the one worth taking.",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.purple)
    .setTitle("🔮 Fortune Cookie")
    .setDescription(`*${pick(fortunes)}*`);

  await msg.reply({ embeds: [embed] });
}

export async function mock(msg: Message, args: string[]): Promise<void> {
  const text = args.join(" ");
  if (!text) { await msg.reply({ embeds: [errEmbed("Usage: `,mock <text>`")] }); return; }
  const mocked = text.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");

  const embed = new EmbedBuilder()
    .setColor(COLORS.dark)
    .setTitle("🤡 Mocked")
    .setDescription(mocked);

  await msg.reply({ embeds: [embed] });
}

export async function reverse(msg: Message, args: string[]): Promise<void> {
  const text = args.join(" ");
  if (!text) { await msg.reply({ embeds: [errEmbed("Usage: `,reverse <text>`")] }); return; }

  const embed = new EmbedBuilder()
    .setColor(COLORS.teal)
    .setTitle("🔄 Reversed")
    .setDescription(text.split("").reverse().join(""));

  await msg.reply({ embeds: [embed] });
}

export async function fight(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first();
  if (!target) { await msg.reply({ embeds: [errEmbed("Mention someone to fight! `,fight @user`")] }); return; }
  const winner = Math.random() < 0.5 ? msg.author : target;
  const loser = winner.id === msg.author.id ? target : msg.author;
  const moves = [
    "threw a devastating uppercut", "unleashed a flying kick",
    "used a forbidden technique", "went super saiyan",
    "pulled out a sock", "bit their ankle",
    "did a backflip and punched them",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.red)
    .setTitle(`⚔️ ${msg.author.username} vs ${target.username}`)
    .setDescription(`💥 **${winner.username}** ${pick(moves)} and obliterated **${loser.username}**!`)
    .addFields({ name: "🏆 Winner", value: winner.username, inline: true }, { name: "💀 Loser", value: loser.username, inline: true });

  await msg.reply({ embeds: [embed] });
}

export async function compliment(msg: Message, args: string[]): Promise<void> {
  void args;
  const target = msg.mentions.users.first() ?? msg.author;
  const compliments = [
    "is genuinely one of the most based people in this server.",
    "has a smile that could light up a server.",
    "is lowkey carrying this whole server.",
    "is built different in the best way.",
    "is the reason this server doesn't die.",
    "has main character energy and deserves it.",
    "is a real one. facts.",
    "could talk to anyone and make them feel good.",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.teal)
    .setTitle("💛 Compliment")
    .setThumbnail(target.displayAvatarURL())
    .setDescription(`**${target.username}** ${pick(compliments)}`);

  await msg.reply({ embeds: [embed] });
}

export async function color(msg: Message): Promise<void> {
  const hex = Math.floor(Math.random() * 0xffffff);
  const hexStr = hex.toString(16).padStart(6, "0").toUpperCase();

  const embed = new EmbedBuilder()
    .setColor(hex)
    .setTitle("🎨 Random Color")
    .addFields(
      { name: "Hex", value: `#${hexStr}`, inline: true },
      { name: "RGB", value: `${(hex >> 16) & 0xff}, ${(hex >> 8) & 0xff}, ${hex & 0xff}`, inline: true },
    );

  await msg.reply({ embeds: [embed] });
}

export async function fact(msg: Message): Promise<void> {
  const facts = [
    "A group of flamingos is called a flamboyance.",
    "Honey never expires. Archaeologists found 3000-year-old honey in Egyptian tombs.",
    "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
    "The Eiffel Tower can grow 6 inches in summer due to heat expansion.",
    "A day on Venus is longer than a year on Venus.",
    "Sharks are older than trees.",
    "There are more possible chess games than atoms in the observable universe.",
    "Wombats produce cube-shaped poop.",
    "The average person spends 6 months of their life waiting for red lights.",
    "A bolt of lightning is 5x hotter than the surface of the sun.",
  ];

  const embed = new EmbedBuilder()
    .setColor(COLORS.blue)
    .setTitle("📚 Random Fact")
    .setDescription(pick(facts));

  await msg.reply({ embeds: [embed] });
}

export async function joke(msg: Message): Promise<void> {
  const jokes = [
    ["Why don't scientists trust atoms?", "Because they make up everything."],
    ["I told my wife she was drawing her eyebrows too high.", "She looked surprised."],
    ["Why can't a bicycle stand on its own?", "Because it's two-tired."],
    ["What do you call cheese that isn't yours?", "Nacho cheese."],
    ["I'm reading a book about anti-gravity.", "It's impossible to put down."],
    ["Why did the scarecrow win an award?", "Because he was outstanding in his field."],
    ["What's brown and sticky?", "A stick."],
    ["Why did the math book look so sad?", "Because it had too many problems."],
  ];
  const [setup, punchline] = pick(jokes);

  const embed = new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle("😂 Joke")
    .addFields(
      { name: "Setup", value: setup!, inline: false },
      { name: "Punchline", value: punchline!, inline: false },
    );

  await msg.reply({ embeds: [embed] });
}

export async function roll(msg: Message, args: string[]): Promise<void> {
  const sides = parseInt(args[0] ?? "") || 6;
  if (sides < 2 || sides > 1_000_000) { await msg.reply({ embeds: [errEmbed("Roll between a 2 and 1,000,000 sided die.")] }); return; }
  const result = Math.floor(Math.random() * sides) + 1;
  const pct = result / sides;
  const color = pct >= 0.9 ? COLORS.gold : pct >= 0.5 ? COLORS.green : COLORS.dark;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`🎲 d${sides} Roll`)
    .addFields(
      { name: "Result", value: `**${result}**`, inline: true },
      { name: "Max", value: `${sides}`, inline: true },
    );

  await msg.reply({ embeds: [embed] });
}

export async function choose(msg: Message, args: string[]): Promise<void> {
  const options = args.join(" ").split("|").map(s => s.trim()).filter(Boolean);
  if (options.length < 2) { await msg.reply({ embeds: [errEmbed("Usage: `,choose option1 | option2 | option3`")] }); return; }
  const chosen = pick(options);

  const embed = new EmbedBuilder()
    .setColor(COLORS.purple)
    .setTitle("🤔 FahBot Decides")
    .addFields(
      { name: "Options", value: options.map((o, i) => `${i + 1}. ${o}`).join("\n"), inline: false },
      { name: "✅ Chosen", value: `**${chosen}**`, inline: false },
    );

  await msg.reply({ embeds: [embed] });
}

export async function wyr(msg: Message): Promise<void> {
  const scenarios: [string, string][] = [
    ["have unlimited money but can't spend it on yourself", "have superpowers but only when you're asleep"],
    ["know when you'll die", "know how you'll die"],
    ["always be 10 minutes late", "always be 20 minutes early"],
    ["fight 100 duck-sized horses", "fight 1 horse-sized duck"],
    ["give up the internet forever", "give up eating solid food forever"],
    ["speak every language", "play every instrument"],
    ["have free food forever", "free wifi forever"],
  ];
  const [a, b] = pick(scenarios);

  const embed = new EmbedBuilder()
    .setColor(COLORS.purple)
    .setTitle("🤷 Would You Rather...")
    .addFields(
      { name: "🅰️ Option A", value: a!, inline: false },
      { name: "🅱️ Option B", value: b!, inline: false },
    )
    .setFooter({ text: "React or reply to vote!" });

  await msg.reply({ embeds: [embed] });
}
