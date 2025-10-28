import { pgTable, text, timestamp, boolean, pgEnum, primaryKey, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// Role enum for team members
export const teamRoleEnum = pgEnum("team_role", ["owner", "admin", "member"]);

// Teams table
export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("idx_team_slug").on(table.slug),
  nameIdx: index("idx_team_name").on(table.name),
  createdAtIdx: index("idx_team_created_at").on(table.createdAt),
}));

// Team members junction table
export const teamMember = pgTable(
  "team_member",
  {
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: teamRoleEnum("role").notNull().default("member"),
    joinedAt: timestamp("joined_at")
      .$defaultFn(() => new Date())
      .notNull(),
    invitedBy: text("invited_by").references(() => user.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.userId] }),
    teamIdx: index("idx_team_member_team_id").on(table.teamId),
    userIdx: index("idx_team_member_user_id").on(table.userId),
    roleIdx: index("idx_team_member_role").on(table.role),
    joinedAtIdx: index("idx_team_member_joined_at").on(table.joinedAt),
  })
);

// Relations
export const teamRelations = relations(team, ({ many }) => ({
  members: many(teamMember),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
  inviter: one(user, {
    fields: [teamMember.invitedBy],
    references: [user.id],
  }),
}));

// Types
export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert;
export type TeamMember = typeof teamMember.$inferSelect;
export type NewTeamMember = typeof teamMember.$inferInsert;