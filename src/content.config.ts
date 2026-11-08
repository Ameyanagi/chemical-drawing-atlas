import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const url = z.string().nullable();
const feature = z.object({
  status: z.enum(['yes', 'partial', 'no', 'unknown']),
  evidence: z.enum(['tested', 'ui', 'docs', 'source', 'none']),
  source: url,
  note: z.string().nullable(),
  shot: z.object({ image: z.string(), caption: z.string() }).optional(),
  engine: z.object({ library: z.string(), source: url.optional() }).optional(),
  plan: z.string().optional(),
  planLevel: z.enum(['free', 'account', 'paid']).optional(),
});
const capture = z.object({
  fixture: z.enum(['simple', 'complex', 'threed']),
  result: z.enum(['ok', 'failed', 'unsupported']),
  input: z.string().nullable(),
  image: z.string().nullable(),
  note: z.string().nullable(),
  structure: z.enum(['match', 'stereo', 'mismatch']).nullable(),
});

const builtOn = z.object({
  relation: z.enum(['original', 'wrapper', 'fork']).nullable(),
  editor: z.string().nullable(),
  libraries: z.array(z.string()).nullable(),
  ported: z.array(z.string()).optional(),
  source: url,
  note: z.string().nullable(),
});

const renderer = z.object({
  origin: z.enum(['original', 'borrowed']).nullable(),
  name: z.string().nullable(),
  language: z.string().nullable(),
  source: url,
});
const thirdParty = z.object({
  summary: z.string().nullable().optional(),
  source: url.optional(),
  notice: url.optional(),
  libraries: z.array(z.object({ name: z.string(), license: z.string().nullable(), source: url })),
});

const tools = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/tools' }),
  schema: z.object({
    id: z.string().regex(/^p\d{2,3}$/),
    slug: z.string(),
    name: z.string(),
    rank: z.number().int().positive(),
    builtOn: builtOn.nullable(),
    appKind: z.object({ desktop: z.boolean(), web: z.boolean() }),
    plans: z.array(z.object({ name: z.string(), level: z.enum(['free', 'account', 'paid']), price: z.string().nullable() })),
    renderer: renderer.nullable().optional(),
    enginesChecked: z.boolean(),
    languageNote: z.string().nullable().optional(),
    drawingStyle: z.string().optional(),
    video: z.object({ provider: z.enum(['youtube', 'vimeo', 'file', 'link']), url: z.url(), embed: z.string().nullable(), title: z.string(), author: z.string().nullable().optional(), linkedFrom: z.url(), poster: z.string().nullable().optional() }).nullable().optional(),
    embedding: z.object({ methods: z.array(z.string()), package: z.string().nullable(), limit: z.string().nullable(), how: z.string() }).nullable().optional(),
    otherLanguages: z.array(z.object({ language: z.string(), role: z.string() })).nullable().optional(),
    thirdParty,
    tier: z.enum(['alternative', 'embeddable', 'related']),
    tierReason: z.string().nullable(),
    summary: z.string(),
    website: url,
    repo: url,
    docs: url,
    vendor: z.string().nullable(),
    license: z.object({
      kind: z.enum(['open-source', 'free', 'freemium', 'commercial', 'source-available', 'unclear']),
      spdx: z.string().nullable(),
      text: z.string(),
      source: url,
    }),
    price: z.object({ text: z.string(), source: url }),
    platforms: z.object({
      macos: z.boolean(), windows: z.boolean(), linux: z.boolean(), web: z.boolean(),
      ios: z.boolean(), android: z.boolean(), offline: z.boolean(),
    }),
    version: z.object({ name: z.string().nullable(), date: z.string().nullable(), source: url }),
    engine: z.object({ rendering: z.string().nullable(), chemistry: z.string().nullable(), ui: z.string().nullable(), source: url }),
    languages: z.array(z.string()),
    features: z.record(z.string(), feature),
    caveats: z.array(z.string()),
    github: z.object({ url: z.string(), stars: z.number().nullable(), checkedOn: z.string(), firstCommit: z.string().nullable(), commits: z.number().nullable(), contributors: z.number().nullable(), pushedAt: z.string().nullable(), archived: z.boolean().nullable() }).nullable(),
    hands: z.object({
      testedVersion: z.string().nullable(),
      canvas: z.string().nullable(),
      canvasLight: z.string().nullable(),
      canvasDark: z.string().nullable(),
      memory: z.object({
        idleMb: z.number().nullable(), paclitaxelMb: z.number().nullable(), baselineMb: z.number().nullable().optional(),
        rssIdleMb: z.number().nullable().optional(), rssPaclitaxelMb: z.number().nullable().optional(),
        runs: z.number(), processes: z.number().nullable().optional(), method: z.string().nullable().optional(), note: z.string().nullable().optional(),
      }).nullable(),
      themes: z.object({ light: z.boolean(), dark: z.boolean(), how: z.string().nullable().optional(), note: z.string().nullable().optional() }).nullable(),
      testedOn: z.string(),
      platform: z.string(),
      route: z.string(),
      artifact: z.string().nullable(),
      ran: z.boolean(),
      failure: z.string().nullable(),
      downloadBytes: z.number().nullable(),
      installedBytes: z.number().nullable(),
      captures: z.array(capture),
      observations: z.array(z.string()),
    }).nullable(),
    perf: z.object({
      kind: z.enum(['desktop', 'web']),
      launchMs: z.number().nullable(),
      idleMb: z.number().nullable(),
      loadMs: z.number().nullable(),
      transferBytes: z.number().nullable(),
    }).nullable(),
    downloadBytes: z.number().nullable(),
    references: z.array(z.string()),
  }),
});

export const collections = { tools };
