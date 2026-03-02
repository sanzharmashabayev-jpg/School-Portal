# Supabase Setup for School Portal

Data (news, events, polls, announcements) is now stored in Supabase so it syncs across all devices and users.

## 1. Run the migration

1. Go to [Supabase Dashboard](https://app.supabase.com) → your project
2. Open **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the query

## 2. Enable Realtime (optional)

If the `ALTER PUBLICATION` lines fail (e.g. "table already in publication"):

1. Go to **Database** → **Replication**
2. Add `news`, `events`, `polls`, `announcements` to the `supabase_realtime` publication

## 3. Environment variables

Ensure your `.env` has:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Admin login

- **Test admin** (no Supabase auth): `admin@admin.school.ru` / `admin123456`
- **Real admin**: Create a user in Supabase Auth with `user_metadata.role = 'admin'` or email ending in `@admin.school.ru`
