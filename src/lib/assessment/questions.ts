// 242Go AHDP Assessment — Question Bank
// 30 questions | No labels shown to user | Scoring map hidden

export type Dimension = 'character' | 'competency' | 'consistency' | 'personality';
export type Pillar = 'word' | 'fellowship' | 'worship_prayer' | 'fat' | 'stewardship' | 'animal';
export type Animal = 'lion' | 'otter' | 'retriever' | 'beaver';

export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  // Hidden from user — scoring only
  dimension: Dimension;
  pillar: Pillar;
  // For personality questions, maps answer to animal
  animalMap?: { A: Animal; B: Animal; C: Animal; D: Animal };
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: `How often do you read or study the Bible outside of Sunday service?

A) Every day — it's a non-negotiable part of my life
B) Most days — I miss some but I stay consistent
C) A few times a week when I can fit it in
D) Mainly Sundays or when something comes up`,
    options: {
      A: 'Every day — non-negotiable',
      B: 'Most days — mostly consistent',
      C: 'A few times a week',
      D: 'Mainly Sundays',
    },
    dimension: 'consistency',
    pillar: 'word',
  },
  {
    id: 2,
    text: `You're handed a new ministry assignment with no instructions. What's your first move?

A) Jump in and figure it out — results matter more than process 🦁
B) Rally some people and make it fun — let's figure it out together 🦦
C) Make sure everyone knows what they're doing and feels supported first 🐕
D) Ask for the details, build a plan, then execute carefully 🦫`,
    options: {
      A: 'Jump in — results first 🦁',
      B: 'Rally people — figure it out together 🦦',
      C: 'Support the team first 🐕',
      D: 'Plan then execute 🦫',
    },
    dimension: 'personality',
    pillar: 'animal',
    animalMap: { A: 'lion', B: 'otter', C: 'retriever', D: 'beaver' },
  },
  {
    id: 3,
    text: `How connected are you to a consistent community of believers outside of Sunday morning?

A) Very connected — I have people I do real life with regularly
B) Somewhat — I have a few relationships but it's not always consistent
C) Loosely — I know people but we don't really go deep
D) Mostly Sunday — I haven't built deep connections yet`,
    options: {
      A: 'Very connected — real life community',
      B: 'Somewhat — a few relationships',
      C: 'Loosely — know people but not deep',
      D: 'Mostly Sunday only',
    },
    dimension: 'consistency',
    pillar: 'fellowship',
  },
  {
    id: 4,
    text: `When you look at how you actually spend your time during the week — does it reflect what you say matters most?

A) Yes — my schedule and my priorities are aligned
B) Mostly — there are some gaps I'm aware of and working on
C) Not really — there's a gap between what I say matters and how I live
D) Honestly no — this is one of the areas I most need to grow in`,
    options: {
      A: 'Yes — aligned',
      B: 'Mostly — aware of gaps',
      C: 'Not really — gap exists',
      D: 'No — needs major work',
    },
    dimension: 'consistency',
    pillar: 'stewardship',
  },
  {
    id: 5,
    text: `How close is the gap between who you are at church and who you are at home, at work, or when nobody's watching?

A) Tight — I try to live the same way in every room
B) Mostly consistent — there are some areas I'm still working on
C) There's a gap I'm aware of but haven't fully closed
D) They look pretty different — I know that needs to change`,
    options: {
      A: 'Tight — same in every room',
      B: 'Mostly consistent',
      C: 'Gap exists — aware of it',
      D: 'Pretty different — needs to change',
    },
    dimension: 'character',
    pillar: 'word',
  },
  {
    id: 6,
    text: `When you spend time in the Word, what actually happens with it?

A) I study it, apply it, and share what I'm learning with others
B) I read regularly and try to apply it personally
C) I read but struggle to connect it to my everyday life
D) I read occasionally but don't have a real approach yet`,
    options: {
      A: 'Study, apply, and share',
      B: 'Read and apply personally',
      C: 'Read but struggle to connect',
      D: 'Read occasionally, no real approach',
    },
    dimension: 'competency',
    pillar: 'word',
  },
  {
    id: 7,
    text: `There's conflict in the ministry. How do you naturally respond?

A) Address it directly and decisively — solve it and move forward 🦁
B) Talk it through with energy — I want peace and I want the atmosphere right 🦦
C) Make sure everyone feels heard before any decisions get made 🐕
D) Think it through carefully before saying anything — I want to get it right 🦫`,
    options: {
      A: 'Direct and decisive 🦁',
      B: 'Talk through with energy 🦦',
      C: 'Make sure everyone feels heard 🐕',
      D: 'Think carefully before speaking 🦫',
    },
    dimension: 'personality',
    pillar: 'animal',
    animalMap: { A: 'lion', B: 'otter', C: 'retriever', D: 'beaver' },
  },
  {
    id: 8,
    text: `Describe your prayer life right now — be honest.

A) Consistent and intentional — I pray daily with real purpose
B) Regular but could go deeper — I pray most days
C) Occasional — I tend to pray when something comes up
D) Inconsistent — this is one of my biggest areas to grow`,
    options: {
      A: 'Consistent and intentional — daily',
      B: 'Regular but could be deeper',
      C: 'Occasional — when things come up',
      D: 'Inconsistent — biggest growth area',
    },
    dimension: 'consistency',
    pillar: 'worship_prayer',
  },
  {
    id: 9,
    text: `When you make a commitment — to the church, a ministry, or a person — what typically happens?

A) I keep it. My word is my word. People can count on me.
B) I usually follow through but life sometimes gets in the way
C) I struggle with follow-through more than I'd like to admit
D) I tend to overcommit and underdeliver — I'm working on it`,
    options: {
      A: 'I keep it — always',
      B: 'Usually follow through',
      C: 'Struggle with follow-through',
      D: 'Overcommit and underdeliver',
    },
    dimension: 'consistency',
    pillar: 'fat',
  },
  {
    id: 10,
    text: `When someone in your circle is going through something hard, how equipped do you actually feel to walk with them?

A) I can sit with people in pain, pray with them, and point them toward truth
B) I show up emotionally but I'm still developing the spiritual side
C) I show up but I don't always know what to say or do
D) I tend to step back — I don't feel equipped for those moments yet`,
    options: {
      A: 'Equipped — pray and point to truth',
      B: 'Show up emotionally, developing spiritually',
      C: 'Show up but unsure what to say',
      D: 'Step back — not equipped yet',
    },
    dimension: 'competency',
    pillar: 'fellowship',
  },
  {
    id: 11,
    text: `When life gets hard and your faith is tested — where do you go first?

A) The Word and prayer — that's my first response, not my last resort
B) I usually come back to Scripture after I've had time to process
C) I lean on others first and eventually get back to the Word
D) I tend to handle things on my own — the Word isn't my first instinct yet`,
    options: {
      A: 'Word and prayer — first response',
      B: 'Back to Scripture after processing',
      C: 'Others first, then the Word',
      D: 'Handle it alone — Word not first instinct',
    },
    dimension: 'character',
    pillar: 'word',
  },
  {
    id: 12,
    text: `Is there someone in your life right now who has real permission to tell you the truth about yourself — not just encourage you, but actually challenge you?

A) Yes — and I'm genuinely open to what they say
B) Yes — but I don't always follow through on it
C) Not really — I have people around me but no one goes that deep
D) No — this is something I know I need`,
    options: {
      A: 'Yes — and I receive it',
      B: 'Yes — but inconsistent follow-through',
      C: 'Not really — no one goes deep',
      D: 'No — I know I need this',
    },
    dimension: 'character',
    pillar: 'fellowship',
  },
  {
    id: 13,
    text: `In a team or group setting, people would describe your natural role as:

A) The one who takes charge and drives toward the goal 🦁
B) The one who keeps the energy up and makes sure people stay engaged 🦦
C) The one who makes sure no one is left out and holds the team together 🐕
D) The one who keeps things organized and makes sure it's done right 🦫`,
    options: {
      A: 'Takes charge — drives toward goal 🦁',
      B: 'Keeps energy up 🦦',
      C: 'No one left out — team glue 🐕',
      D: 'Organized — done right 🦫',
    },
    dimension: 'personality',
    pillar: 'animal',
    animalMap: { A: 'lion', B: 'otter', C: 'retriever', D: 'beaver' },
  },
  {
    id: 14,
    text: `When you're at church for worship — how present are you really?

A) Fully — I come expecting to encounter God and I participate wholeheartedly
B) Engaged most of the time but my mind wanders
C) I attend consistently but don't always feel connected to what's happening
D) Worship is something I'm still learning to engage with authentically`,
    options: {
      A: 'Fully present — expecting God',
      B: 'Mostly engaged — mind wanders',
      C: 'Consistent but not connected',
      D: 'Still learning to engage authentically',
    },
    dimension: 'consistency',
    pillar: 'worship_prayer',
  },
  {
    id: 15,
    text: `Do you know what your spiritual gifts are — and can you describe specifically how you're using them right now?

A) Yes — I know my gifts clearly and I'm actively developing and deploying them
B) I have a sense of them and I serve in them, but I'm not fully developed yet
C) I think I know what they are but haven't found the right place to use them
D) I'm still in the process of discovering what my gifts actually are`,
    options: {
      A: 'Know clearly — actively deployed',
      B: 'Sense of them — serving but developing',
      C: 'Think I know — no right context yet',
      D: 'Still discovering',
    },
    dimension: 'competency',
    pillar: 'stewardship',
  },
  {
    id: 16,
    text: `If a leader you respected sat down and told you something hard about a pattern they've seen in your character — how would you honestly respond in that moment?

A) I'd receive it, thank them, and get to work on it
B) It would sting but I'd sit with it and work through it
C) I know I can get defensive — I'd struggle to receive it well
D) Correction at that level is very hard for me — I tend to pull back`,
    options: {
      A: 'Receive, thank, and act',
      B: 'Stings but would work through it',
      C: 'Tend to get defensive',
      D: 'Very hard — tend to pull back',
    },
    dimension: 'character',
    pillar: 'fat',
  },
  {
    id: 17,
    text: `Beyond Sunday service and reading the Bible — do you practice any other spiritual disciplines consistently? Fasting, journaling, solitude, silence?

A) Yes — I have multiple practices that are consistent in my life
B) Occasionally — I do some of these but not with real consistency
C) I've tried some things but haven't built lasting habits yet
D) Not yet — this is an area I genuinely want to develop`,
    options: {
      A: 'Yes — multiple consistent practices',
      B: 'Occasionally — not consistent',
      C: 'Tried but no lasting habits',
      D: 'Not yet — want to develop',
    },
    dimension: 'consistency',
    pillar: 'worship_prayer',
  },
  {
    id: 18,
    text: `Could you explain the Gospel — what Jesus did and why it matters — clearly enough to share it with someone who doesn't know Him?

A) Yes, and I do it regularly — I'm comfortable sharing my faith
B) Yes, I could explain it, but I don't share it often
C) I understand it for myself but struggle to put it into words for others
D) I'm still working on fully understanding it myself`,
    options: {
      A: 'Yes — share regularly and comfortably',
      B: 'Could explain it — don\'t share often',
      C: 'Understand personally — struggle to share',
      D: 'Still working on understanding it',
    },
    dimension: 'competency',
    pillar: 'word',
  },
  {
    id: 19,
    text: `Are you willing to let people in this church see the real you — not just the version of you that has it together?

A) Yes — I believe real vulnerability is what builds real community
B) With certain people, yes — I'm selective but I do open up
C) It's hard for me — I tend to keep walls up even at church
D) Not yet — I'm still figuring out who's safe`,
    options: {
      A: 'Yes — vulnerability builds community',
      B: 'With certain people — selective',
      C: 'Hard — walls up even at church',
      D: 'Not yet — figuring out who\'s safe',
    },
    dimension: 'character',
    pillar: 'fellowship',
  },
  {
    id: 20,
    text: `When you're under real pressure, what do the people around you actually see?

A) Someone who gets more focused and pushes harder 🦁
B) Someone who talks it out and keeps others motivated 🦦
C) Someone who stays steady so others can lean in 🐕
D) Someone who gets quiet and works through it methodically 🦫`,
    options: {
      A: 'More focused — pushes harder 🦁',
      B: 'Talks it out — keeps others motivated 🦦',
      C: 'Stays steady — others lean in 🐕',
      D: 'Gets quiet — works methodically 🦫',
    },
    dimension: 'personality',
    pillar: 'animal',
    animalMap: { A: 'lion', B: 'otter', C: 'retriever', D: 'beaver' },
  },
  {
    id: 21,
    text: `Are you currently serving anywhere in the church or ministry — consistently, not just occasionally?

A) Yes, actively — I serve consistently and I'm fully invested
B) Occasionally — I serve when I can but it's not regular
C) Not currently — I'm still looking for where to plug in
D) No, not yet`,
    options: {
      A: 'Yes — consistently and invested',
      B: 'Occasionally — not regular',
      C: 'Not currently — looking for a place',
      D: 'No, not yet',
    },
    dimension: 'consistency',
    pillar: 'stewardship',
  },
  {
    id: 22,
    text: `Have you ever been placed in a role you didn't want or ask for? What did you do?

A) I served faithfully in it — where I'm placed doesn't change my commitment
B) I served where I was placed but respectfully shared when it wasn't the right fit
C) It's hard to give my best when I'm not in a role that feels right for me
D) I tend to step back when an assignment doesn't align with what I feel called to`,
    options: {
      A: 'Served faithfully — commitment doesn\'t waver',
      B: 'Served and respectfully shared',
      C: 'Hard to give best in wrong role',
      D: 'Tend to step back',
    },
    dimension: 'character',
    pillar: 'fat',
  },
  {
    id: 23,
    text: `When you pray for other people — how would you describe what that actually looks like?

A) I pray with specificity and faith — I intercede and I believe God moves
B) I pray for others but it's more general — I'm developing depth in this
C) I pray when asked but I don't often initiate prayer for others
D) Praying for others is still something I'm developing`,
    options: {
      A: 'Specific, faith-filled intercession',
      B: 'General — developing depth',
      C: 'When asked — don\'t often initiate',
      D: 'Still developing this',
    },
    dimension: 'competency',
    pillar: 'worship_prayer',
  },
  {
    id: 24,
    text: `Do you tithe or give financially to the church on a regular basis?

A) Yes, consistently — it's non-negotiable for me
B) I give regularly but not always at a full tithe level
C) I give occasionally but not consistently
D) Financial giving is still an area I'm building in`,
    options: {
      A: 'Yes — consistently non-negotiable',
      B: 'Regularly — not always full tithe',
      C: 'Occasionally — not consistent',
      D: 'Still building in this area',
    },
    dimension: 'consistency',
    pillar: 'stewardship',
  },
  {
    id: 25,
    text: `Has there been a season in your life where following God actually cost you something — a relationship, money, a reputation, comfort? What did you do?

A) Yes — and I chose God even when it was hard and the cost was real
B) Yes — I eventually made the right call but there was a real struggle
C) I've faced moments like that and I haven't always chosen well
D) I haven't been in that place yet — or I haven't recognized it when it came`,
    options: {
      A: 'Yes — chose God despite the cost',
      B: 'Yes — made the right call eventually',
      C: 'Faced it — haven\'t always chosen well',
      D: 'Haven\'t been there yet',
    },
    dimension: 'character',
    pillar: 'worship_prayer',
  },
  {
    id: 26,
    text: `What motivates you most when you think about ministry?

A) Seeing things move, grow, and produce real results 🦁
B) The relationships, the energy, the joy of doing it together 🦦
C) Knowing that people feel loved, seen, and taken care of 🐕
D) The quality of the work — doing it with excellence matters deeply to me 🦫`,
    options: {
      A: 'Results and growth 🦁',
      B: 'Relationships and energy 🦦',
      C: 'People feeling loved and seen 🐕',
      D: 'Excellence in the work 🦫',
    },
    dimension: 'personality',
    pillar: 'animal',
    animalMap: { A: 'lion', B: 'otter', C: 'retriever', D: 'beaver' },
  },
  {
    id: 27,
    text: `When you're serving in a ministry role — how effective would the people around you say you actually are?

A) Very — I bring my best, I'm reliable, and people trust the work
B) Generally good — I contribute well but there's room to grow
C) I show up but I know I'm not always as prepared or effective as I should be
D) I haven't served consistently enough to know yet`,
    options: {
      A: 'Very effective — reliable and trusted',
      B: 'Generally good — room to grow',
      C: 'Show up — not always prepared',
      D: 'Haven\'t served enough to know',
    },
    dimension: 'competency',
    pillar: 'stewardship',
  },
  {
    id: 28,
    text: `How available are you to serve in the ministry right now — not just when it's convenient, but on a real consistent basis?

A) Very available — wherever I'm needed, I'm ready to show up
B) Available with some limitations — consistent, but not everywhere
C) My availability is limited right now because of life circumstances
D) This isn't the right season for me to be heavily involved`,
    options: {
      A: 'Very available — ready to show up',
      B: 'Available with limitations — consistent',
      C: 'Limited — life circumstances',
      D: 'Not the right season',
    },
    dimension: 'consistency',
    pillar: 'fat',
  },
  {
    id: 29,
    text: `How well are you actually deploying what God put in you — your gifts, your skills, your talent — for the Kingdom right now?

A) I'm operating in my lane, developing what I have, and producing fruit
B) I'm serving in my gifting but I'm not fully developed or deployed yet
C) I know I have something to give but haven't found the right context yet
D) I'm still figuring out what I have to offer`,
    options: {
      A: 'Operating in lane — producing fruit',
      B: 'Serving in gifting — not fully deployed',
      C: 'Have something to give — no right context',
      D: 'Still figuring out what I have',
    },
    dimension: 'competency',
    pillar: 'stewardship',
  },
  {
    id: 30,
    text: `Last one. If God held up a mirror right now and showed you exactly how you've handled what He gave you — your time, your talent, your resources, your relationships — what would you honestly see?

A) Someone who has been faithful and is growing in faithfulness
B) Someone with good intentions who hasn't fully activated what they've been given
C) Someone who has held back more than they've given
D) Someone who is just beginning to understand what it means to be a steward`,
    options: {
      A: 'Faithful — and growing in it',
      B: 'Good intentions — not fully activated',
      C: 'Held back more than given',
      D: 'Just beginning to understand stewardship',
    },
    dimension: 'character',
    pillar: 'stewardship',
  },
];

