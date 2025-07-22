// db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  USERS                                                             */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  PRODUCTS (one row per unique product URL / ASIN)                  */
/* ------------------------------------------------------------------ */
export const products = pgTable(
  "products",
  {
    productId: serial("product_id").primaryKey(),

    /** OPTIONAL: remove if you store e‑mail only in user_products */
    email: varchar("email", { length: 256 }),

    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull().unique(),
    image: varchar("image", { length: 1024 }),
    asin: varchar("asin", { length: 256 }).notNull().unique(),

    platform: varchar("platform", { length: 50 }).notNull(), // "amazon", "flipkart", "myntra"
    platformProductId: varchar("platform_product_id", { length: 100 }),

    currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),

    priceString: varchar("price_string", { length: 100 }),
    stars: decimal("stars", { precision: 3, scale: 2 }),
    totalReviews: integer("total_reviews"),

    hasPrime: boolean("has_prime").default(false),
    isBestSeller: boolean("is_best_seller").default(false),
    isAmazonChoice: boolean("is_amazon_choice").default(false),
    isFkAssured: boolean("is_fk_assured").default(false),
    status: boolean('status').default(true),
    lastUpdated: timestamp("last_updated").defaultNow(),
  },
  table => ({
    platformProductIdIdx: index("products_platform_product_id_idx").on(table.platformProductId),
  }),
);



/* ------------------------------------------------------------------ */
/*  PRICE HISTORY (point‑in‑time snapshots)                           */
/* ------------------------------------------------------------------ */
export const priceHistory = pgTable(
  "price_history",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(), // ✅ this stays same
    asin: varchar("asin", { length: 255 })
      .notNull()
      .references(() => products.asin, { onDelete: "cascade" }),
    trackedAt: timestamp("tracked_at").defaultNow().notNull(),
    currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    platform: varchar("platform", { length: 50 }),
    userId: integer("user_id").references(() => users.userId, { onDelete: "set null" }),
  },
  (table) => ({
    asinTrackedAtIdx: index("price_history_asin_tracked_at_idx").on(table.asin, table.trackedAt),
  })
);


/* ------------------------------------------------------------------ */
/*  NOTIFICATION SETTINGS / LOG                                       */
/* ------------------------------------------------------------------ */
export const notificationSettings = pgTable(
  "notification_settings",
  {
    id: serial("id").primaryKey(),

    email: varchar("email", { length: 255 }).notNull(),
    asin: varchar("asin", { length: 255 }) .notNull()
      .references(() => products.asin, { onDelete: "cascade" }),

    frequency: integer("frequency").default(3).notNull(), // in hours
    lastUpdated: timestamp("last_updated").defaultNow(),

    status: boolean("status").default(true), // if alerts are enabled
    currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),

    // Optional but helpful: link to users/products table for constraints
    userId: integer("user_id").references(() => users.userId, { onDelete: "cascade" }),
  },
  table => ({
    userAsinIndex: index("notification_user_asin_idx").on(table.email, table.asin),
  })
);

/* ------------------------------------------------------------------ */
/*  context / userContext                                       */
/* ------------------------------------------------------------------ */

export const context = pgTable('context', {
  id: serial('id').primaryKey(),          // auto-incrementing integer ID
  userId: integer('user_id').notNull(),   // integer user ID
  email: text('email').notNull(),         // email as text
  name: text('name').notNull(),           // name as text
  frequency: integer('frequency').default(3).notNull(), // frequency defaulting to 2
});
