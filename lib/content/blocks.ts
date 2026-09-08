import { z } from "zod";

export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("image"),
    url: z.string().min(1),
    alt: z.string().default(""),
    caption: z.string().optional(),
    layout: z.enum(["full", "wide"]).default("wide"),
  }),
  z.object({
    type: z.literal("gallery"),
    images: z
      .array(
        z.object({
          url: z.string().min(1),
          alt: z.string().default(""),
        }),
      )
      .min(1),
  }),
  z.object({
    type: z.literal("imageText"),
    heading: z.string().optional(),
    text: z.string().min(1),
    image: z.string().min(1),
    side: z.enum(["left", "right"]).default("left"),
  }),
  z.object({
    type: z.literal("quote"),
    text: z.string().min(1),
    attribution: z.string().optional(),
  }),
]);

export type ArticleBlock = z.infer<typeof articleBlockSchema>;

export const articleBlocksSchema = z.array(articleBlockSchema);
