export interface S1Question {
  number: number;
  text: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export const S1_QUESTIONS: S1Question[] = [
  {
    number: 1,
    text: "Your small group leader asks about a Bible passage you don't know well. You:",
    options: [
      { label: 'A', text: "Say you'll look it up later and give your best guess now" },
      { label: 'B', text: "Acknowledge you're unsure and suggest studying it together using a commentary" },
      { label: 'C', text: "Change the subject to something you know well" },
      { label: 'D', text: "Quote a related verse even though it doesn't directly answer the question" },
    ],
  },
  {
    number: 2,
    text: "Life gets busy with work, family, and church. When it comes to your daily spiritual disciplines, you:",
    options: [
      { label: 'A', text: "Protect them like non-negotiable appointments — they are scheduled and kept" },
      { label: 'B', text: "Do them when you feel spiritually motivated" },
      { label: 'C', text: "Combine them with other activities (prayer during commute, etc.)" },
      { label: 'D', text: "Prioritize them most weeks but allow flexibility" },
    ],
  },
  {
    number: 3,
    text: "A coworker asks why you seem at peace during stressful situations. You:",
    options: [
      { label: 'A', text: "Say \"I just try to stay positive\"" },
      { label: 'B', text: "Share openly about your faith and invite them to church" },
      { label: 'C', text: "Give a vague spiritual response so you don't make them uncomfortable" },
      { label: 'D', text: "Say you'll tell them more about it sometime soon" },
    ],
  },
  {
    number: 4,
    text: "A newer believer in your group keeps making the same spiritual mistake despite correction. You:",
    options: [
      { label: 'A', text: "Bring it up only if they ask again" },
      { label: 'B', text: "Have a caring but direct conversation about what you're observing" },
      { label: 'C', text: "Ask questions to help them discover the issue themselves" },
      { label: 'D', text: "Step back and let their primary mentor handle it" },
    ],
  },
  {
    number: 5,
    text: "When you feel spiritually dull or unclear about a decision, your first response is:",
    options: [
      { label: 'A', text: "Set aside time for fasting and concentrated prayer to seek God" },
      { label: 'B', text: "Talk to your pastor or mentor" },
      { label: 'C', text: "Read the Bible more and journal your thoughts" },
      { label: 'D', text: "Give it time and trust God will bring clarity on His own" },
    ],
  },
  {
    number: 6,
    text: "When your church launches a new initiative needing volunteer support, you:",
    options: [
      { label: 'A', text: "Show up when you can and contribute where it's easy" },
      { label: 'B', text: "Wait to see if the initiative gains traction before committing" },
      { label: 'C', text: "Step in early, take ownership of a role, and recruit others alongside you" },
      { label: 'D', text: "Support from the background through prayer and giving" },
    ],
  },
  {
    number: 7,
    text: "You encounter a difficult theological question you haven't studied. You:",
    options: [
      { label: 'A', text: "Research it thoroughly using Scripture and trusted commentaries before responding" },
      { label: 'B', text: "Give your general sense of what the Bible seems to say" },
      { label: 'C', text: "Say \"that's above my pay grade\" and move on" },
      { label: 'D', text: "Ask someone more knowledgeable and relay their answer" },
    ],
  },
  {
    number: 8,
    text: "Someone you've been investing in spiritually tells you they feel ready to lead a small group. You:",
    options: [
      { label: 'A', text: "Walk them through a readiness conversation and co-lead with them first" },
      { label: 'B', text: "Encourage them immediately and hand it off" },
      { label: 'C', text: "Tell them to shadow you for a few more months" },
      { label: 'D', text: "Express concern and ask them to stay in their current role longer" },
    ],
  },
  {
    number: 9,
    text: "You receive an unexpected financial blessing. Your instinct is to:",
    options: [
      { label: 'A', text: "Plan carefully how to allocate it across giving, savings, and needs" },
      { label: 'B', text: "Give a generous portion and enjoy the rest freely" },
      { label: 'C', text: "Save most of it for future financial security" },
      { label: 'D', text: "Give it all away — trust God completely for your own needs" },
    ],
  },
  {
    number: 10,
    text: "Your neighborhood or workplace has people you've never engaged with spiritually. You:",
    options: [
      { label: 'A', text: "Pray for them and wait for a natural opening" },
      { label: 'B', text: "Start relationships intentionally with the goal of eventually sharing your faith" },
      { label: 'C', text: "Invite them to a church event and follow up if they come" },
      { label: 'D', text: "Assume most of them already have a church home" },
    ],
  },
  {
    number: 11,
    text: "You've committed to a 30-day prayer challenge. By day 10, you miss a day. You:",
    options: [
      { label: 'A', text: "Feel guilty and scale back your commitment" },
      { label: 'B', text: "Acknowledge the miss and continue without losing momentum" },
      { label: 'C', text: "Restart from day one — consistency means zero misses" },
      { label: 'D', text: "Reevaluate whether the commitment was realistic" },
    ],
  },
  {
    number: 12,
    text: "A friend challenges a core doctrine of your faith. You:",
    options: [
      { label: 'A', text: "Present a clear, scripturally grounded response with multiple references" },
      { label: 'B', text: "Share your personal testimony of how this doctrine changed your life" },
      { label: 'C', text: "Ask what they believe and listen first before responding" },
      { label: 'D', text: "Suggest they talk to your pastor" },
    ],
  },
  {
    number: 13,
    text: "You're leading a small group and one member is pulling back and disengaging. You:",
    options: [
      { label: 'A', text: "Give them space — they'll come around when they're ready" },
      { label: 'B', text: "Follow up personally, ask what's going on, and create a re-engagement plan" },
      { label: 'C', text: "Ask another group member to check on them" },
      { label: 'D', text: "Remind the group that community requires showing up" },
    ],
  },
  {
    number: 14,
    text: "When it comes to your giving to the church, you:",
    options: [
      { label: 'A', text: "Tithe consistently first, then give offerings beyond that when led" },
      { label: 'B', text: "Give what feels right in the moment" },
      { label: 'C', text: "Give when the church appears to be in financial need" },
      { label: 'D', text: "Give a fixed amount regardless of income changes" },
    ],
  },
  {
    number: 15,
    text: "A team leader you respect is implementing a plan you disagree with. You:",
    options: [
      { label: 'A', text: "Raise your concerns privately, then support the decision fully once it's made" },
      { label: 'B', text: "Express your disagreement openly in the team meeting" },
      { label: 'C', text: "Go along with it without saying anything" },
      { label: 'D', text: "Do your part but privately hold your position" },
    ],
  },
  {
    number: 16,
    text: "Which best describes your current relationship with fasting?",
    options: [
      { label: 'A', text: "I fast occasionally when something feels spiritually wrong" },
      { label: 'B', text: "I rarely fast — my prayer life feels sufficient" },
      { label: 'C', text: "I try to fast but usually don't complete my commitments" },
      { label: 'D', text: "Fasting is a regular, structured discipline in my spiritual rhythm" },
    ],
  },
  {
    number: 17,
    text: "The most important factor in raising a leader is:",
    options: [
      { label: 'A', text: "Giving them responsibility and letting them learn alongside you" },
      { label: 'B', text: "Making sure they've completed all required training modules" },
      { label: 'C', text: "Waiting for consistent character before investing heavily" },
      { label: 'D', text: "Starting with vision — if they catch it, skills will follow" },
    ],
  },
  {
    number: 18,
    text: "A mentor reviews your spiritual disciplines and notes inconsistency. You:",
    options: [
      { label: 'A', text: "Receive the feedback, create an accountability structure, and report back" },
      { label: 'B', text: "Appreciate it but feel it doesn't fully reflect the picture" },
      { label: 'C', text: "Feel defensive internally but say the right thing" },
      { label: 'D', text: "Thank them and adjust gradually over time" },
    ],
  },
  {
    number: 19,
    text: "The last time you shared your faith with someone outside the church was:",
    options: [
      { label: 'A', text: "This week" },
      { label: 'B', text: "This month" },
      { label: 'C', text: "A few months ago" },
      { label: 'D', text: "I'm not sure" },
    ],
  },
  {
    number: 20,
    text: "Someone on your team is consistently not pulling their weight. You:",
    options: [
      { label: 'A', text: "Absorb the extra work to keep things moving" },
      { label: 'B', text: "Bring it up privately and set clear expectations together" },
      { label: 'C', text: "Address it in front of the team so expectations are clear for everyone" },
      { label: 'D', text: "Elevate it to leadership immediately" },
    ],
  },
  {
    number: 21,
    text: "When the church calls a corporate fast, you:",
    options: [
      { label: 'A', text: "Participate if your schedule allows" },
      { label: 'B', text: "Participate fully — corporate agreement in fasting carries specific power" },
      { label: 'C', text: "Pray intensely instead since fasting isn't your primary discipline" },
      { label: 'D', text: "Support it spiritually but don't always participate physically" },
    ],
  },
  {
    number: 22,
    text: "You're mentoring someone who just experienced a significant failure. You:",
    options: [
      { label: 'A', text: "Give them space and wait for them to process before engaging" },
      { label: 'B', text: "Step in immediately with correction so they learn quickly" },
      { label: 'C', text: "Ask questions to help them find the lesson themselves, then affirm and redirect" },
      { label: 'D', text: "Share your own failure story so they feel less alone" },
    ],
  },
  {
    number: 23,
    text: "Your time is your most limited resource. You protect it by:",
    options: [
      { label: 'A', text: "Scheduling commitments in order of priority — Kingdom, family, work, rest" },
      { label: 'B', text: "Saying yes to the most important things and hoping the rest works out" },
      { label: 'C', text: "Letting your energy levels guide your capacity each week" },
      { label: 'D', text: "Delegating aggressively so you can focus on high-impact activities" },
    ],
  },
  {
    number: 24,
    text: "What makes someone ready to mentor others?",
    options: [
      { label: 'A', text: "They've completed all the required church tracks" },
      { label: 'B', text: "They can identify what God is doing in someone else and draw it out consistently" },
      { label: 'C', text: "They've been a believer for at least 3 years" },
      { label: 'D', text: "They've been personally mentored and can replicate the process" },
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
