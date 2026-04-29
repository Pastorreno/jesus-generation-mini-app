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
  // FAITHFUL (1-5) — Acts 2:42 "devoted themselves"
  { number: 1,  construct: 'faithful',    text: "I keep my spiritual commitments — fasts, prayer challenges, reading plans — even when life gets hard." },
  { number: 2,  construct: 'faithful',    text: "My time with God is the last thing I cut when my schedule gets full." },
  { number: 3,  construct: 'faithful',    text: "I show up to corporate worship and prayer gatherings consistently, not just when it's convenient." },
  { number: 4,  construct: 'faithful',    reverse: true, text: "I go through seasons where my spiritual disciplines completely fall off." },

  // AVAILABLE (6-9) — Acts 2:44-45 "they had everything in common"
  { number: 5,  construct: 'available',   text: "When my church needs help, I step up without waiting to be asked." },
  { number: 6,  construct: 'available',   text: "I make myself accessible to the people God has placed in my life to serve." },
  { number: 7,  construct: 'available',   reverse: true, text: "I tend to sit back and let others handle ministry responsibilities." },
  { number: 8,  construct: 'available',   text: "I support the vision of my pastor even when it costs me something personally." },

  // TEACHABLE (9-12) — Acts 2:42 "apostles' teaching"
  { number: 9,  construct: 'teachable',   text: "When my pastor or a spiritual leader corrects me, I receive it without becoming defensive." },
  { number: 10, construct: 'teachable',   text: "I actively seek feedback on my blind spots — I want people in my life who will tell me the truth." },
  { number: 11, construct: 'teachable',   reverse: true, text: "I find it hard to change my behavior even when I know correction is right." },
  { number: 12, construct: 'teachable',   text: "I submit to spiritual authority even when I don't fully understand the decision." },

  // WORD DEPTH (13-16) — Acts 2:42 "devoted to the apostles' teaching"
  { number: 13, construct: 'bible_depth', text: "I study the Word beyond what I hear on Sunday — I dig into context, meaning, and application." },
  { number: 14, construct: 'bible_depth', text: "I can explain what I believe and back it up with Scripture." },
  { number: 15, construct: 'bible_depth', reverse: true, text: "I rely mostly on sermons and other people's teaching rather than studying for myself." },
  { number: 16, construct: 'bible_depth', text: "When I read the Word, I apply it to my life — not just receive it as information." },

  // PRAYER & FASTING (17-20) — Acts 2:42 "prayers" / COGIC tarrying culture
  { number: 17, construct: 'time_god',    text: "Prayer is a structured, daily discipline in my life — I have set times and I keep them." },
  { number: 18, construct: 'time_god',    text: "Fasting is a regular part of my spiritual rhythm, not just something I do in a crisis." },
  { number: 19, construct: 'time_god',    text: "When the church calls a corporate fast or prayer gathering, I participate fully." },
  { number: 20, construct: 'time_god',    reverse: true, text: "I pray more when things are hard than as a consistent daily practice." },
  // OUTREACH (21-24) — Acts 1:8 / Great Commission Matt 28:19
  { number: 21, construct: 'outreach',    text: "I intentionally build relationships with people who don't know God — I'm in their world on purpose." },
  { number: 22, construct: 'outreach',    text: "I share my faith regularly — not just when the moment falls in my lap." },
  { number: 23, construct: 'outreach',    reverse: true, text: "Evangelism feels like someone else's assignment — I support it but don't lead it." },
  { number: 24, construct: 'outreach',    text: "I invite people into the life of the church as a natural part of how I live." },

  // DISCIPLESHIP (25-28) — Great Commission "teaching them to obey"
  { number: 25, construct: 'discipleship', text: "I am actively pouring into someone else's spiritual growth right now." },
  { number: 26, construct: 'discipleship', text: "I think about multiplication — not just my own growth but who I'm raising up." },
  { number: 27, construct: 'discipleship', reverse: true, text: "I feel like I need to be further along before I can pour into someone else." },
  { number: 28, construct: 'discipleship', text: "I can identify what God is doing in someone and help draw it out." },

  // STEWARDSHIP — TIME (29-30) — 3 T's
  { number: 29, construct: 'time_steward', text: "My calendar reflects Kingdom priorities — God, family, ministry, work — in that order." },
  { number: 30, construct: 'time_steward', reverse: true, text: "I'm more reactive than intentional about how I spend my time." },

  // STEWARDSHIP — TALENT (31-32) — 3 T's / Acts 1:8 "you shall receive power"
  { number: 31, construct: 'talent',       text: "I know what gifts and abilities God has given me and I'm actively using them for the Kingdom." },
  { number: 32, construct: 'talent',       reverse: true, text: "I know I have gifts but I haven't fully stepped into using them yet." },

  // STEWARDSHIP — TREASURE (33-35) — Acts 2:45 / Great Commandment
  { number: 33, construct: 'treasure',     text: "I tithe consistently — it's the first thing I give, not what's left over." },
  { number: 34, construct: 'treasure',     text: "I give offerings beyond my tithe when I'm led by the Spirit." },
  { number: 35, construct: 'treasure',     reverse: true, text: "Financial pressure makes it hard for me to give consistently right now." },

  // CULTURAL ALIGNMENT (36-37) — Acts 2:42 "fellowship" / COGIC honor culture
  { number: 36, construct: 'alignment',    text: "I speak well of my pastor and church leadership — I don't murmur or complain." },
  { number: 37, construct: 'alignment',    reverse: true, text: "When I disagree with leadership, I tend to talk to others before going to the source." },

  // CONFLICT & ACCOUNTABILITY (38-40) — Great Commandment / Matthew 18
  { number: 38, construct: 'alignment',    text: "When there's conflict, I go directly to the person — I don't avoid it or go around them." },
  { number: 39, construct: 'alignment',    text: "I have people in my life who have real access to hold me accountable — not just people who agree with me." },
  { number: 40, construct: 'alignment',    reverse: true, text: "I struggle with submission when I feel like I know better than the person leading me." },
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
