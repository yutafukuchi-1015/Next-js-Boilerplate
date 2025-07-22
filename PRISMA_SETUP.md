# Prisma Postgres Setup for Production Deployment

This project has been migrated from PGlite + Drizzle ORM to Prisma ORM with Prisma Postgres for production deployment on Vercel.

## What Changed

### Database Migration
- **From**: PGlite (local SQLite-like database) + Drizzle ORM
- **To**: Prisma Postgres (cloud PostgreSQL) + Prisma ORM

### Files Modified
- `src/libs/DB.ts` - Updated to use Prisma client
- `src/libs/prisma.ts` - New Prisma client configuration with Accelerate
- `src/app/[locale]/(marketing)/counter/actions.ts` - Updated database operations to use Prisma
- `src/app/[locale]/(marketing)/counter/actions.test.ts` - Updated tests for Prisma
- `package.json` - Updated scripts and dependencies
- `prisma/schema.prisma` - Database schema definition
- `prisma/seed.ts` - Database seeding script

## Setup Instructions

### 1. Set up Prisma Postgres Database

You need to create a Prisma Postgres database for production:

1. Go to [Prisma Console](https://console.prisma.io)
2. Sign up or log in to your account
3. Create a new project
4. Create a new Prisma Postgres database
5. Copy the connection string

### 2. Update Environment Variables

Update your `.env` file with the Prisma Postgres connection string:

```env
# Replace with your actual Prisma Postgres connection string
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Deploy Database Schema

For production deployment, the schema will be automatically applied. For local development with a real database:

```bash
npm run db:migrate
```

### 5. Seed the Database (Optional)

```bash
npm run db:seed
```

## Development

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Deployment to Vercel

### 1. Environment Variables in Vercel

Add the following environment variable in your Vercel project settings:

- `DATABASE_URL`: Your Prisma Postgres connection string

### 2. Deploy

The project is configured to automatically:
- Generate Prisma client during build (`postinstall` script)
- Use Prisma Accelerate for connection pooling
- Work with Vercel's serverless environment

Simply deploy to Vercel as usual:

```bash
vercel --prod
```

## Key Features

### Prisma Accelerate
- Connection pooling for serverless environments
- Global caching for improved performance
- Optimized for Vercel deployment

### Database Schema
The current schema includes:
- `Counter` model with auto-incrementing ID
- Timestamps for created/updated tracking
- Mapped to existing table structure

### Production Ready
- No query engine bundled (uses Prisma Accelerate)
- Optimized for serverless deployment
- Automatic client generation during build

## Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations (development)
- `npm run db:deploy` - Deploy migrations (production)
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## Troubleshooting

### Build Issues
If you encounter build issues, ensure:
1. `DATABASE_URL` is properly set
2. Prisma client is generated: `npm run db:generate`
3. Dependencies are installed: `npm install`

### Database Connection Issues
- Verify your Prisma Postgres connection string
- Check that the database is accessible from your deployment environment
- Ensure API key has proper permissions

## Migration Notes

The migration preserves the existing counter functionality while providing:
- Better production scalability
- Improved connection handling
- Type-safe database operations
- Built-in connection pooling
