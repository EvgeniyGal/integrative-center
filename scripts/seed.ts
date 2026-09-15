import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed");
  }

  const bcrypt = (await import("bcryptjs")).default;
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const {
    articles,
    productCategories,
    questions,
    recommendedProducts,
    services,
    supplementBrands,
    testimonials,
    users,
  } = await import("../lib/db/schema");
  const { homeNews, homeQuestions, reviews } = await import("../lib/site");
  const { homeServices, wellnessServices } = await import("../lib/services");

  async function seedAdmin() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn(
        "Skipping admin seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD",
      );
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existing) {
      await db
        .update(users)
        .set({
          passwordHash,
          role: "admin",
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
      console.log(`Updated seed admin: ${email}`);
      return;
    }

    await db.insert(users).values({
      email: email.toLowerCase(),
      name: "Admin",
      passwordHash,
      role: "admin",
      status: "active",
      emailVerified: new Date(),
    });
    console.log(`Created seed admin: ${email}`);
  }

  async function seedQuestions() {
    const existing = await db.select().from(questions).limit(1);
    if (existing.length > 0) {
      console.log("Questions already seeded");
      return;
    }

    await db.insert(questions).values(
      homeQuestions.items.map((item, index) => ({
        question: item.question,
        answer: item.answer,
        sortOrder: index,
        published: true,
      })),
    );
    console.log(`Seeded ${homeQuestions.items.length} questions`);
  }

  async function seedServices() {
    const existing = await db.select().from(services).limit(1);
    if (existing.length > 0) {
      console.log("Services already seeded");
      return;
    }

    const homeSlugs = new Set(homeServices.map((s) => s.slug));
    const bySlug = new Map<
      string,
      {
        slug: string;
        title: string;
        eyebrow: string;
        summary: string;
        body: string[];
        imageUrl: string;
        showOnHome: boolean;
        sortOrder: number;
      }
    >();

    wellnessServices.forEach((service, index) => {
      bySlug.set(service.slug, {
        slug: service.slug,
        title: service.title,
        eyebrow: service.eyebrow,
        summary: service.summary,
        body: service.body,
        imageUrl: service.image,
        showOnHome: homeSlugs.has(service.slug),
        sortOrder: index,
      });
    });

    homeServices.forEach((service, index) => {
      if (!bySlug.has(service.slug)) {
        bySlug.set(service.slug, {
          slug: service.slug,
          title: service.title,
          eyebrow: service.eyebrow,
          summary: service.summary,
          body: service.body,
          imageUrl: service.image,
          showOnHome: true,
          sortOrder: wellnessServices.length + index,
        });
      } else {
        const current = bySlug.get(service.slug)!;
        current.showOnHome = true;
      }
    });

    const rows = Array.from(bySlug.values()).map((row, index) => ({
      ...row,
      sortOrder: index,
      visible: true,
    }));

    await db.insert(services).values(rows);
    console.log(`Seeded ${rows.length} services`);
  }

  async function seedTestimonials() {
    const existing = await db.select().from(testimonials).limit(1);
    if (existing.length > 0) {
      console.log("Testimonials already seeded");
      return;
    }

    await db.insert(testimonials).values(
      reviews.map((review, index) => ({
        title: review.title,
        quote: review.quote,
        name: review.name,
        source: review.source,
        sortOrder: index,
        published: true,
      })),
    );
    console.log(`Seeded ${reviews.length} testimonials`);
  }

  async function seedArticles() {
    const existing = await db.select().from(articles).limit(1);
    if (existing.length > 0) {
      console.log("Articles already seeded");
      return;
    }

    await db.insert(articles).values(
      homeNews.items.map((item) => ({
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        coverImageUrl: item.image,
        category: item.label,
        status: "published",
        featuredOnHome: true,
        publishedAt: new Date(),
        seoTitle: item.title,
        seoDescription: item.excerpt,
        tags: [item.label],
        blocks: [
          { type: "paragraph" as const, text: item.excerpt },
          {
            type: "heading" as const,
            level: 2 as const,
            text: "More from the practice",
          },
          {
            type: "paragraph" as const,
            text: "We will continue expanding this article with clinic insights and practical guidance.",
          },
        ],
      })),
    );
    console.log(`Seeded ${homeNews.items.length} articles`);
  }

  async function seedSupplementBrands() {
    const existing = await db.select().from(supplementBrands).limit(1);
    if (existing.length > 0) {
      console.log("Supplement brands already seeded");
      return;
    }

    const brands = [
      {
        logoUrl: "/images/logo.png",
        title: "EVEXIAS Hormone Support",
        description: "Personalized hormone support formulations",
        discountText: null,
        referralLink: "https://hbintegrative.com/",
        ctaLabel: "VISIT EVEXIAS",
      },
      {
        logoUrl: "/images/logo.png",
        title: "Designs for Health",
        description: "Practitioner-grade nutraceuticals",
        discountText: "10% OFF with code HBIC10",
        referralLink: "https://hbintegrative.com/",
        ctaLabel: "VISIT DESIGNS FOR HEALTH",
      },
      {
        logoUrl: "/images/logo.png",
        title: "Pure Encapsulations",
        description: "Pure, hypoallergenic supplements",
        discountText: "10% OFF with code HBIC10",
        referralLink: "https://hbintegrative.com/",
        ctaLabel: "VISIT PURE ENCAPSULATIONS",
      },
      {
        logoUrl: "/images/logo.png",
        title: "BEAM Minerals",
        description: "Plant-based liquid mineral formulas",
        discountText: "20% OFF with code BEAM20",
        referralLink: "https://hbintegrative.com/",
        ctaLabel: "VISIT BEAM MINERALS",
      },
      {
        logoUrl: "/images/logo.png",
        title: "CellCore Biosciences Detox",
        description: "Advanced detoxification protocols",
        discountText: null,
        referralLink: "https://hbintegrative.com/",
        ctaLabel: "VISIT CELLCORE",
      },
    ];

    await db.insert(supplementBrands).values(
      brands.map((brand, index) => ({
        ...brand,
        sortOrder: index,
        published: true,
      })),
    );
    console.log(`Seeded ${brands.length} supplement brands`);
  }

  async function seedProductCategories() {
    const existing = await db.select().from(productCategories).limit(1);
    if (existing.length > 0) {
      console.log("Product categories already seeded");
      return;
    }

    const names = [
      "Daily Wellness",
      "Sleep Support",
      "Digestion & Gut Health",
      "Immune Support",
      "Energy & Focus",
      "Recovery & Hydration",
    ];

    await db.insert(productCategories).values(
      names.map((name, index) => ({
        name,
        sortOrder: index,
        published: true,
      })),
    );
    console.log(`Seeded ${names.length} product categories`);
  }

  async function seedRecommendedProducts() {
    const existing = await db.select().from(recommendedProducts).limit(1);
    if (existing.length > 0) {
      console.log("Recommended products already seeded");
      return;
    }

    const categoryRows = await db.select().from(productCategories);
    if (categoryRows.length === 0) {
      console.warn("Skipping products seed: no categories available");
      return;
    }

    const products = [
      {
        category: "Daily Wellness",
        imageUrl: "/images/generated/nutrition.jpg",
        title: "Magnesium Glycinate",
        description: "Gentle magnesium for relaxation and muscle support",
        referralLink: "https://www.amazon.com/",
        storeLogoUrl: "/images/amazon.svg",
        ctaLabel: "VIEW ON AMAZON",
      },
      {
        category: "Recovery & Hydration",
        imageUrl: "/images/generated/iv.jpg",
        title: "Electrolyte Drops",
        description: "Hydration support for daily energy and recovery",
        referralLink: "https://www.amazon.com/",
        storeLogoUrl: "/images/amazon.svg",
        ctaLabel: "VIEW ON AMAZON",
      },
      {
        category: "Daily Wellness",
        imageUrl: "/images/generated/care.jpg",
        title: "Pill Organizer",
        description: "Stay consistent with your supplement routine",
        referralLink: "https://www.amazon.com/",
        storeLogoUrl: "/images/amazon.svg",
        ctaLabel: "VIEW ON AMAZON",
      },
      {
        category: "Daily Wellness",
        imageUrl: "/images/generated/weight.jpg",
        title: "Digital Body Weight Scale",
        description: "Track progress as part of your wellness plan",
        referralLink: "https://www.amazon.com/",
        storeLogoUrl: "/images/amazon.svg",
        ctaLabel: "VIEW ON AMAZON",
      },
    ];

    await db.insert(recommendedProducts).values(
      products.map((product, index) => ({
        ...product,
        sortOrder: index,
        published: true,
      })),
    );
    console.log(`Seeded ${products.length} recommended products`);
  }

  await seedAdmin();
  await seedQuestions();
  await seedServices();
  await seedTestimonials();
  await seedArticles();
  await seedSupplementBrands();
  await seedProductCategories();
  await seedRecommendedProducts();
  console.log("Seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
