export interface S1Question {
  number: number;
  text: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export const S1_QUESTIONS: S1Question[] = [
  // Q1 — bible_depth (Comprehension)
  {
    number: 1,
    text: "Someone at Bible study asks you to explain a passage and you don't know it well. What do you do?",
    options: [
      { label: 'A', text: "Give your best guess and keep it moving" },
      { label: 'B', text: "Tell them you're not sure and commit to studying it together before next time" },
      { label: 'C', text: "Redirect to a passage you do know" },
      { label: 'D', text: "Quote something related even if it doesn't really answer the question" },
    ],
  },
  // Q2 — faithful (Character / FAT)
  {
    number: 2,
    text: "Acts 2:42 says the early church devoted themselves to the Word, fellowship, communion, and prayer — every day. How consistent are your personal spiritual disciplines right now?",
    options: [
      { label: 'A', text: "They're on the calendar and I protect them — I don't cancel on God" },
      { label: 'B', text: "I do them when I feel spiritually motivated" },
      { label: 'C', text: "I try to squeeze them in wherever I can" },
      { label: 'D', text: "I'm consistent most of the time but I give myself grace when life gets heavy" },
    ],
  },
  // Q3 — outreach (Competency)
  {
    number: 3,
    text: "Someone at work or in your neighborhood notices something different about you and asks about it. What do you do?",
    options: [
      { label: 'A', text: "Say you just try to stay positive" },
      { label: 'B', text: "Tell them about your faith and invite them to church" },
      { label: 'C', text: "Give a vague spiritual answer so you don't make it awkward" },
      { label: 'D', text: "Tell them you'll share more about it sometime" },
    ],
  },
  // Q4 — coaching (Competency / Teachable)
  {
    number: 4,
    text: "You're walking with a newer believer and they keep making the same mistake even after you've addressed it. What do you do?",
    options: [
      { label: 'A', text: "Only bring it up again if they ask" },
      { label: 'B', text: "Have a direct, caring conversation about the pattern you're seeing" },
      { label: 'C', text: "Ask questions to help them see it themselves" },
      { label: 'D', text: "Step back and let their pastor handle it" },
    ],
  },
  // Q5 — time_god (3 T's / Time)
  {
    number: 5,
    text: "You're spiritually dry and unclear about a decision. What's your first move?",
    options: [
      { label: 'A', text: "Set aside focused time to fast and pray specifically about it" },
      { label: 'B', text: "Call your pastor or a trusted mentor" },
      { label: 'C', text: "Get in the Word and journal until something breaks through" },
      { label: 'D', text: "Wait — God will bring clarity when it's time" },
    ],
  },
  // Q6 — available (Character / FAT)
  {
    number: 6,
    text: "Your church launches something new and needs people to step up. What do you do?",
    options: [
      { label: 'A', text: "Show up when it's convenient and help where it's easy" },
      { label: 'B', text: "Wait to see if it gains traction before committing" },
      { label: 'C', text: "Step in early, take ownership of a role, and bring others with you" },
      { label: 'D', text: "Support through prayer and giving but stay in the background" },
    ],
  },
  // Q7 — bible_depth (Comprehension)
  {
    number: 7,
    text: "Someone challenges a core doctrine of your faith. How do you respond?",
    options: [
      { label: 'A', text: "Study it out in Scripture and trusted sources before responding" },
      { label: 'B', text: "Share your general sense of what the Bible seems to say" },
      { label: 'C', text: "Say that's above your level and move on" },
      { label: 'D', text: "Point them to someone more knowledgeable" },
    ],
  },
  // Q8 — discipleship (Comprehension)
  {
    number: 8,
    text: "Someone you've been pouring into says they feel ready to lead. What do you do?",
    options: [
      { label: 'A', text: "Have a real readiness conversation and co-lead with them first" },
      { label: 'B', text: "Encourage them and hand it off" },
      { label: 'C', text: "Tell them to keep shadowing you a little longer" },
      { label: 'D', text: "Tell them honestly — they're not ready yet" },
    ],
  },
  // Q9 — treasure (3 T's)
  {
    number: 9,
    text: "God blesses you with unexpected money. What's your first instinct?",
    options: [
      { label: 'A', text: "Plan carefully — giving, savings, and needs in that order" },
      { label: 'B', text: "Give a generous portion and enjoy the rest" },
      { label: 'C', text: "Save most of it — you never know what's coming" },
      { label: 'D', text: "Give it all — trust God completely for your own needs" },
    ],
  },
  // Q10 — outreach (Competency)
  {
    number: 10,
    text: "There are people around you — neighbors, coworkers, family — you've never engaged with spiritually. What's your approach?",
    options: [
      { label: 'A', text: "Pray for them and wait for a natural opening" },
      { label: 'B', text: "Build real relationships with the intention of sharing your faith" },
      { label: 'C', text: "Invite them to church and follow up if they come" },
      { label: 'D', text: "Assume most of them already have a church home" },
    ],
  },
  // Q11 — faithful (Character / FAT)
  {
    number: 11,
    text: "You committed to a 21-day fast and prayer challenge. On day 8 you miss a day. What do you do?",
    options: [
      { label: 'A', text: "Feel guilty and scale back your commitment" },
      { label: 'B', text: "Acknowledge the miss and keep going without losing momentum" },
      { label: 'C', text: "Start over from day one — consistency means no misses" },
      { label: 'D', text: "Reevaluate whether the commitment was realistic" },
    ],
  },
  // Q12 — bible_depth (Comprehension)
  {
    number: 12,
    text: "Acts 2:42 says they devoted themselves to the apostles' teaching. How would you honestly describe your relationship with the Word right now?",
    options: [
      { label: 'A', text: "I study it deeply — commentaries, context, application — and I live what I learn" },
      { label: 'B', text: "I read it regularly but mostly for personal encouragement" },
      { label: 'C', text: "I read it when I need direction or feel off" },
      { label: 'D', text: "I rely mostly on sermons and what I hear from others" },
    ],
  },
  // Q13 — discipleship (Comprehension)
  {
    number: 13,
    text: "Someone you're discipling starts pulling back and missing church. What do you do?",
    options: [
      { label: 'A', text: "Give them space — they'll come around when they're ready" },
      { label: 'B', text: "Reach out personally, find out what's going on, and make a plan together" },
      { label: 'C', text: "Ask someone else close to them to check in" },
      { label: 'D', text: "Remind them that covenant community requires showing up" },
    ],
  },
  // Q14 — treasure (3 T's)
  {
    number: 14,
    text: "When it comes to your giving to the local church, which is most true?",
    options: [
      { label: 'A', text: "I tithe first, then give offerings on top of that when I'm led" },
      { label: 'B', text: "I give what feels right in the moment" },
      { label: 'C', text: "I give more when the church seems to be in need" },
      { label: 'D', text: "I give a set amount regardless of what my income does" },
    ],
  },
  // Q15 — available (Character / FAT)
  {
    number: 15,
    text: "A leader you respect makes a decision you disagree with. What do you do?",
    options: [
      { label: 'A', text: "Bring your concerns to them privately, then fully support the decision once it's made" },
      { label: 'B', text: "Say what you think openly in the room" },
      { label: 'C', text: "Go along with it without saying anything" },
      { label: 'D', text: "Do your part but hold your position privately" },
    ],
  },
  // Q16 — faithful (Character / FAT)
  {
    number: 16,
    text: "Acts 2:42 says they devoted themselves to prayer. Be honest — which best describes your prayer life right now?",
    options: [
      { label: 'A', text: "I pray when something urgent comes up" },
      { label: 'B', text: "Prayer isn't my strongest discipline — I lean more on the Word" },
      { label: 'C', text: "I try to be consistent but I don't always follow through on what I commit to" },
      { label: 'D', text: "Prayer is a daily, structured discipline — I have set times and I keep them" },
    ],
  },
  // Q17 — discipleship (Comprehension)
  {
    number: 17,
    text: "What's the most important thing when raising up a disciple?",
    options: [
      { label: 'A', text: "Give them real responsibility and walk alongside them as they grow" },
      { label: 'B', text: "Make sure they've completed all the required training" },
      { label: 'C', text: "Wait for consistent character before investing heavily" },
      { label: 'D', text: "Start with vision — if they catch it, the skills will follow" },
    ],
  },
  // Q18 — teachable (Character / FAT)
  {
    number: 18,
    text: "Your pastor or mentor calls out a blind spot in your character. How do you respond?",
    options: [
      { label: 'A', text: "Receive it, build accountability around it, and report back" },
      { label: 'B', text: "Appreciate it but feel like it doesn't tell the whole story" },
      { label: 'C', text: "Feel defensive on the inside but say the right thing" },
      { label: 'D', text: "Thank them and make gradual adjustments over time" },
    ],
  },
  // Q19 — outreach (Competency)
  {
    number: 19,
    text: "When was the last time you intentionally shared your faith with someone outside the church?",
    options: [
      { label: 'A', text: "This week" },
      { label: 'B', text: "This month" },
      { label: 'C', text: "A few months ago" },
      { label: 'D', text: "Honestly, I'm not sure" },
    ],
  },
  // Q20 — available (Character / FAT)
  {
    number: 20,
    text: "Someone on your ministry team keeps not pulling their weight. What do you do?",
    options: [
      { label: 'A', text: "Pick up the slack yourself to keep things moving" },
      { label: 'B', text: "Pull them aside privately and set clear expectations together" },
      { label: 'C', text: "Address it in front of the team so everyone hears the standard" },
      { label: 'D', text: "Take it straight to leadership" },
    ],
  },
  // Q21 — time_god (3 T's / Time)
  {
    number: 21,
    text: "Your church calls a corporate fast or prayer gathering. What do you do?",
    options: [
      { label: 'A', text: "Participate if my schedule allows" },
      { label: 'B', text: "Participate fully — when the church agrees together in prayer and fasting, something moves" },
      { label: 'C', text: "Pray hard at home instead — same thing" },
      { label: 'D', text: "Support it spiritually but don't always show up physically" },
    ],
  },
  // Q22 — coaching (Competency)
  {
    number: 22,
    text: "Someone you're pouring into just went through a major failure. How do you handle it?",
    options: [
      { label: 'A', text: "Give them space to process before you engage" },
      { label: 'B', text: "Get in there immediately with correction so they learn fast" },
      { label: 'C', text: "Ask questions to help them find the lesson themselves, then affirm and redirect" },
      { label: 'D', text: "Share your own failure story so they don't feel alone" },
    ],
  },
  // Q23 — treasure (3 T's)
  {
    number: 23,
    text: "Time is your most limited resource. How do you steward it?",
    options: [
      { label: 'A', text: "I schedule by Kingdom priority — God, family, ministry, work, rest — in that order" },
      { label: 'B', text: "I say yes to the most important things and trust the rest works out" },
      { label: 'C', text: "I let my energy and capacity guide me week to week" },
      { label: 'D', text: "I delegate hard so I can stay focused on what only I can do" },
    ],
  },
  // Q24 — coaching (Competency)
  {
    number: 24,
    text: "What makes someone ready to disciple others?",
    options: [
      { label: 'A', text: "They've completed all the required church tracks" },
      { label: 'B', text: "They can see what God is doing in someone and consistently draw it out" },
      { label: 'C', text: "They've been saved long enough to have something to give" },
      { label: 'D', text: "They've been discipled themselves and can replicate the process" },
    ],
  },
];

export interface S2Row {
  rowNumber: number;
  lion: string;
  otter: string;
  gr: string;
  beaver: string;
}

export const S2_ROWS: S2Row[] = [
  { rowNumber: 1,  lion: 'Decisive',       otter: 'Enthusiastic',  gr: 'Patient',       beaver: 'Precise'         },
  { rowNumber: 2,  lion: 'Confident',      otter: 'Spontaneous',   gr: 'Loyal',         beaver: 'Systematic'      },
  { rowNumber: 3,  lion: 'Direct',         otter: 'Inspiring',     gr: 'Supportive',    beaver: 'Analytical'      },
  { rowNumber: 4,  lion: 'Bold',           otter: 'Fun-loving',    gr: 'Gentle',        beaver: 'Careful'         },
  { rowNumber: 5,  lion: 'Takes charge',   otter: 'Optimistic',    gr: 'Consistent',    beaver: 'Detail-oriented' },
  { rowNumber: 6,  lion: 'Competitive',    otter: 'Talkative',     gr: 'Compassionate', beaver: 'Thorough'        },
  { rowNumber: 7,  lion: 'Results-driven', otter: 'Creative',      gr: 'Steady',        beaver: 'Quality-focused' },
  { rowNumber: 8,  lion: 'Strong-willed',  otter: 'Lively',        gr: 'Warm',          beaver: 'Reserved'        },
  { rowNumber: 9,  lion: 'Independent',    otter: 'Outgoing',      gr: 'Harmonious',    beaver: 'Accurate'        },
  { rowNumber: 10, lion: 'Determined',     otter: 'Playful',       gr: 'Reliable',      beaver: 'Disciplined'     },
];

export interface S3Question {
  number: number;
  optionA: string;
  optionB: string;
}

export const S3_QUESTIONS: S3Question[] = [
  { number: 25, optionA: "I love receiving notes of affirmation.", optionB: "I love being hugged." },
  { number: 26, optionA: "I love spending quality one-on-one time with people I care about.", optionB: "I feel loved when people help me out." },
  { number: 27, optionA: "Receiving a meaningful gift makes me feel truly loved.", optionB: "I feel most loved when someone speaks well of me." },
  { number: 28, optionA: "I feel cared for when people help me with tasks.", optionB: "A loving touch — a hug or hand on the shoulder — means a lot to me." },
  { number: 29, optionA: "I feel closest to someone after receiving a thoughtful gift.", optionB: "Undivided attention from someone is the deepest expression of love." },
  { number: 30, optionA: "I feel most loved when someone rolls up their sleeves and helps.", optionB: "Receiving a special, unexpected gift speaks volumes to me." },
  { number: 31, optionA: "Kind, affirming words mean more to me than actions.", optionB: "Focused, uninterrupted time means more to me than words." },
  { number: 32, optionA: "Being touched warmly — a hug or pat on the back — tells me I'm loved.", optionB: "A personal, meaningful gift tells me I'm valued." },
  { number: 33, optionA: "Being given someone's full, undivided attention makes me feel deeply loved.", optionB: "Hearing 'I appreciate you' or 'I'm proud of you' goes a long way." },
  { number: 34, optionA: "Specific, sincere compliments are what I treasure most.", optionB: "I feel loved when someone does something helpful without being asked." },
  { number: 35, optionA: "I feel most connected when we're spending time focused on each other.", optionB: "A gentle touch communicates warmth in a way words can't." },
  { number: 36, optionA: "Words of encouragement lift me more than anything else.", optionB: "When someone serves me, I feel deeply loved." },
  { number: 37, optionA: "I feel loved when someone brings me something meaningful.", optionB: "Physical closeness — sitting together, a hand on the shoulder — speaks deeply to me." },
  { number: 38, optionA: "When someone sets aside time specifically for me, I feel most valued.", optionB: "Acts of service — someone helping me — mean more to me than words." },
  { number: 39, optionA: "A well-chosen gift shows someone truly knows me.", optionB: "Hearing genuine affirmation changes how I feel." },
  { number: 40, optionA: "Physical affirmation — a hug, being close — speaks love to me.", optionB: "Being helped or served shows me someone cares." },
  { number: 41, optionA: "Uninterrupted, focused time is what I treasure most in relationships.", optionB: "A meaningful, thoughtful gift stays with me." },
  { number: 42, optionA: "I feel most loved when someone speaks encouraging, specific words over me.", optionB: "Being held or touched warmly communicates love deeply." },
  { number: 43, optionA: "I feel most loved when someone takes something off my plate without being asked.", optionB: "Being together with someone's full attention makes me feel closest." },
  { number: 44, optionA: "A thoughtful gift, even small, tells me I was thought of.", optionB: "When someone helps me practically, I know they love me." },
];
