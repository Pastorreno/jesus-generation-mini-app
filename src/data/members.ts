export type MemberScore = {
  username: string;
  first_name: string;
  calling?: string;
  growth?: string;
  scores: {
    character: number;
    competency: number;
    ownership: number;
    relational: number;
  };
};

const members: MemberScore[] = [];

export function findMember(username?: string | null): MemberScore | null {
  if (!username) return null;
  return members.find(m => m.username.toLowerCase() === username.toLowerCase()) ?? null;
}
