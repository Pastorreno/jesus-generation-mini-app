// ─── SECTION 1: SPIRITUAL MATURITY INDEX (Likert 1-5) ────────────────────────
// Scale: 1=Never  2=Rarely  3=Sometimes  4=Often  5=Always
// 40 items across 12 constructs — built on Acts 2:42-47, Great Commission,
// Great Commandment, Acts 1:8 — COGIC/Pentecostal/Apostolic voice

export interface S1LikertItem {
  number: number;
  text: string;
  construct: string;
  reverse?: boolean; // true = high score means low trait (scored inverted)
}

export const S1_ITEMS: S1LikertItem[] = [
  // FAITHFUL (1-4) — Acts 2:42 "devoted themselves"
  { number: 1,  construct: 'faithful',    text: "Even when life is hard, I still show up for God — I don't disappear when things get heavy." },
  { number: 2,  construct: 'faithful',    text: "I have a real prayer life — not just crisis prayers, but regular time I give to God." },
  { number: 3,  construct: 'faithful',    text: "When I make a commitment to God — a fast, a reading plan, a promise — I follow through." },
  { number: 4,  construct: 'faithful',    reverse: true, text: "There are seasons where I completely fall off spiritually and it takes a long time to get back." },

  // AVAILABLE (5-8) — Acts 2:44-45
  { number: 5,  construct: 'available',   text: "I show up for my church and my people — not just when it's easy, but when it costs me something." },
  { number: 6,  construct: 'available',   text: "I'm the kind of person people can count on — if I say I'll be there, I'm there." },
  { number: 7,  construct: 'available',   reverse: true, text: "I tend to stay on the sidelines — I watch more than I participate." },
  { number: 8,  construct: 'available',   text: "Even when I'm tired or stretched thin, I still make myself available to serve." },

  // TEACHABLE (9-12) — Acts 2:42 "apostles' teaching"
  { number: 9,  construct: 'teachable',   text: "When someone I trust tells me something hard about myself, I can receive it without shutting down." },
  { number: 10, construct: 'teachable',   text: "I'm willing to be wrong — I don't have to be right to feel secure." },
  { number: 11, construct: 'teachable',   reverse: true, text: "I struggle to take correction from people — even when I know they're right." },
  { number: 12, construct: 'teachable',   text: "I'm still learning — I don't act like I've arrived or already know everything." },

  // WORD DEPTH (13-16) — Acts 2:42 "devoted to the apostles' teaching"
  { number: 13, construct: 'bible_depth', text: "I spend real time in the Word — not just reading it, but trying to understand what it means for my life." },
  { number: 14, construct: 'bible_depth', text: "When I go through something hard, the Word is where I go first — not social media, not people." },
  { number: 15, construct: 'bible_depth', reverse: true, text: "Most of what I know about the Bible comes from what I hear on Sunday — I don't study much on my own." },
  { number: 16, construct: 'bible_depth', text: "I can connect what I read in Scripture to what's actually happening in my life right now." },

  // PRAYER & FASTING (17-20) — Acts 2:42 "prayers"
  { number: 17, construct: 'time_god',    text: "Prayer is a real part of my daily life — not just something I do before meals or when I'm scared." },
  { number: 18, construct: 'time_god',    text: "I've fasted before — I know what it means to deny myself to seek God." },
  { number: 19, construct: 'time_god',    text: "When my church comes together to pray or fast, I participate — I don't sit that out." },
  { number: 20, construct: 'time_god',    reverse: true, text: "Honestly, I only really pray when something goes wrong or I need something." },

  // OUTREACH (21-24) — Acts 1:8 / Great Commission
  { number: 21, construct: 'outreach',    text: "I talk about my faith with people outside the church — it's not something I keep to myself." },
  { number: 22, construct: 'outreach',    text: "I'm intentional about the people around me who don't know God — I'm building real relationships with them." },
  { number: 23, construct: 'outreach',    reverse: true, text: "Sharing my faith feels uncomfortable — I'd rather just live it out and hope people notice." },
  { number: 24, construct: 'outreach',    text: "I bring people into what God is doing in my life — I don't keep my faith private." },

  // DISCIPLESHIP (25-28) — Great Commission "teaching them to obey"
  { number: 25, construct: 'discipleship', text: "I'm actively pouring into someone else right now — walking with them, checking on them, helping them grow." },
  { number: 26, construct: 'discipleship', text: "I think about who I'm raising up — not just my own growth, but who's coming behind me." },
  { number: 27, construct: 'discipleship', reverse: true, text: "I feel like I need to have it all together before I can help anyone else." },
  { number: 28, construct: 'discipleship', text: "I can see what God is doing in people around me and I try to help draw it out." },

  // STEWARDSHIP — TIME (29-30)
  { number: 29, construct: 'time_steward', text: "I'm intentional about how I spend my time — I don't just let life happen to me." },
  { number: 30, construct: 'time_steward', reverse: true, text: "I waste a lot of time on things that don't really matter and I know it." },

  // STEWARDSHIP — TALENT (31-32)
  { number: 31, construct: 'talent',       text: "I know what I'm gifted at and I'm using it — I'm not sitting on what God put in me." },
  { number: 32, construct: 'talent',       reverse: true, text: "I know I have gifts but I haven't really stepped into them yet — I keep waiting." },

  // STEWARDSHIP — TREASURE (33-35)
  { number: 33, construct: 'treasure',     text: "I give to God first — before bills, before anything else. That's not a struggle for me." },
  { number: 34, construct: 'treasure',     text: "I'm generous — when I see a need and I have something to give, I give it." },
  { number: 35, construct: 'treasure',     reverse: true, text: "Money is a real pressure in my life right now and it affects how I give." },

  // CULTURAL ALIGNMENT (36-40) — honor, accountability, conflict
  { number: 36, construct: 'alignment',    text: "I speak well of my leaders — I don't talk about them behind their back." },
  { number: 37, construct: 'alignment',    reverse: true, text: "When I have a problem with someone, I tend to talk to other people about it before I go to them directly." },
  { number: 38, construct: 'alignment',    text: "I deal with conflict directly — I go to the person, not around them." },
  { number: 39, construct: 'alignment',    text: "I have real people in my life who can check me — not just people who agree with everything I do." },
  { number: 40, construct: 'alignment',    reverse: true, text: "I have a hard time submitting to authority — especially when I think I know better." },
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
  { number: 25, optionA: "Hearing someone say 'I'm proud of you' or 'I appreciate you' means everything to me.", optionB: "A warm hug or someone being physically close tells me I'm loved." },
  { number: 26, optionA: "Someone giving me their full, undivided attention makes me feel deeply valued.", optionB: "When someone helps me with something without being asked, I feel cared for." },
  { number: 27, optionA: "A thoughtful, meaningful gift — even something small — shows me someone was thinking about me.", optionB: "Spending focused, uninterrupted time with someone I care about is what I treasure most." },
  { number: 28, optionA: "Words of encouragement lift me more than anything else someone can do.", optionB: "Someone rolling up their sleeves and helping me out speaks louder than words." },
  { number: 29, optionA: "Physical closeness — a hand on the shoulder, sitting together — communicates love in a way words can't.", optionB: "A well-chosen gift tells me someone truly knows me." },
  { number: 30, optionA: "I feel most connected to someone when we're spending quality time focused on each other.", optionB: "Specific, sincere compliments stay with me longer than almost anything." },
  { number: 31, optionA: "When someone takes something off my plate without being asked, I know they love me.", optionB: "Being held or touched warmly — a hug, a pat on the back — communicates love deeply." },
  { number: 32, optionA: "Receiving an unexpected, meaningful gift makes me feel truly seen.", optionB: "Someone setting aside time specifically for me makes me feel most valued." },
  { number: 33, optionA: "Kind, affirming words mean more to me than actions.", optionB: "Acts of service — someone helping me practically — mean more to me than words." },
  { number: 34, optionA: "Physical affirmation — being close, a gentle touch — speaks love to me.", optionB: "Focused, uninterrupted time with someone is the deepest expression of love I know." },
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

// ─── SECTION 5: LEADERSHIP STYLE (8 forced-choice pairs) ────────────────────
// Reveals dominant style: Director / Coach / Supporter / Delegator

export interface S5Question {
  number: number;
  optionA: string; styleA: string;
  optionB: string; styleB: string;
}

export const S5_QUESTIONS: S5Question[] = [
  { number: 101, styleA: 'director',   optionA: "I tell people clearly what needs to happen and expect it to get done.",           styleB: 'coach',      optionB: "I ask questions and help people figure out the best path themselves." },
  { number: 102, styleA: 'supporter',  optionA: "I make sure everyone on the team feels heard and valued before we move.",         styleB: 'delegator',  optionB: "I hand off responsibility and trust people to run with it." },
  { number: 103, styleA: 'director',   optionA: "When a decision needs to be made, I make it — I don't wait for consensus.",       styleB: 'supporter',  optionB: "I build agreement before moving — I want everyone bought in." },
  { number: 104, styleA: 'coach',      optionA: "I invest heavily in developing the people around me — their growth is my job.",   styleB: 'delegator',  optionB: "I give people ownership and get out of the way — micromanaging kills growth." },
  { number: 105, styleA: 'director',   optionA: "I set the vision and the standard — people know what I expect.",                  styleB: 'coach',      optionB: "I walk alongside people — I'm more interested in who they're becoming than what they're producing." },
  { number: 106, styleA: 'supporter',  optionA: "I lead by serving — I remove obstacles so my team can do their best work.",       styleB: 'director',   optionB: "I lead by example — I set the pace and people follow." },
  { number: 107, styleA: 'coach',      optionA: "I give honest, direct feedback because I believe in the person's potential.",     styleB: 'supporter',  optionB: "I affirm and encourage — people grow best when they feel safe." },
  { number: 108, styleA: 'delegator',  optionA: "I trust people with real responsibility — I don't need to be in every decision.", styleB: 'coach',      optionB: "I stay close to the people I'm developing — I want to see their process, not just their results." },
];

// ─── SECTION 6: EMOTIONAL INTELLIGENCE (20 Likert items, 1-5) ────────────────
// Scale: 1=Never  2=Rarely  3=Sometimes  4=Often  5=Always
// 5 constructs × 4 items — Psychology meets Jesus

export interface S6LikertItem {
  number: number;
  text: string;
  construct: string;
  reverse?: boolean;
}

export const S6_ITEMS: S6LikertItem[] = [
  // SELF-AWARENESS
  { number: 111, construct: 'self_awareness',   text: "I know my emotional triggers and can name them before they control me." },
  { number: 112, construct: 'self_awareness',   text: "I can tell when my mood is affecting how I treat people." },
  { number: 113, construct: 'self_awareness',   reverse: true, text: "I'm often surprised when people tell me how I came across in a conversation." },
  { number: 114, construct: 'self_awareness',   text: "I understand my patterns — why I respond the way I do under pressure." },

  // SELF-REGULATION
  { number: 115, construct: 'self_regulation',  text: "I can feel strong emotions without letting them drive my decisions." },
  { number: 116, construct: 'self_regulation',  text: "When I'm frustrated or hurt, I process it before I respond." },
  { number: 117, construct: 'self_regulation',  reverse: true, text: "I say things in the heat of the moment that I later regret." },
  { number: 118, construct: 'self_regulation',  text: "I can stay calm and focused when the pressure is high." },

  // EMPATHY
  { number: 119, construct: 'empathy',          text: "I can sense when someone is hurting even when they haven't said anything." },
  { number: 120, construct: 'empathy',          text: "I listen to understand, not just to respond." },
  { number: 121, construct: 'empathy',          reverse: true, text: "I find it hard to connect with people whose experiences are very different from mine." },
  { number: 122, construct: 'empathy',          text: "People feel safe being honest with me — they know I won't judge them." },

  // SOCIAL AWARENESS
  { number: 123, construct: 'social_awareness', text: "I can read the atmosphere in a room and adjust how I engage." },
  { number: 124, construct: 'social_awareness', text: "I notice group dynamics — who has influence, who's disengaged, what's unspoken." },
  { number: 125, construct: 'social_awareness', reverse: true, text: "I sometimes miss social cues that others pick up on naturally." },
  { number: 126, construct: 'social_awareness', text: "I'm aware of how my presence and energy affect the people around me." },

  // RELATIONSHIP MANAGEMENT
  { number: 127, construct: 'rel_management',   text: "I build trust with people over time — I'm consistent, not just warm in the moment." },
  { number: 128, construct: 'rel_management',   text: "I can navigate conflict without damaging the relationship." },
  { number: 129, construct: 'rel_management',   reverse: true, text: "I tend to pull back from relationships when things get complicated." },
  { number: 130, construct: 'rel_management',   text: "I invest in people's development — I help them grow, not just get things done." },
];
