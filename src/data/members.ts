export type MemberScore = {
  name: string;
  tgUser: string; // Telegram username (lowercase, no @)
  scores: {
    character: number;
    competency: number;
    ownership: number;
    relational: number;
  };
  calling: string;
  growth: string;
};

// Real scores from the Jesus Generation Leadership Pipeline Assessment
// Source: Form Responses 3.csv — each section max 50 pts (10 items × 5)
export const MEMBERS: MemberScore[] = [
  {
    name: "Starr Miller",
    tgUser: "starr miller",
    scores: { character: 42, competency: 32, ownership: 39, relational: 41 },
    calling: "Evangelism, including prison ministry",
    growth: "Receiving constructive criticism. Avoiding jealousy. Viewing challenges as opportunities. Using technology for ministry.",
  },
  {
    name: "LaKierra Chism",
    tgUser: "lakierra chism",
    scores: { character: 42, competency: 24, ownership: 26, relational: 44 },
    calling: "Called to be a teacher",
    growth: "Being more bold, speaking up, and being consistent.",
  },
  {
    name: "Bobby Tarwoe",
    tgUser: "bobby",
    scores: { character: 25, competency: 33, ownership: 30, relational: 42 },
    calling: "",
    growth: "",
  },
  {
    name: "Ms G. McNeil",
    tgUser: "msg",
    scores: { character: 41, competency: 36, ownership: 38, relational: 39 },
    calling: "Seeking clarity on calling",
    growth: "Need more information and mentorship.",
  },
  {
    name: "Kammeako McNeil",
    tgUser: "ms_kammeako",
    scores: { character: 29, competency: 42, ownership: 45, relational: 46 },
    calling: "A passion for people — leadership has been natural since childhood",
    growth: "Increasing prayer life. Giving grace to self in new situations. Scheduling consistent time with God.",
  },
  {
    name: "Glennda McNeil",
    tgUser: "glennda mcneil",
    scores: { character: 39, competency: 34, ownership: 36, relational: 37 },
    calling: "Seeking clarity on purpose",
    growth: "Learning to forgive those who have wronged me.",
  },
  {
    name: "Keymani Dillingham",
    tgUser: "keymani dillingham",
    scores: { character: 36, competency: 30, ownership: 24, relational: 37 },
    calling: "Called to help lead this generation and younger people",
    growth: "Knowledge, wisdom, and dedication of time.",
  },
  {
    name: "India Tarwoe",
    tgUser: "india tarwoe",
    scores: { character: 40, competency: 36, ownership: 37, relational: 48 },
    calling: "Prophecy and Teaching",
    growth: "Consistency with fasting, prayer, and Bible reading.",
  },
  {
    name: "Randall Wynn Jr",
    tgUser: "bigboi0425",
    scores: { character: 22, competency: 24, ownership: 19, relational: 25 },
    calling: "Growth needed in many areas of life",
    growth: "Financial stewardship, prayer, and applying the tools given.",
  },
  {
    name: "Sara Squires",
    tgUser: "sara squires",
    scores: { character: 37, competency: 28, ownership: 35, relational: 40 },
    calling: "Creative identity. Prophetic gifting.",
    growth: "Not letting opinions of people get in the way of God. Praying more. Being a godly wife.",
  },
  {
    name: "Jared Squires",
    tgUser: "jared squires",
    scores: { character: 36, competency: 30, ownership: 37, relational: 37 },
    calling: "Gift of Faith. Prophetic and discernment. Growing in confidence in Christ.",
    growth: "Study Bible, pray, share in group.",
  },
  {
    name: "Chaundra Savage",
    tgUser: "chaundra savage",
    scores: { character: 47, competency: 23, ownership: 29, relational: 44 },
    calling: "Spreading the Gospel. Helping people understand Jesus accepts them where they are.",
    growth: "Boldness, studying the Word, dedication to ministry JGC.",
  },
  {
    name: "Chaundra Savage",
    tgUser: "ms. catt",
    scores: { character: 45, competency: 40, ownership: 32, relational: 39 },
    calling: "Sharing the Gospel and helping others understand a true relationship with God.",
    growth: "Studying more. Speaking when led to. Boldness in God.",
  },
  {
    name: "Tasha Corbin",
    tgUser: "tasha corbin",
    scores: { character: 34, competency: 19, ownership: 30, relational: 44 },
    calling: "Called to help people through dependable emotional support.",
    growth: "Build relationship with God through prayer, fasting, and Bible study. Learn His voice. Build self-confidence.",
  },
  {
    name: "Alisha Miller",
    tgUser: "alisham54",
    scores: { character: 37, competency: 30, ownership: 42, relational: 48 },
    calling: "To be a light in the darkness.",
    growth: "Prayer, willingness to speak, courage.",
  },
];

// Look up a member by Telegram username (flexible matching)
export function findMember(tgUsername?: string): MemberScore | null {
  if (!tgUsername) return null;
  const query = tgUsername.toLowerCase().replace(/^@/, "");
  return (
    MEMBERS.find((m) => m.tgUser === query) ||
    MEMBERS.find((m) => m.tgUser.includes(query) || query.includes(m.tgUser.split(" ")[0])) ||
    null
  );
}
