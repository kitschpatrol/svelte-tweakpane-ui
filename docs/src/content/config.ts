import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { defineCollection, z } from "astro:content";

// acknowledgments schema
// as delivered from license-checker-rseidelsohn
const acknowledgmentsSchema = z.record(
  z.object({
    email: z.string().min(1).optional(), // not all valid emails
    licenseFile: z.string().min(1).optional(),
    licenses: z.string().min(1),
    path: z.string().min(1),
    publisher: z.string().min(1).optional(),
    repository: z.string().min(1).optional(), // not always valid URLs...
    url: z.string().min(1).optional(), // not all valid URLs
  }),
);

// component documentation schema
// must be kept in sync with ./scripts/generate-doc-data.ts

const componentJsDocRecordSchema = z.record(z.string());

const componentPartInfoSchema = z.array(
  z.object({
    doc: z.string(),
    jsDocs: componentJsDocRecordSchema,
    name: z.string(),
    type: z.string(),
  }),
);

const componentPropConditionSchema = z.record(
  z.union([z.boolean(), z.number(), z.string()]),
);

const componentDocSchema = z.object({
  doc: z.string(),
  dynamicProps: z
    .array(
      z.object({
        condition: componentPropConditionSchema,
        description: z.string(),
        props: componentPartInfoSchema,
      }),
    )
    .optional(),
  events: componentPartInfoSchema,
  jsDocs: componentJsDocRecordSchema.optional(),
  name: z.string(),
  path: z.string(),
  pathParts: z.array(z.string()),
  props: componentPartInfoSchema,
  slots: componentPartInfoSchema,
});

const universalFrontmatter = z.object({
  sourceUrl: z.string().url().optional(),
});

const componentFrontmatter = z.object({
  componentData: componentDocSchema.optional(),
  note: z.string().optional(),
});

export const collections = {
  acknowledgments: defineCollection({
    schema: acknowledgmentsSchema,
    type: "data",
  }),
  docs: defineCollection({
    schema: (ctx) =>
      docsSchema()(ctx).merge(universalFrontmatter).merge(componentFrontmatter),
  }),
  i18n: defineCollection({ schema: i18nSchema(), type: "data" }),
};
