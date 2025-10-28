# LaunchPad Database Schema Documentation

This document describes the complete database schema for LaunchPad - Boilerplate-as-a-Service platform.

## Overview

The database consists of the following main components:
- **Authentication**: Users, sessions, accounts, and verification (from Better Auth)
- **Teams**: Team management with role-based access control
- **Templates**: Template storage with versioning and metadata
- **Projects**: Project generation tracking and analytics

## Tables

### Authentication Tables (`auth.ts`)

These tables are provided by Better Auth for authentication and session management.

#### `user`
- **id**: Primary key (text)
- **name**: User's display name
- **email**: User's email (unique)
- **emailVerified**: Boolean flag for email verification
- **image**: Profile image URL
- **createdAt/updatedAt**: Timestamps

#### `session`
- **id**: Primary key (text)
- **userId**: Foreign key to user
- **token**: Session token (unique)
- **expiresAt**: Session expiration
- **ipAddress/userAgent**: Session metadata

#### `account`
- **id**: Primary key (text)
- **userId**: Foreign key to user
- **providerId/providerName**: OAuth provider info
- **accessToken/refreshToken**: OAuth tokens
- **createdAt/updatedAt**: Timestamps

### Team Management (`teams.ts`)

#### `team`
Stores team information for collaborative template management.

**Columns:**
- `id`: Primary key (text)
- `name`: Team display name
- `slug`: URL-friendly unique identifier
- `description`: Team description
- `avatar`: Team avatar URL
- `createdAt/updatedAt`: Timestamps

**Indexes:**
- `idx_team_slug`: Unique index on slug
- `idx_team_name`: Index on name
- `idx_team_created_at`: Index on creation time

#### `team_member`
Junction table for team membership with role-based access control.

**Columns:**
- `teamId`: Foreign key to team (part of composite primary key)
- `userId`: Foreign key to user (part of composite primary key)
- `role`: Member role (owner/admin/member)
- `joinedAt`: When user joined the team
- `invitedBy`: Who invited this user

**Roles:**
- `owner`: Full control over team
- `admin`: Can manage templates and members
- `member`: Can use team templates

**Indexes:**
- Composite primary key on (teamId, userId)
- `idx_team_member_team_id`: Index on teamId
- `idx_team_member_user_id`: Index on userId
- `idx_team_member_role`: Index on role

### Template Management (`templates.ts`)

#### `template`
Core table for storing project templates.

**Columns:**
- `id`: Primary key (text)
- `name`: Template display name
- `slug`: URL-friendly identifier
- `description`: Template description
- `category`: Template category (frontend/backend/fullstack/etc.)
- `userId`: Owner user ID
- `teamId`: Owning team (optional)
- `visibility`: Access level (private/team/public)
- `isPublic`: Boolean flag for public templates
- `isOfficial`: Official LaunchPad templates
- `stack`: JSON object with stack configuration
- `variables`: JSON array of template variables
- `fileStructure`: JSON array of template files
- `tags`: JSON array of searchable tags
- `readme`: Template README content
- `downloads/stars/forks`: Usage statistics
- `currentVersion`: Current version string
- `createdAt/updatedAt`: Timestamps
- `deletedAt`: Soft delete timestamp

**Stack Configuration:**
```typescript
interface StackConfig {
  framework?: string;    // Next.js, Express, NestJS, etc.
  language?: string;     // TypeScript, Python, Go, etc.
  database?: string;     // PostgreSQL, MongoDB, etc.
  styling?: string;      // Tailwind, Styled Components, etc.
  testing?: string[];    // Jest, Cypress, Vitest, etc.
  deployment?: string[]; // Vercel, Netlify, AWS, etc.
}
```

**Template Variables:**
```typescript
interface TemplateVariable {
  name: string;
  type: "string" | "number" | "boolean" | "select";
  description?: string;
  required: boolean;
  default?: string | number | boolean;
  options?: string[]; // for select type
}
```

**File Structure:**
```typescript
interface TemplateFile {
  path: string;
  content: string;
  type: "file" | "directory";
  executable?: boolean;
}
```

**Indexes:**
- Search indexes: name, slug, category, visibility, tags (GIN)
- Ownership indexes: userId, teamId
- Sorting indexes: downloads, stars, created_at
- Soft delete index: deleted_at

#### `template_star`
Tracks user favorites/bookmarks for templates.

**Columns:**
- `id`: Primary key (text)
- `templateId`: Foreign key to template
- `userId`: Foreign key to user
- `createdAt`: Timestamp when starred

**Indexes:**
- Unique composite index on (templateId, userId)
- Individual indexes on templateId and userId

#### `template_version`
Stores version history for templates.

**Columns:**
- `id`: Primary key (text)
- `templateId`: Foreign key to template
- `version`: Semantic version string
- `name`: Version display name
- `description`: Version description
- `stack/variables/fileStructure`: Version-specific data
- `readme/changelog`: Version documentation
- `isLatest`: Boolean flag for latest version
- `isStable`: Boolean flag for stable versions
- `createdBy`: User who created this version
- `createdAt`: Creation timestamp

**Indexes:**
- `idx_template_version_template_id`: Template reference
- `idx_template_version_version`: Version lookup
- `idx_template_version_latest`: Latest version filter
- Unique composite index on (templateId, isLatest)

### Project Management (`projects.ts`)

#### `project`
Tracks project generation attempts and status.

