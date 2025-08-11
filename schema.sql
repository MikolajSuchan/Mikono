-- ==========================================
-- SCHEMA: Miikono (Supabase/Postgres)
-- ==========================================

-- 1. Tabela użytkowników (powiązana z auth.users Supabase)
create table if not exists accounts (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    created_at timestamp with time zone default now()
);

-- 2. Kategorie
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    owner_id uuid references accounts(id) on delete cascade
);

-- 3. Transakcje
create table if not exists transactions (
    id uuid primary key default gen_random_uuid(),
    transaction_name text not null,
    amount numeric(12, 2) not null,
    transaction_type text check (transaction_type in ('income', 'expense')) not null,
    transaction_date date not null,
    description text,
    category_id uuid references categories(id) on delete set null,
    owner_id uuid references accounts(id) on delete cascade
);

-- 4. Limity budżetowe
create table if not exists budget_limits (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references categories(id) on delete cascade,
    limit_amount numeric(12, 2) not null,
    period text check (period in ('daily', 'weekly', 'monthly', 'yearly')) not null
);

-- 5. Salda
create table if not exists balances (
    id uuid primary key default gen_random_uuid(),
    amount numeric(12, 2) not null default 0,
    owner_id uuid references accounts(id) on delete cascade
);

-- ==========================================
-- Indeksy dla wydajności
-- ==========================================
create index if not exists idx_transactions_owner on transactions(owner_id);
create index if not exists idx_categories_owner on categories(owner_id);
create index if not exists idx_budget_limits_category on budget_limits(category_id);
create index if not exists idx_balances_owner on balances(owner_id);
