-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.models (
  id uuid NOT NULL DEFAULT extensions.gen_random_uuid(),
  name text NOT NULL,
  description text,
  model_path text NOT NULL,
  thumbnail_path text NOT NULL,
  updated_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT models_pkey PRIMARY KEY (id)
);
CREATE TABLE public.placed_objects (
  id uuid NOT NULL DEFAULT extensions.gen_random_uuid(),
  user_id uuid NOT NULL,
  model_id uuid NOT NULL,
  vps_location_id uuid NOT NULL,
  position jsonb NOT NULL,
  rotation jsonb NOT NULL,
  scale jsonb NOT NULL,
  updated_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT placed_objects_pkey PRIMARY KEY (id),
  CONSTRAINT placed_objects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT placed_objects_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id),
  CONSTRAINT placed_objects_vps_location_id_fkey FOREIGN KEY (vps_location_id) REFERENCES public.vps_locations(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  avatar_url text,
  updated_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.vps_locations (
  id uuid NOT NULL DEFAULT extensions.gen_random_uuid(),
  name text NOT NULL,
  description text,
  eighth_wall_vps_id text NOT NULL UNIQUE,
  latitude numeric,
  longitude numeric,
  updated_at timestamp without time zone DEFAULT now(),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT vps_locations_pkey PRIMARY KEY (id)
);