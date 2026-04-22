// 242Go AHDP — Notion CRM Sync
// Writes completed profiles to the Jesus Generation Database

import { Client } from '@notionhq/client';
import type { ScoredProfile } from './assessment/scoring';

function getNotionClient() {
  return new Client({ auth: process.env.NOTION_API_KEY });
}

function getDatabaseId() {
  return process.env.NOTION_DATABASE_ID!;
}

// Animal display names with emoji
const ANIMAL_DISPLAY: Record<string, string> = {
  lion:      '🦁 Lion',
  otter:     '🦦 Otter',
  retriever: '🐕 Golden Retriever',
  beaver:    '🦫 Beaver',
};

const LEVEL_EMOJI: Record<string, string> = {
  seeker:     '🌱',
  disciple:   '📖',
  servant:    '🤝',
  leader:     '🌟',
  multiplier: '🔥',
};

// ─────────────────────────────────────────────
// FIND existing Notion page by Telegram user ID
// ─────────────────────────────────────────────
async function findNotionPage(telegram_user_id: number): Promise<string | null> {
  try {
    const response = await getNotionClient().dataSources.query({
      data_source_id: getDatabaseId(),
      filter: {
        property: 'Telegram ID',
        number: { equals: telegram_user_id },
      },
    });
    if (response.results.length > 0) {
      return response.results[0].id;
    }
    return null;
  } catch (err) {
    console.error('findNotionPage error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────
// BUILD Notion page properties from profile
// ─────────────────────────────────────────────
function buildProperties(profile: ScoredProfile) {
  const levelLabel = `${LEVEL_EMOJI[profile.level] ?? ''} ${profile.level.charAt(0).toUpperCase() + profile.level.slice(1)} (Level ${profile.level_number})`;

  return {
    // Name
    'Name': {
      title: [{ text: { content: profile.first_name } }],
    },

    // Telegram
    'Telegram ID': {
      number: profile.telegram_user_id,
    },
    'Username': {
      rich_text: [{ text: { content: profile.username ?? '' } }],
    },

    // Level & Score
    'Level': {
      select: { name: levelLabel },
    },
    'Overall Score': {
      number: profile.overall_score,
    },

    // C/C/C
    'Character Score': {
      number: profile.character_score,
    },
    'Competency Score': {
      number: profile.competency_score,
    },
    'Consistency Score': {
      number: profile.consistency_score,
    },

    // Pillars
    'Pillar: The Word': {
      number: profile.pillar_word,
    },
    'Pillar: Fellowship': {
      number: profile.pillar_fellowship,
    },
    'Pillar: Worship & Prayer': {
      number: profile.pillar_worship_prayer,
    },
    'Pillar: F.A.T.': {
      number: profile.pillar_fat,
    },
    'Pillar: Stewardship': {
      number: profile.pillar_stewardship,
    },

    // Personality
    'Dominant Animal': {
      select: { name: ANIMAL_DISPLAY[profile.dominant_animal] ?? profile.dominant_animal },
    },
    'Secondary Animal': {
      select: { name: ANIMAL_DISPLAY[profile.secondary_animal] ?? profile.secondary_animal },
    },

    // Bot
    'Bot Mode': {
      select: { name: profile.bot_mode },
    },

    // Flags
    'F.A.T. Gate': {
      checkbox: profile.fat_gate_triggered,
    },
    'Character Flagged': {
      checkbox: profile.character_flagged,
    },
    'Competency Flagged': {
      checkbox: profile.competency_flagged,
    },
    'Consistency Flagged': {
      checkbox: profile.consistency_flagged,
    },

    // Ministry
    'Ministry Placement': {
      rich_text: [{ text: { content: profile.ministry_placement ?? '' } }],
    },
    'Calling Direction': {
      rich_text: [{ text: { content: profile.calling_direction ?? '' } }],
    },

    // Status
    'Assessment Status': {
      select: { name: 'Complete' },
    },
  };
}

// ─────────────────────────────────────────────
// BUILD page content blocks (profile card + narrative)
// ─────────────────────────────────────────────
function buildContent(profile: ScoredProfile) {
  const blocks = [];

  // Profile Card
  if (profile.profile_card) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: '242Go Leadership Profile' } }],
      },
    });
    blocks.push({
      object: 'block',
      type: 'code',
      code: {
        language: 'plain text',
        rich_text: [{ text: { content: profile.profile_card } }],
      },
    });
  }

  // Strengths
  if (profile.strengths) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ text: { content: 'Strengths' } }],
      },
    });
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: profile.strengths } }],
      },
    });
  }

  // Growth Areas
  if (profile.growth_areas) {
    blocks.push({
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: [{ text: { content: 'Growth Areas' } }],
      },
    });
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ text: { content: profile.growth_areas } }],
      },
    });
  }

  return blocks;
}

// ─────────────────────────────────────────────
// SYNC profile to Notion — create or update
// ─────────────────────────────────────────────
export async function syncProfileToNotion(profile: ScoredProfile): Promise<void> {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    console.warn('Notion sync skipped — NOTION_API_KEY or NOTION_DATABASE_ID not set');
    return;
  }

  try {
    const notion = getNotionClient();
    const existingPageId = await findNotionPage(profile.telegram_user_id);
    const properties = buildProperties(profile);

    if (existingPageId) {
      // Update existing page
      await notion.pages.update({
        page_id: existingPageId,
        properties: properties as Parameters<typeof notion.pages.update>[0]['properties'],
      });

      // Update page content
      const content = buildContent(profile);
      if (content.length > 0) {
        // Clear existing content blocks first
        const existingBlocks = await notion.blocks.children.list({
          block_id: existingPageId,
        });
        for (const block of existingBlocks.results) {
          await notion.blocks.delete({ block_id: block.id });
        }
        // Add new content
        await notion.blocks.children.append({
          block_id: existingPageId,
          children: content as Parameters<typeof notion.blocks.children.append>[0]['children'],
        });
      }

      console.log(`Notion: updated page for ${profile.first_name} (${profile.telegram_user_id})`);
    } else {
      // Create new page
      const content = buildContent(profile);
      await notion.pages.create({
        parent: { database_id: getDatabaseId() },
        properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
        children: content.length > 0
          ? content as Parameters<typeof notion.pages.create>[0]['children']
          : undefined,
      });

      console.log(`Notion: created page for ${profile.first_name} (${profile.telegram_user_id})`);
    }
  } catch (err) {
    // Non-fatal — log but don't crash the scoring flow
    console.error('syncProfileToNotion error:', err);
  }
}
