export interface S1Question {
  number: number;
  text: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export const S1_QUESTIONS: S1Question[] = [
  // Q1 — bible_depth (Comprehension) — how you engage the Word
  {
    number: 1,
    text: "When you read the Bible, what's most true about how you engage it?",
    options: [
      { label: 'A', text: "I read it when I need answers or feel off — it's my go-to when life gets hard" },
      { label: 'B', text: "I study it consistently — I want to understand what it actually means, not just what it says" },
      { label: 'C', text: "I mostly hear it through sermons and other people's teaching" },
      { label: 'D', text: "I struggle to stay consistent — I know I should read more than I do" },
    ],
  },
  // Q2 — faithful (Character / FAT) — spiritual discipline honesty
  {
    number: 2,
    text: "Be honest — when life gets busy, what's the first thing that gets cut?",
    options: [
      { label: 'A', text: "Nothing — my time with God is the one thing I protect no matter what" },
      { label: 'B', text: "Prayer and Bible reading — I tell myself I'll catch up later" },
      { label: 'C', text: "Church attendance — I still pray and read at home" },
      { label: 'D', text: "Everything spiritual takes a hit when the pressure is on" },
    ],
  },
  // Q3 — outreach (Competency) — natural witness
  {
    number: 3,
    text: "When you think about sharing your faith with people who don't know God, you feel:",
    options: [
      { label: 'A', text: "Natural — I talk about God the same way I talk about anything else I love" },
      { label: 'B', text: "Willing but unsure — I want to but I don't always know what to say" },
      { label: 'C', text: "Uncomfortable — I'd rather live it out than talk about it" },
      { label: 'D', text: "Like that's the pastor's job — I support from the background" },
    ],
  },
  // Q4 — coaching (Competency) — how you help others grow
  {
    number: 4,
    text: "When you see someone close to you making a decision you know will hurt them, you:",
    options: [
      { label: 'A', text: "Mind your business — people have to learn on their own" },
      { label: 'B', text: "Say something directly because you love them too much to stay quiet" },
      { label: 'C', text: "Ask questions to help them think it through themselves" },
      { label: 'D', text: "Pray for them and wait for the right moment" },
    ],
  },
  // Q5 — time_god (3 T's / Time) — how you seek God
  {
    number: 5,
    text: "When you need to hear from God about something important, what do you actually do?",
    options: [
      { label: 'A', text: "Fast and pray — I pull away from everything until I get clarity" },
      { label: 'B', text: "Talk to my pastor or someone I trust spiritually" },
      { label: 'C', text: "Get in the Word and journal until something speaks to me" },
      { label: 'D', text: "Wait and trust that God will make it clear in His own time" },
    ],
  },
  // Q6 — available (Character / FAT) — how you show up
  {
    number: 6,
    text: "When your church or community needs help and you're already stretched thin, you:",
    options: [
      { label: 'A', text: "Show up anyway — if God called me to this house, I'm available" },
      { label: 'B', text: "Help where I can without overcommitting" },
      { label: 'C', text: "Sit this one out — I can't pour from an empty cup" },
      { label: 'D', text: "Pray about it first before I commit to anything" },
    ],
  },
  // Q7 — bible_depth (Comprehension) — doctrinal confidence
  {
    number: 7,
    text: "Someone challenges something you believe about God or the Bible. How do you handle it?",
    options: [
      { label: 'A', text: "I study it out — I won't defend something I can't back up with Scripture" },
      { label: 'B', text: "I share what I believe and why, even if I can't quote chapter and verse" },
      { label: 'C', text: "I listen and honestly consider whether they might have a point" },
      { label: 'D', text: "I point them to my pastor — that's above my level" },
    ],
  },
  // Q8 — discipleship (Comprehension) — investment in others
  {
    number: 8,
    text: "Right now, are you actively pouring into someone else's spiritual growth?",
    options: [
      { label: 'A', text: "Yes — I'm intentionally walking with someone and tracking their growth" },
      { label: 'B', text: "Informally — I encourage people but it's not structured" },
      { label: 'C', text: "Not yet — I'm still being poured into myself" },
      { label: 'D', text: "I want to but I don't feel equipped enough yet" },
    ],
  },
  // Q9 — treasure (3 T's) — financial stewardship
  {
    number: 9,
    text: "When it comes to money and giving, which is most honest about where you are right now?",
    options: [
      { label: 'A', text: "I tithe consistently — it's the first check I write, not the last" },
      { label: 'B', text: "I give when I can but I'm not consistent about it" },
      { label: 'C', text: "I'm working through financial pressure right now — giving is hard" },
      { label: 'D', text: "I believe in giving but I haven't made it a real discipline yet" },
    ],
  },
  // Q10 — outreach (Competency) — intentional relationships
  {
    number: 10,
    text: "Think about the people in your life who don't know God. What's your honest posture toward them?",
    options: [
      { label: 'A', text: "I'm building real relationships with them — I'm in their world on purpose" },
      { label: 'B', text: "I pray for them but I haven't made a real move toward them" },
      { label: 'C', text: "I invite them to church and hope they come" },
      { label: 'D', text: "Most people in my life are already saved" },
    ],
  },
  // Q11 — faithful (Character / FAT) — follow-through
  {
    number: 11,
    text: "You make a spiritual commitment — a fast, a prayer challenge, a reading plan. What usually happens?",
    options: [
      { label: 'A', text: "I finish what I start — my word to God means something" },
      { label: 'B', text: "I start strong but life usually interrupts before I finish" },
      { label: 'C', text: "I restart when I miss — I don't let one bad day end the whole thing" },
      { label: 'D', text: "I've stopped making big commitments because I don't want to break them" },
    ],
  },
  // Q12 — bible_depth (Comprehension) — Word application
  {
    number: 12,
    text: "When you hear a sermon or read a passage, what do you typically do with it?",
    options: [
      { label: 'A', text: "I study it deeper on my own — I want to understand the full context" },
      { label: 'B', text: "I let it sit with me and apply what stands out" },
      { label: 'C', text: "I share it with someone else — teaching it helps me retain it" },
      { label: 'D', text: "I receive it in the moment but don't always follow through on it" },
    ],
  },
  // Q13 — discipleship (Comprehension) — pastoral instinct
  {
    number: 13,
    text: "Someone you care about is going through something hard and pulling away from God. What do you do?",
    options: [
      { label: 'A', text: "Give them space — pushing people usually makes it worse" },
      { label: 'B', text: "Reach out, sit with them, and stay present even when it's uncomfortable" },
      { label: 'C', text: "Pray for them and trust God to draw them back" },
      { label: 'D', text: "Point them to the pastor or someone more equipped to help" },
    ],
  },
  // Q14 — treasure (3 T's) — time stewardship
  {
    number: 14,
    text: "If someone looked at your calendar for the last 30 days, what would it say about your priorities?",
    options: [
      { label: 'A', text: "God, family, and ministry are clearly at the top — it shows" },
      { label: 'B', text: "Work and responsibilities take most of it — I'm trying to rebalance" },
      { label: 'C', text: "It's scattered — I'm reactive more than intentional" },
      { label: 'D', text: "Honestly, it would show I need to make some changes" },
    ],
  },
  // Q15 — available (Character / FAT) — submission and honor
  {
    number: 15,
    text: "How do you respond when leadership makes a decision you don't agree with?",
    options: [
      { label: 'A', text: "I bring my concerns privately, then fully support the decision once it's made" },
      { label: 'B', text: "I say what I think — I believe in honest communication" },
      { label: 'C', text: "I go along with it but I hold my position internally" },
      { label: 'D', text: "I struggle with this — submission is something I'm still working on" },
    ],
  },
  // Q16 — faithful (Character / FAT) — prayer life honesty
  {
    number: 16,
    text: "How would you honestly describe your prayer life right now?",
    options: [
      { label: 'A', text: "Consistent and structured — I have set times and I keep them" },
      { label: 'B', text: "Active but mostly spontaneous — I pray throughout the day" },
      { label: 'C', text: "Inconsistent — I pray more when things are hard" },
      { label: 'D', text: "Weak right now — I know it needs to grow" },
    ],
  },
  // Q17 — discipleship (Comprehension) — multiplication mindset
  {
    number: 17,
    text: "What do you think is the main job of a mature believer in the church?",
    options: [
      { label: 'A', text: "To serve faithfully in whatever role they're given" },
      { label: 'B', text: "To raise up the next generation — make disciples who make disciples" },
      { label: 'C', text: "To grow personally and keep their own house in order" },
      { label: 'D', text: "To support the vision of the pastor and leadership" },
    ],
  },
  // Q18 — teachable (Character / FAT) — receiving correction
  {
    number: 18,
    text: "When someone you respect points out something in your character that needs to change, your honest first reaction is:",
    options: [
      { label: 'A', text: "Gratitude — I want people in my life who will tell me the truth" },
      { label: 'B', text: "Defensiveness — even if I know they're right" },
      { label: 'C', text: "I receive it in the moment but struggle to actually change" },
      { label: 'D', text: "It depends on who's saying it and how they say it" },
    ],
  },
  // Q19 — outreach (Competency) — evangelism frequency
  {
    number: 19,
    text: "When was the last time you intentionally shared your faith with someone who doesn't know God?",
    options: [
      { label: 'A', text: "This week" },
      { label: 'B', text: "This month" },
      { label: 'C', text: "A few months ago" },
      { label: 'D', text: "Honestly, I'm not sure — it's been a while" },
    ],
  },
  // Q20 — available (Character / FAT) — conflict and accountability
  {
    number: 20,
    text: "When there's tension or conflict in your church or ministry team, what's your natural response?",
    options: [
      { label: 'A', text: "Address it directly — unresolved conflict kills community" },
      { label: 'B', text: "Pray about it and wait for God to resolve it" },
      { label: 'C', text: "Pull back until things settle down" },
      { label: 'D', text: "Try to be a peacemaker and bring both sides together" },
    ],
  },
  // Q21 — time_god (3 T's / Time) — corporate worship and fasting
  {
    number: 21,
    text: "How do you feel about fasting as a spiritual discipline?",
    options: [
      { label: 'A', text: "It's a regular part of my life — I fast with purpose and structure" },
      { label: 'B', text: "I fast when something is urgent but it's not a regular rhythm" },
      { label: 'C', text: "I've tried it but I struggle to complete what I commit to" },
      { label: 'D', text: "I haven't really practiced fasting — it's something I want to grow in" },
    ],
  },
  // Q22 — coaching (Competency) — how you restore people
  {
    number: 22,
    text: "Someone you're close to just made a major mistake — spiritually or personally. How do you show up for them?",
    options: [
      { label: 'A', text: "Give them space to process — they'll come to me when they're ready" },
      { label: 'B', text: "Show up immediately — they need to know they're not alone" },
      { label: 'C', text: "Ask questions to help them find the lesson without making them feel judged" },
      { label: 'D', text: "Share my own story so they know failure isn't the end" },
    ],
  },
  // Q23 — treasure (3 T's) — talent stewardship
  {
    number: 23,
    text: "When you think about the gifts and abilities God has given you, which is most true?",
    options: [
      { label: 'A', text: "I know what they are and I'm actively using them for the Kingdom" },
      { label: 'B', text: "I have a sense of my gifts but I'm not fully walking in them yet" },
      { label: 'C', text: "I'm still figuring out what my gifts actually are" },
      { label: 'D', text: "I've been using my gifts more for myself than for God" },
    ],
  },
  // Q24 — coaching (Competency) — readiness to invest
  {
    number: 24,
    text: "What would it take for you to feel ready to pour into someone else's spiritual growth?",
    options: [
      { label: 'A', text: "I'm already doing it — you don't have to be perfect to pour into people" },
      { label: 'B', text: "More training and knowledge — I want to make sure I'm equipped" },
      { label: 'C', text: "More consistency in my own walk first" },
      { label: 'D', text: "Someone to show me how — I've never been discipled myself" },
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

// ─── SECTION 4: SPIRITUAL GIFTS (Forced-choice pairs) ────────────────────────
// 9 gifts: wisdom(W) knowledge(K) faith(F) healing(H) miracles(M)
//          prophecy(P) discernment(D) tongues(T) interpretation(I)
// 27 pairs — each gift appears 6 times total

export interface S4Question {
  number: number;
  optionA: string;
  giftA: string;
  optionB: string;
  giftB: string;
}

export const S4_QUESTIONS: S4Question[] = [
  { number: 45, giftA: 'wisdom',        optionA: "When people face hard decisions, they naturally come to me for guidance.",         giftB: 'knowledge',     optionB: "I often sense things about a situation or person that I couldn't have known naturally." },
  { number: 46, giftA: 'faith',         optionA: "I believe God for things others think are impossible — and I'm usually right.",    giftB: 'healing',       optionB: "I feel a deep burden to pray for people who are sick, and I've seen God move." },
  { number: 47, giftA: 'miracles',      optionA: "I expect God to show up supernaturally in everyday situations.",                   giftB: 'prophecy',      optionB: "I often receive words, impressions, or pictures from God for people or situations." },
  { number: 48, giftA: 'discernment',   optionA: "I can usually tell when something is spiritually off — even when I can't explain why.", giftB: 'tongues',   optionB: "I have a private prayer language that deepens my intimacy with God." },
  { number: 49, giftA: 'interpretation',optionA: "When someone speaks in tongues, I often sense what God is saying through it.",     giftB: 'wisdom',        optionB: "I can usually see the God-honoring path through a complicated situation." },
  { number: 50, giftA: 'knowledge',     optionA: "Scripture or specific truths come to me in prayer that directly apply to what someone is going through.", giftB: 'faith', optionB: "I rarely doubt that God will come through — even when circumstances say otherwise." },
  { number: 51, giftA: 'healing',       optionA: "I feel called to lay hands on the sick and believe God heals today.",              giftB: 'miracles',      optionB: "I've prayed for situations that seemed impossible and watched God intervene." },
  { number: 52, giftA: 'prophecy',      optionA: "I feel a strong pull to speak God's truth into people's lives — even when it's hard to hear.", giftB: 'discernment', optionB: "I can sense the spiritual atmosphere in a room or situation quickly." },
  { number: 53, giftA: 'tongues',       optionA: "Praying in the Spirit is one of the most powerful parts of my prayer life.",       giftB: 'interpretation',optionB: "I feel responsible to bring clarity when God speaks through spiritual gifts in a gathering." },
  { number: 54, giftA: 'wisdom',        optionA: "I help people see the long-term spiritual consequences of their choices.",          giftB: 'prophecy',      optionB: "I feel an urgency to declare what God is saying to His people right now." },
  { number: 55, giftA: 'knowledge',     optionA: "God reveals specific details to me in prayer that confirm He's speaking.",         giftB: 'discernment',   optionB: "I can tell the difference between what's of God, what's of the flesh, and what's of the enemy." },
  { number: 56, giftA: 'faith',         optionA: "My prayers are bold — I ask for big things and expect God to answer.",             giftB: 'healing',       optionB: "I'm drawn to people who are hurting physically and I believe God wants to heal them." },
  { number: 57, giftA: 'miracles',      optionA: "I pray with expectation that God will do something that defies natural explanation.", giftB: 'tongues',     optionB: "Speaking in tongues builds my faith and keeps me spiritually sharp." },
  { number: 58, giftA: 'interpretation',optionA: "I feel a responsibility to interpret spiritual messages so the church is edified.", giftB: 'wisdom',        optionB: "I'm often the one who brings calm and clarity when a group is confused or divided." },
  { number: 59, giftA: 'prophecy',      optionA: "I've spoken words over people that came to pass or deeply confirmed what God was doing.", giftB: 'knowledge', optionB: "I receive specific information in prayer that I couldn't have known on my own." },
  { number: 60, giftA: 'discernment',   optionA: "I test what I hear — I don't accept everything as from God without checking it.",  giftB: 'faith',         optionB: "I hold on to God's promises even when everything around me says it won't happen." },
  { number: 61, giftA: 'healing',       optionA: "I believe physical healing is part of the Gospel and I pray for it regularly.",    giftB: 'miracles',      optionB: "I've seen God do things in prayer that had no natural explanation." },
  { number: 62, giftA: 'tongues',       optionA: "My prayer life is most alive when I'm praying in the Spirit.",                     giftB: 'prophecy',      optionB: "I feel a burden to speak what God is saying — even when it's not popular." },
  { number: 63, giftA: 'wisdom',        optionA: "People trust me to help them make decisions that align with God's will.",          giftB: 'discernment',   optionB: "I can sense when someone's motives don't match their words." },
  { number: 64, giftA: 'interpretation',optionA: "I feel equipped to bring understanding when God speaks through spiritual gifts.",   giftB: 'knowledge',     optionB: "God gives me insight into people's situations that helps me pray and minister more effectively." },
  { number: 65, giftA: 'faith',         optionA: "I encourage others to trust God for things they've given up on.",                  giftB: 'miracles',      optionB: "I pray expecting God to move in ways that go beyond what's natural." },
  { number: 66, giftA: 'healing',       optionA: "When I pray for healing, I feel a genuine expectation — not just hope.",           giftB: 'discernment',   optionB: "I can sense when something spiritual is happening beneath the surface of a situation." },
  { number: 67, giftA: 'prophecy',      optionA: "I feel a call to speak truth that builds, encourages, and corrects the church.",   giftB: 'interpretation',optionB: "I help bring order and understanding when spiritual gifts are operating." },
  { number: 68, giftA: 'tongues',       optionA: "I use my prayer language to intercede when I don't know how to pray in words.",    giftB: 'wisdom',        optionB: "I can see what others miss — the deeper spiritual principle behind a situation." },
  { number: 69, giftA: 'knowledge',     optionA: "I receive words of knowledge that confirm God's presence and direction.",          giftB: 'faith',         optionB: "I carry a settled confidence that God is working even when I can't see it." },
  { number: 70, giftA: 'miracles',      optionA: "I believe God still parts waters — and I pray like it.",                           giftB: 'healing',       optionB: "I feel a specific anointing to pray for physical and emotional restoration." },
  { number: 71, giftA: 'discernment',   optionA: "I'm often the one who senses when a spiritual door has been opened that shouldn't be.", giftB: 'interpretation', optionB: "I feel called to help the church understand what God is communicating through spiritual gifts." },
];
