CREATE TABLE "context" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"frequency" integer DEFAULT 3 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"asin" varchar(255) NOT NULL,
	"frequency" integer DEFAULT 3 NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"status" boolean DEFAULT true,
	"current_price" numeric(10, 2) NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"asin" varchar(255) NOT NULL,
	"tracked_at" timestamp DEFAULT now() NOT NULL,
	"current_price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"platform" varchar(50),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256),
	"name" varchar(256) NOT NULL,
	"url" varchar(1024) NOT NULL,
	"image" varchar(1024),
	"asin" varchar(256) NOT NULL,
	"platform" varchar(50) NOT NULL,
	"platform_product_id" varchar(100),
	"current_price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"price_string" varchar(100),
	"stars" numeric(3, 2),
	"total_reviews" integer,
	"has_prime" boolean DEFAULT false,
	"is_best_seller" boolean DEFAULT false,
	"is_amazon_choice" boolean DEFAULT false,
	"is_fk_assured" boolean DEFAULT false,
	"status" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "products_url_unique" UNIQUE("url"),
	CONSTRAINT "products_asin_unique" UNIQUE("asin")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(150) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_asin_products_asin_fk" FOREIGN KEY ("asin") REFERENCES "public"."products"("asin") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_asin_products_asin_fk" FOREIGN KEY ("asin") REFERENCES "public"."products"("asin") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notification_user_asin_idx" ON "notification_settings" USING btree ("email","asin");--> statement-breakpoint
CREATE INDEX "price_history_asin_tracked_at_idx" ON "price_history" USING btree ("asin","tracked_at");--> statement-breakpoint
CREATE INDEX "products_platform_product_id_idx" ON "products" USING btree ("platform_product_id");