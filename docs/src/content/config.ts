import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection, z } from 'astro:content';

// acknowledgments schema as delivered from pnpm
// license-checker-rseidelsohn is a good pnpm-agnostic alternative,
// but it has a slightly different schema
const acknowledgmentsSchema = z.record(
	z.array(
		z.object({
			author: z.string().optional(),
			description: z.string().optional(),
			homepage: z.string().optional(),
			license: z.string().min(1),
			name: z.string().min(1),
			path: z.string().min(1),
			version: z.string().min(1)
		})
	)
);

// component documentation schema
// must be kept in sync with ./scripts/generate-doc-data.ts

const componentJsDocRecordSchema = z.record(z.string());

const componentPartInfoSchema = z.array(
	z.object({
		doc: z.string(),
		jsDocs: componentJsDocRecordSchema,
		name: z.string(),
		type: z.string()
	})
);

const componentPropConditionSchema = z.record(z.union([z.boolean(), z.number(), z.string()]));

const componentDocSchema = z.object({
	doc: z.string(),
	dynamicProps: z
		.array(
			z.object({
				condition: componentPropConditionSchema,
				description: z.string(),
				props: componentPartInfoSchema
			})
		)
		.optional(),
	events: componentPartInfoSchema,
	jsDocs: componentJsDocRecordSchema.optional(),
	name: z.string(),
	path: z.string(),
	pathParts: z.array(z.string()),
	props: componentPartInfoSchema,
	slots: componentPartInfoSchema
});

const universalFrontmatter = z.object({
	sourceUrl: z.string().url().optional()
});

const componentFrontmatter = z.object({
	componentData: componentDocSchema.optional(),
	note: z.string().optional()
});

export const collections = {
	acknowledgments: defineCollection({
		schema: acknowledgmentsSchema,
		type: 'data'
	}),
	docs: defineCollection({
		schema: (ctx) => docsSchema()(ctx).merge(universalFrontmatter).merge(componentFrontmatter)
	}),
	i18n: defineCollection({ schema: i18nSchema(), type: 'data' })
};
