-- ═══════════════════════════════════════════════════════
-- Kamarob Nature Fund — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─────────────────────────────────────────────────────────
-- 1. USER PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  role        TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
  avatar_url  TEXT,
  bio         TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;


-- ─────────────────────────────────────────────────────────
-- 2. PROJECTS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  slug         TEXT        UNIQUE NOT NULL,
  description  TEXT,
  content      TEXT,                          -- Rich text / Markdown
  category     TEXT        NOT NULL DEFAULT 'general'
               CHECK (category IN ('forest', 'water', 'wildlife', 'ecotourism', 'community', 'general')),
  cover_image  TEXT,                          -- URL to Supabase Storage
  gallery      TEXT[],                        -- Array of image URLs
  published    BOOLEAN     NOT NULL DEFAULT FALSE,
  featured     BOOLEAN     NOT NULL DEFAULT FALSE,
  author_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  tags         TEXT[],
  views        INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Index for fast published lookup
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);


-- ─────────────────────────────────────────────────────────
-- 3. EXPEDITIONS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.expeditions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  slug           TEXT        UNIQUE NOT NULL,
  location       TEXT,                        -- e.g. "Kamarob Gorge, Rasht Valley"
  coordinates    POINT,                       -- lat/lng for map
  elevation_m    INTEGER,                     -- max elevation reached
  distance_km    NUMERIC(6,1),               -- trail distance
  duration_days  INTEGER,
  date           DATE,
  description    TEXT,
  content        TEXT,
  cover_image    TEXT,
  gallery        TEXT[],
  participants   INTEGER,
  published      BOOLEAN     NOT NULL DEFAULT FALSE,
  author_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER expeditions_updated_at
  BEFORE UPDATE ON public.expeditions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX IF NOT EXISTS idx_expeditions_published ON public.expeditions(published, date DESC);


-- ─────────────────────────────────────────────────────────
-- 4. CONTACT SUBMISSIONS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
  email       TEXT        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     TEXT,
  message     TEXT        NOT NULL CHECK (length(message) BETWEEN 10 AND 5000),
  ip_hash     TEXT,                           -- Hashed IP (privacy-preserving rate limit)
  status      TEXT        NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'read', 'replied', 'spam')),
  admin_note  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contact_submissions(status, created_at DESC);


-- ─────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.user_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expeditions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── user_profiles policies ──
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.user_profiles
  FOR ALL USING (public.is_admin());

-- ── projects policies ──
CREATE POLICY "Anyone can view published projects" ON public.projects
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- ── expeditions policies ──
CREATE POLICY "Anyone can view published expeditions" ON public.expeditions
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admins can manage all expeditions" ON public.expeditions
  FOR ALL USING (public.is_admin());

-- ── contact_submissions policies ──
CREATE POLICY "Anyone can insert contact" ON public.contact_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can read contacts" ON public.contact_submissions
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can update contacts" ON public.contact_submissions
  FOR UPDATE USING (public.is_admin());


-- ─────────────────────────────────────────────────────────
-- 6. STORAGE BUCKETS (run via Supabase Dashboard or API)
-- ─────────────────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('expedition-images', 'expedition-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', TRUE);


-- ─────────────────────────────────────────────────────────
-- 7. SEED: CREATE ADMIN ACCOUNT
-- After running this schema:
-- 1. Register at /auth.html with your email (amiralMahmud11@outlook.com)
-- 2. Confirm email via the link Supabase sends
-- 3. Then run:
-- ─────────────────────────────────────────────────────────
-- UPDATE public.user_profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'amiralMahmud11@outlook.com');


-- ─────────────────────────────────────────────────────────
-- 8. SAMPLE DATA (for demo / portfolio)
-- ─────────────────────────────────────────────────────────
INSERT INTO public.projects (title, slug, description, content, category, published, featured, tags) VALUES
(
  'Shukmak Spring Mapping 2024',
  'shukmak-spring-mapping-2024',
  'Complete hydrological survey of 17 natural springs above Shukmak village in the Kamarob watershed.',
  '## Overview

The Shukmak Spring Network project began in April 2024 when our team hiked to the ridgeline above Shukmak village (elevation 2,800 m) to conduct a full survey of the natural springs that feed the village water supply.

## Findings

We identified and GPS-mapped 17 active springs. Water quality tests confirmed all springs met WHO drinking water standards for the primary parameters (turbidity, pH, coliform bacteria). However, 3 springs showed elevated sediment levels consistent with upstream erosion — likely caused by the loss of vegetation cover on the southern slopes.

## Actions Taken

- Installed 4 protective fences around the most vulnerable springs
- Planted 800 native shrubs on eroded slopes above 3 springs
- Created an offline mapping dataset shared with Shukmak village council

## Next Steps

Annual re-testing scheduled for April 2025. We plan to install 3 basic water quality monitoring stations with data accessible to the village.',
  'water',
  TRUE,
  TRUE,
  ARRAY['water', 'springs', 'Shukmak', 'survey', 'Kamarob']
),
(
  'Highland Reforestation — Autumn 2024',
  'highland-reforestation-autumn-2024',
  '3-day planting expedition to the slopes above Kamarob Gorge. 1,200 juniper saplings planted at 2,600–2,900 m elevation.',
  '## The Mission

On October 3–5, 2024, a team of 28 volunteers from 6 countries assembled in Shukmak village before dawn and hiked 12 km into the gorge to reach the target planting zones — slopes that had been stripped bare by overgrazing over the past 30 years.

## The Work

Each volunteer carried 40–50 saplings (Juniperus seravschanica — native to Central Asia) in their pack, along with tools. Planting at this elevation is physically demanding: the soil is rocky and compacted, and the altitude means frequent rest stops.

Total planted: **1,247 saplings** across three slope zones. Survival rate from the 2023 planting (checked during this mission): **71%** — above our baseline target of 65%.

## Team

28 volunteers from Tajikistan, Germany, France, USA, Japan, Kazakhstan, and the UK.',
  'forest',
  TRUE,
  FALSE,
  ARRAY['reforestation', 'juniper', 'volunteers', 'Kamarob', 'autumn']
);

INSERT INTO public.expeditions (title, slug, location, elevation_m, distance_km, duration_days, date, description, published) VALUES
(
  'Kamarob Ridge — First Ascent Survey',
  'kamarob-ridge-first-ascent-2024',
  'Shukmak village to Kamarob ridge, Rasht Valley, Tajikistan',
  3020,
  24.0,
  3,
  '2024-08-15',
  'Three-day research expedition to document vegetation zones, spring sources, and wildlife signs along the main Kamarob ridge. Starting from Shukmak village (1,200 m), the team ascended to the ridge at 3,020 m — the highest point of the Kamarob Nature Fund field area.',
  TRUE
),
(
  'Kamarob Valley Winter Survey',
  'kamarob-valley-winter-2025',
  'Lower Kamarob Gorge, Rasht Valley, Tajikistan',
  1800,
  18.0,
  2,
  '2025-01-20',
  'First winter survey of the lower gorge to document snow leopard tracks, assess stream ice conditions, and check the survival of saplings planted in autumn 2024.',
  TRUE
);

-- Done. Schema ready.
SELECT 'Schema created successfully.' AS status;
