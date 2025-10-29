CREATE TYPE "public"."team_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."template_category" AS ENUM('frontend', 'backend', 'fullstack', 'mobile', 'desktop', 'cli', 'other');--> statement-breakpoint
CREATE TYPE "public"."template_visibility" AS ENUM('private', 'team', 'public');--> statement-breakpoint
CREATE TYPE "public"."output_format" AS ENUM('download', 'github', 'gitlab');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"avatar" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "team_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp NOT NULL,
	"invited_by" text,
	CONSTRAINT "team_member_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"category" "template_category" DEFAULT 'other' NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text,
	"visibility" "template_visibility" DEFAULT 'private' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"stack" json NOT NULL,
	"variables" json DEFAULT '[]'::json NOT NULL,
	"file_structure" json NOT NULL,
	"tags" json DEFAULT '[]'::json,
	"readme" text,
	"downloads" integer DEFAULT 0 NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"forks" integer DEFAULT 0 NOT NULL,
	"current_version" text DEFAULT '1.0.0' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "template_star" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_version" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"version" text NOT NULL,
	"name" text,
	"description" text,
	"stack" json NOT NULL,
	"variables" json DEFAULT '[]'::json NOT NULL,
	"file_structure" json NOT NULL,
	"readme" text,
	"changelog" text,
	"is_latest" boolean DEFAULT true NOT NULL,
	"is_stable" boolean DEFAULT true NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user_id" text NOT NULL,
	"team_id" text,
	"template_id" text NOT NULL,
	"template_version_id" text,
	"generation_config" json NOT NULL,
	"variables" json DEFAULT '{}'::json NOT NULL,
	"status" "project_status" DEFAULT 'pending' NOT NULL,
	"job_id" text,
	"progress" json,
	"error_message" text,
	"error_details" json,
	"output_format" "output_format" NOT NULL,
	"repository_url" text,
	"download_url" text,
	"zip_path" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"duration" integer,
	"file_count" integer DEFAULT 0,
	"total_size" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"user_id" text NOT NULL,
	"download_count" integer DEFAULT 0,
	"last_downloaded_at" timestamp,
	"view_count" integer DEFAULT 0,
	"last_viewed_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_file" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"path" text NOT NULL,
	"content" text,
	"size" integer DEFAULT 0,
	"type" text DEFAULT 'file' NOT NULL,
	"executable" boolean DEFAULT false,
	"checksum" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template" ADD CONSTRAINT "template_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_star" ADD CONSTRAINT "template_star_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_star" ADD CONSTRAINT "template_star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_version" ADD CONSTRAINT "template_version_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_version" ADD CONSTRAINT "template_version_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_template_version_id_template_version_id_fk" FOREIGN KEY ("template_version_id") REFERENCES "public"."template_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_analytics" ADD CONSTRAINT "project_analytics_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_analytics" ADD CONSTRAINT "project_analytics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_file" ADD CONSTRAINT "project_file_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_team_slug" ON "team" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_team_name" ON "team" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_team_created_at" ON "team" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_team_member_team_id" ON "team_member" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "idx_team_member_user_id" ON "team_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_team_member_role" ON "team_member" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_team_member_joined_at" ON "team_member" USING btree ("joined_at");--> statement-breakpoint
CREATE INDEX "idx_template_name" ON "template" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_template_slug" ON "template" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_template_category" ON "template" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_template_visibility" ON "template" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "idx_template_user_id" ON "template" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_template_team_id" ON "template" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "idx_template_public" ON "template" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "idx_template_official" ON "template" USING btree ("is_official");--> statement-breakpoint
CREATE INDEX "idx_template_downloads" ON "template" USING btree ("downloads");--> statement-breakpoint
CREATE INDEX "idx_template_stars" ON "template" USING btree ("stars");--> statement-breakpoint
CREATE INDEX "idx_template_forks" ON "template" USING btree ("forks");--> statement-breakpoint
CREATE INDEX "idx_template_created_at" ON "template" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_template_updated_at" ON "template" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "idx_template_deleted_at" ON "template" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_template_tags" ON "template" USING gin ("tags");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_template_star_template_user" ON "template_star" USING btree ("template_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_template_star_template_id" ON "template_star" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_template_star_user_id" ON "template_star" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_template_star_created_at" ON "template_star" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_template_version_template_id" ON "template_version" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_template_version_version" ON "template_version" USING btree ("version");--> statement-breakpoint
CREATE INDEX "idx_template_version_latest" ON "template_version" USING btree ("is_latest");--> statement-breakpoint
CREATE INDEX "idx_template_version_stable" ON "template_version" USING btree ("is_stable");--> statement-breakpoint
CREATE INDEX "idx_template_version_created_by" ON "template_version" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_template_version_created_at" ON "template_version" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_template_version_template_latest" ON "template_version" USING btree ("template_id","is_latest");--> statement-breakpoint
CREATE INDEX "idx_project_user_id" ON "project" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_project_team_id" ON "project" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "idx_project_name" ON "project" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_project_template_id" ON "project" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "idx_project_template_version_id" ON "project" USING btree ("template_version_id");--> statement-breakpoint
CREATE INDEX "idx_project_status" ON "project" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_project_job_id" ON "project" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "idx_project_output_format" ON "project" USING btree ("output_format");--> statement-breakpoint
CREATE INDEX "idx_project_created_at" ON "project" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_project_started_at" ON "project" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_project_completed_at" ON "project" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "idx_project_duration" ON "project" USING btree ("duration");--> statement-breakpoint
CREATE INDEX "idx_project_file_count" ON "project" USING btree ("file_count");--> statement-breakpoint
CREATE INDEX "idx_project_total_size" ON "project" USING btree ("total_size");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_project_analytics_project_user" ON "project_analytics" USING btree ("project_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_project_id" ON "project_analytics" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_user_id" ON "project_analytics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_download_count" ON "project_analytics" USING btree ("download_count");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_view_count" ON "project_analytics" USING btree ("view_count");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_last_downloaded" ON "project_analytics" USING btree ("last_downloaded_at");--> statement-breakpoint
CREATE INDEX "idx_project_analytics_last_viewed" ON "project_analytics" USING btree ("last_viewed_at");--> statement-breakpoint
CREATE INDEX "idx_project_file_project_id" ON "project_file" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_project_file_path" ON "project_file" USING btree ("path");--> statement-breakpoint
CREATE INDEX "idx_project_file_type" ON "project_file" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_project_file_size" ON "project_file" USING btree ("size");--> statement-breakpoint
CREATE INDEX "idx_project_file_checksum" ON "project_file" USING btree ("checksum");