SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA app;

ALTER SCHEMA app OWNER TO postgres;

CREATE TABLE app.users (
    user_id text NOT NULL,
    created_at timestamp DEFAULT now(),
    user_name text NOT NULL,
    random_word text NOT NULL
);

CREATE TABLE app.items (
    item_id text NOT NULL,
    created_at timestamp DEFAULT now(),
    user_id text NOT NULL,
    item_name text NOT NULL,
    random_word text NOT NULL
);