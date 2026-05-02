CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"age" integer,
	"gender" text,
	"language" text DEFAULT 'en' NOT NULL,
	"health_streak" integer DEFAULT 0 NOT NULL,
	"arogya_score" integer DEFAULT 0 NOT NULL,
	"last_check_date" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "health_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symptoms" text NOT NULL,
	"lifestyle" text,
	"severity" text NOT NULL,
	"analysis" text NOT NULL,
	"arogya_score" integer DEFAULT 0 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wellness_tips" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title_en" text NOT NULL,
	"title_hi" text NOT NULL,
	"title_gu" text NOT NULL,
	"content_en" text NOT NULL,
	"content_hi" text NOT NULL,
	"content_gu" text NOT NULL,
	"icon" text DEFAULT '💡' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" text DEFAULT 'ai_analysis' NOT NULL,
	"window_start" timestamp DEFAULT now() NOT NULL,
	"request_count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "health_reports" ADD CONSTRAINT "health_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;