// ─────────────────────────────────────────────
// SCORING MAP — Developer reference only
// ─────────────────────────────────────────────
export const SCORING_MAP = {
  character:    [5, 11, 12, 16, 19, 22, 25, 30],   // 8 Qs × 4pts = 32 max
  competency:   [6, 10, 15, 18, 23, 27, 29],        // 7 Qs × 4pts = 28 max
  consistency:  [1, 3, 4, 8, 9, 14, 17, 21, 24, 28], // 10 Qs × 4pts = 40 max
  personality:  [2, 7, 13, 20, 26],                 // 5 Qs — unscored
  fat_gate:     [9, 16, 22, 28],                    // Subset of C/C — gate check
};

export const LEVEL_THRESHOLDS = {
  multiplier: 81,
  leader:     66,
  servant:    51,
  disciple:   36,
  seeker:     0,
};

export const FAT_GATE_THRESHOLD = 10; // out of 16 (4 questions × 4)

export const ANIMAL_NAMES: Record<Animal, string> = {
  lion:      '🦁 Lion',
  otter:     '🦦 Otter',
  retriever: '🐕 Retriever',
  beaver:    '🦫 Beaver',
};

export const ANIMAL_DESCRIPTIONS: Record<Animal, string> = {
  lion:      'Direct. Decisive. Leads by challenge. Drives results.',
  otter:     'Enthusiastic. Relational. Leads by energy and connection.',
  retriever: 'Warm. Steady. Leads by loyalty and care.',
  beaver:    'Precise. Structured. Leads by quality and detail.',
};

export const LEVEL_NAMES: Record<string, string> = {
  seeker:     'Seeker',
  disciple:   'Disciple',
  servant:    'Servant',
  leader:     'Leader',
  multiplier: 'Multiplier',
};

export const PASSAGE_NAMES: Record<number, string> = {
  1: 'The Welcome',
  2: 'The Commitment',
  3: 'The Deployment',
  4: 'The Commission',
  5: 'The Multiplication',
  6: 'The Sending',
};

export const TOTAL_QUESTIONS = QUESTIONS.length; // 30
