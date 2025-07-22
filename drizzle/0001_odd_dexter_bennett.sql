CREATE TABLE "dir" (
	"id" serial PRIMARY KEY NOT NULL,
	"asin" varchar(255) NOT NULL,
	"dircription" varchar(700),
	"user_id" integer
);
--> statement-breakpoint
ALTER TABLE "dir" ADD CONSTRAINT "dir_asin_products_asin_fk" FOREIGN KEY ("asin") REFERENCES "public"."products"("asin") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dir" ADD CONSTRAINT "dir_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;