**Columns:**
- `id`: Primary key (text)
- `name`: Generated project name
- `description`: Project description
- `userId/teamId`: Ownership information
- `templateId/templateVersionId`: Template reference
- `generationConfig`: JSON configuration for generation
- `variables`: JSON object of user-provided values
- `status`: Generation status (pending/processing/completed/failed/cancelled)
- `jobId`: BullMQ job identifier (unique)
- `progress`: JSON object with generation progress
- `errorMessage/errorDetails`: Error information
- `outputFormat`: Output type (download/github/gitlab)
- `repositoryUrl/downloadUrl/zipPath`: Output information
- `startedAt/completedAt/duration`: Timing information
- `fileCount/totalSize`: Generation statistics
- `createdAt/updatedAt`: Timestamps

**Generation Configuration:**
```typescript
interface GenerationConfig {
  templateId: string;
  templateVersion?: string;
  variables: Record<string, any>;
  outputFormat: "download" | "github" | "gitlab";
  repositoryConfig?: {
    name: string;
    description?: string;
    private: boolean;
    owner?: string;
  };
}
```

**Job Progress:**
```typescript
interface JobProgress {
  stage: string;
  progress: number; // 0-100
  message?: string;
  details?: any;
}
```

**Indexes:**
- Ownership indexes: userId, teamId, name
- Template reference indexes: templateId, templateVersionId
- Status tracking: status, jobId (unique)
- Timing indexes: created_at, started_at, completed_at, duration
- Statistics indexes: file_count, total_size

#### `project_file`
Stores information about generated files.

**Columns:**
- `id`: Primary key (text)
- `projectId`: Foreign key to project
- `path`: File path within project
- `content`: File content (for small files)
- `size`: File size in bytes
- `type`: File type (file/directory)
- `executable`: Executable flag
- `checksum`: File integrity checksum
- `createdAt`: Creation timestamp

**Indexes:**
- `idx_project_file_project_id`: Project reference
- `idx_project_file_path`: Path lookup
- `idx_project_file_type`: Type filter
- `idx_project_file_size`: Size sorting

#### `project_analytics`
Tracks usage analytics for generated projects.

**Columns:**
- `id`: Primary key (text)
- `projectId`: Foreign key to project
- `userId`: User accessing the project
- `downloadCount`: Number of downloads
- `lastDownloadedAt`: Last download timestamp
- `viewCount`: Number of views
- `lastViewedAt`: Last view timestamp
- `createdAt/updatedAt`: Timestamps

**Indexes:**
- Unique composite index on (projectId, userId)
- Individual indexes on projectId, userId
- Analytics indexes: download_count, view_count, last_downloaded_at, last_viewed_at

## Relationships

### User Relationships
- `user` 1:N `team_member` (users can be members of multiple teams)
- `user` 1:N `template` (users own templates)
- `user` 1:N `template_star` (users star templates)
- `user` 1:N `template_version` (users create template versions)
- `user` 1:N `project` (users generate projects)
- `user` 1:N `project_analytics` (users interact with projects)

### Team Relationships
- `team` 1:N `team_member` (teams have multiple members)
- `team` 1:N `template` (teams own templates)
- `team` 1:N `project` (teams generate projects)

### Template Relationships
- `template` 1:N `template_star` (templates have multiple stars)
- `template` 1:N `template_version` (templates have version history)
- `template` 1:N `project` (templates are used for projects)

### Project Relationships
- `project` 1:N `project_file` (projects contain multiple files)
- `project` 1:N `project_analytics` (projects have analytics data)

## Index Strategy

### Performance Indexes
- **Foreign Keys**: All foreign key columns are indexed
- **Search**: Name, slug, category, tags are indexed for search
- **Sorting**: Created_at, downloads, stars for popular sorting
- **Filtering**: Status, visibility, role for common filters

### Unique Constraints
- `user.email`: Unique email addresses
- `team.slug`: Unique team slugs
- `template.slug`: Unique template slugs
- `project.jobId`: Unique job identifiers
- Composite keys for junction tables

### Special Indexes
- **GIN Index**: Template tags for efficient array searching
- **Partial Indexes**: Can be added for common filtered queries
- **Composite Indexes**: Optimized for common query patterns

## Data Integrity

### Constraints
- **Foreign Key Constraints**: All relationships maintain referential integrity
- **Cascade Deletes**: Related records are cleaned up automatically
- **Check Constraints**: Enum values ensure data validity
- **Not Null**: Required fields are enforced

### Soft Deletes
- `template.deletedAt`: Templates are soft-deleted
- Preserves data integrity while allowing recovery
- Filtered out of default queries

## Security Considerations

### Access Control
- Team-based ownership model
- Role-based permissions within teams
- Public/private/team visibility levels

### Data Privacy
- User data isolated by user_id
- Team data isolated by team_id
- OAuth tokens encrypted in account table

## Migration Notes

When migrating to production:
1. Create indexes after initial data load for performance
2. Consider partitioning large tables (projects, project_files)
3. Set up proper backup strategies
4. Configure connection pooling
5. Monitor query performance and adjust indexes as needed

## Future Enhancements

### Potential Additions
- Template categories hierarchy
- Template dependencies
- Custom domains for teams
- Project sharing and collaboration
- Advanced analytics and reporting
- Template marketplace features

### Scaling Considerations
- Read replicas for analytics queries
- Caching layer for popular templates
- CDN for file downloads
- Background job queue scaling