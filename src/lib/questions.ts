export interface S1Question {
  number: number;
  text: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export const S1_QUESTIONS: S1Question[] = [
  // Q1 — bible_depth (Comprehension)
  {
    number: 1,
    text: "Someone in your small group asks what a Bible passage means and you're not sure. You:",
    options: [
      { label: 'A', text: "Give your best guess and move on" },
      { label: 'B', text: "Say you're not sure and commit to studying it together before next week" },
      { label: 'C', text: "Change the subject to a passage you know well" },
      { label: 'D', text: "Quote a related verse even though it doesn't directly answer the question" },
    ],
  },
  // Q2 — faithful (Character / FAT)
  {
    number: 2,
    text: "Acts 2:42 says the early church devoted themselves to the apostles' teaching, fellowship, breaking of bread, and prayer. How consistent are your personal spiritual disciplines right now?",
    options: [
      { label: 'A', text: "They are scheduled and protected — I treat them like appointments I don't cancel" },
      { label: 'B', text: "I do them when I feel spiritually motivated" },
      { label: 'C', text: "I try to combine them with other activities to stay consistent" },
      { label: 'D', text: "I'm consistent most weeks but allow flexibility when life gets busy" },
    ],
  },
  // Q3 — outreach (Competency)
  {
    number: 3,
    text: "Acts 2:47 says the Lord added to their number daily. When someone outside the church asks why you live differently, you:",
    options: [
      { label: 'A', text: "Say you just try to stay positive" },
      { label: 'B', text: "Share your faith clearly and invite them into community" },
      { label: 'C', text: "Give a vague spiritual answer so you don't make them uncomfortable" },
      { label: 'D', text: "Tell them you'll share more about it sometime" },
    ],
  },
  // Q4 — coaching (Competency / Teachable)
  {
    number: 4,
    text: "A newer believer you're walking with keeps repeating the same mistake even after you've addressed it. You:",
    options: [
      { label: 'A', text: "Only bring it up again if they ask" },
      { label: 'B', text: "Have a direct, caring conversation about the pattern you're seeing" },
      { label: 'C', text: "Ask questions to help them discover the issue themselves" },
      { label: 'D', text: "Step back and let their primary pastor handle it" },
    ],
  },
  // Q5 — time_god (3 T's / Time)
  {
    number: 5,
    text: "When you feel spiritually dry or unclear about a decision, your first response is:",
    options: [
      { label: 'A', text: "Set aside focused time for fasting and prayer to seek God specifically" },
      { label: 'B', text: "Call your pastor or mentor" },
      { label: 'C', text: "Read the Word more and journal your thoughts" },
      { label: 'D', text: "Wait — God will bring clarity in His own time" },
    ],
  },
  // Q6 — available (Character / FAT)
  {
    number: 6,
    text: "Acts 2:44-45 says they had everything in common and gave to anyone who had need. When your church needs hands for a new initiative, you:",
    options: [
      { label: 'A', text: "Show up when it's convenient and help where it's easy" },
      { label: 'B', text: "Wait to see if the initiative gains traction before committing" },
      { label: 'C', text: "Step in early, take ownership of a role, and bring others with you" },
      { label: 'D', text: "Support through prayer and giving but stay in the background" },
    ],
  },
  // Q7 — bible_depth (Comprehension)
  {
    number: 7,
    text: "Someone challenges a core doctrine of your faith. You:",
    options: [
      { label: 'A', text: "Research it thoroughly in Scripture and trusted commentaries before responding" },
      { label: 'B', text: "Share your general sense of what the Bible seems to say" },
      { label: 'C', text: "Say that's above your level and move on" },
      { label: 'D', text: "Ask someone more knowledgeable and relay their answer" },
    ],
  },
  // Q8 — discipleship (Comprehension)
  {
    number: 8,
    text: "Someone you've been discipling says they feel ready to lead. You:",
    options: [
      { label: 'A', text: "Walk them through a readiness conversation and co-lead with them first" },
      { label: 'B', text: "Encourage them and hand it off immediately" },
      { label: 'C', text: "Tell them to shadow you for a few more months" },
      { label: 'D', text: "Express concern — they need more time in their current role" },
    ],
  },
  // Q9 — treasure (3 T's)
  {
    number: 9,
    text: "Acts 2:45 says they sold possessions and gave to anyone in need. When you receive an unexpected financial blessing, your first instinct is:",
    options: [
      { label: 'A', text: "Plan carefully how to allocate it across giving, savings, and needs" },
      { label: 'B', text: "Give a generous portion and enjoy the rest freely" },
      { label: 'C', text: "Save most of it for future security" },
      { label: 'D', text: "Give it all — trust God completely for your own needs" },
    ],
  },
  // Q10 — outreach (Competency)
  {
    number: 10,
    text: "There are people in your neighborhood or workplace you've never engaged with spiritually. You:",
    options: [
      { label: 'A', text: "Pray for them and wait for a natural opening" },
      { label: 'B', text: "Build relationships intentionally with the goal of sharing your faith" },
      { label: 'C', text: "Invite them to a church event and follow up if they come" },
      { label: 'D', text: "Assume most of them already have a church home" },
    ],
  },
  // Q11 — faithful (Character / FAT)
  {
    number: 11,
    text: "You committed to a 21-day prayer and fasting challenge. On day 8 you miss a day. You:",
    options: [
      { label: 'A', text: "Feel guilty and scale back your commitment" },
      { label: 'B', text: "Acknowledge the miss and keep going without losing momentum" },
      { label: 'C', text: "Restart from day one — consistency means zero misses" },
      { label: 'D', text: "Reevaluate whether the commitment was realistic" },
    ],
  },
  // Q12 — bible_depth (Comprehension)
  {
    number: 12,
    text: "Acts 2:42 says they devoted themselves to the apostles' teaching. How would you describe your current relationship with the Word?",
    options: [
      { label: 'A', text: "I study it deeply — I use commentaries, original language tools, and apply what I learn" },
      { label: 'B', text: "I read it regularly but mostly for personal encouragement" },
      { label: 'C', text: "I read it when I feel I need direction" },
      { label: 'D', text: "I rely mostly on sermons and teaching from others" },
    ],
  },
  // Q13 — discipleship (Comprehension)
  {
    number: 13,
    text: "You're leading a small group and one member is pulling back and disengaging. You:",
    options: [
      { label: 'A', text: "Give them space — they'll come around when they're ready" },
      { label: 'B', text: "Follow up personally, ask what's going on, and create a re-engagement plan" },
      { label: 'C', text: "Ask another group member to check on them" },
      { label: 'D', text: "Remind the group that covenant community requires showing up" },
    ],
  },
  // Q14 — treasure (3 T's)
  {
    number: 14,
    text: "When it comes to your giving to the local church, you:",
    options: [
      { label: 'A', text: "Tithe consistently first, then give offerings beyond that when led" },
      { label: 'B', text: "Give what feels right in the moment" },
      { label: 'C', text: "Give when the church appears to be in financial need" },
      { label: 'D', text: "Give a fixed amount regardless of income changes" },
    ],
  },
  // Q15 — available (Character / FAT)
  {
    number: 15,
    text: "A leader you respect is implementing a plan you disagree with. You:",
    options: [
      { label: 'A', text: "Raise your concerns privately, then fully support the decision once it's made" },
      { label: 'B', text: "Express your disagreement openly in the team meeting" },
      { label: 'C', text: "Go along with it without saying anything" },
      { label: 'D', text: "Do your part but privately hold your position" },
    ],
  },
  // Q16 — faithful (Character / FAT)
  {
    number: 16,
    text: "Acts 2:42 says they devoted themselves to prayer. Which best describes your current prayer life?",
    options: [
      { label: 'A', text: "I pray occasionally when something feels urgent" },
      { label: 'B', text: "Prayer is not my strongest discipline — I rely more on the Word" },
      { label: 'C', text: "I try to pray consistently but often don't complete what I commit to" },
      { label: 'D', text: "Prayer is a structured, daily discipline — I have set times and I keep them" },
    ],
  },
  // Q17 — discipleship (Comprehension)
  {
    number: 17,
    text: "The most important factor in raising up a disciple is:",
    options: [
      { label: 'A', text: "Giving them responsibility and walking alongside them as they learn" },
      { label: 'B', text: "Making sure they've completed all required training" },
      { label: 'C', text: "Waiting for consistent character before investing heavily" },
      { label: 'D', text: "Starting with vision — if they catch it, skills will follow" },
    ],
  },
  // Q18 — teachable (Character / FAT)
  {
    number: 18,
    text: "Your pastor or mentor points out a blind spot in your character. You:",
    options: [
      { label: 'A', text: "Receive it, create an accountability structure, and report back" },
      { label: 'B', text: "Appreciate it but feel it doesn't fully reflect the picture" },
      { label: 'C', text: "Feel defensive internally but say the right thing" },
      { label: 'D', text: "Thank them and adjust gradually over time" },
    ],
  },
  // Q19 — outreach (Competency)
  {
    number: 19,
    text: "The last time you intentionally shared your faith with someone outside the church was:",
    options: [
      { label: 'A', text: "This week" },
      { label: 'B', text: "This month" },
      { label: 'C', text: "A few months ago" },
      { label: 'D', text: "I'm not sure" },
    ],
  },
  // Q20 — available (Character / FAT)
  {
    number: 20,
    text: "Someone on your ministry team is consistently not pulling their weight. You:",
    options: [
      { label: 'A', text: "Absorb the extra work to keep things moving" },
      { label: 'B', text: "Bring it up privately and set clear expectations together" },
      { label: 'C', text: "Address it in front of the team so everyone hears the standard" },
      { label: 'D', text: "Escalate it to leadership immediately" },
    ],
  },
  // Q21 — time_god (3 T's / Time)
  {
    number: 21,
    text: "Acts 2:42 says they devoted themselves to the breaking of bread — corporate worship and communion. When your church calls a corporate fast or prayer gathering, you:",
    options: [
      { label: 'A', text: "Participate if your schedule allows" },
      { label: 'B', text: "Participate fully — corporate agreement carries specific spiritual weight" },
      { label: 'C', text: "Pray intensely at home instead" },
      { label: 'D', text: "Support it spiritually but don't always participate physically" },
    ],
  },
  // Q22 — coaching (Competency)
  {
    number: 22,
    text: "Someone you're discipling just experienced a significant failure. You:",
    options: [
      { label: 'A', text: "Give them space and wait for them to process before engaging" },
      { label: 'B', text: "Step in immediately with correction so they learn quickly" },
      { label: 'C', text: "Ask questions to help them find the lesson themselves, then affirm and redirect" },
      { label: 'D', text: "Share your own failure story so they feel less alone" },
    ],
  },
  // Q23 — treasure (3 T's)
  {
    number: 23,
    text: "Time is your most limited resource. How do you steward it?",
    options: [
      { label: 'A', text: "I schedule in order of Kingdom priority — God, family, ministry, work, rest" },
      { label: 'B', text: "I say yes to the most important things and hope the rest works out" },
      { label: 'C', text: "I let my energy levels guide my capacity each week" },
      { label: 'D', text: "I delegate aggressively so I can focus on high-impact activities" },
    ],
  },
  // Q24 — coaching (Competency)
  {
    number: 24,
    text: "What makes someone ready to disciple others?",
    options: [
      { label: 'A', text: "They've completed all the required church tracks" },
      { label: 'B', text: "They can identify what God is doing in someone and consistently draw it out" },
      { label: 'C', text: "They've been a believer for at least 3 years" },
      { label: 'D', text: "They've been personally discipled and can replicate the process" },
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
