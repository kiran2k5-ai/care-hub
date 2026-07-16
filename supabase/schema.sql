create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient', 'doctor', 'admin')),
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patient_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  date_of_birth date,
  gender text check (gender in ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  blood_group text,
  allergies text[] not null default '{}',
  emergency_contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  specialty text not null,
  qualifications text,
  experience_years int not null default 0,
  consultation_fee numeric(10, 2) not null default 0,
  clinic_address text not null,
  bio text not null,
  available_days text[] not null default '{monday,tuesday,wednesday,thursday,friday}',
  available_hours text not null default '09:00-17:00',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (doctor_id, weekday, start_time, end_time)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctor_profiles(id) on delete cascade,
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  scheduled_at timestamptz not null,
  reason text not null,
  status text not null check (status in ('pending', 'accepted', 'declined', 'waiting', 'cancelled', 'completed')) default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patient_profiles(id) on delete cascade,
  doctor_id uuid references public.doctor_profiles(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  title text not null,
  file_name text not null,
  file_url text not null,
  storage_path text,
  mime_type text not null,
  document_type text not null check (document_type in ('Medical Report', 'Prescription', 'Lab Report')) default 'Medical Report',
  notes text,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Note: creating storage buckets via SQL may fail depending on your project permissions.
-- It's safer to create the 'medical-reports' bucket from the Supabase dashboard Storage UI.
-- If you prefer SQL, uncomment and run the block below in a project where the storage schema exists.
--
-- insert into storage.buckets (id, name, public)
-- values ('medical-reports', 'medical-reports', false)
-- on conflict (id) do nothing;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text := coalesce(new.raw_user_meta_data ->> 'role', 'patient');
  user_full_name text := coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'New user');
begin
  insert into public.profiles (id, role, full_name, email)
  values (new.id, user_role, user_full_name, new.email)
  on conflict (id) do update
    set role = excluded.role,
        full_name = excluded.full_name,
        email = excluded.email;

  if user_role = 'patient' then
    insert into public.patient_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  elsif user_role = 'doctor' then
    insert into public.doctor_profiles (id, specialty, qualifications, experience_years, consultation_fee, clinic_address, bio, available_days, available_hours)
    values (
      new.id,
      'General Medicine',
      'To be updated',
      0,
      0,
      'To be updated',
      'Profile pending completion.',
      '{monday,tuesday,wednesday,thursday,friday}',
      '09:00-17:00'
    )
    on conflict (id) do nothing;

    insert into public.doctor_availability (doctor_id, weekday, start_time, end_time)
    values
      (new.id, 1, '09:00', '17:00'),
      (new.id, 2, '09:00', '17:00'),
      (new.id, 3, '09:00', '17:00'),
      (new.id, 4, '09:00', '17:00'),
      (new.id, 5, '09:00', '17:00')
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_patient_profiles_updated_at before update on public.patient_profiles for each row execute function public.set_updated_at();
create trigger set_doctor_profiles_updated_at before update on public.doctor_profiles for each row execute function public.set_updated_at();
create trigger set_doctor_availability_updated_at before update on public.doctor_availability for each row execute function public.set_updated_at();
create trigger set_appointments_updated_at before update on public.appointments for each row execute function public.set_updated_at();
create trigger set_medical_reports_updated_at before update on public.medical_reports for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.patient_profiles enable row level security;
alter table public.doctor_profiles enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_reports enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "patients read own" on public.patient_profiles;
create policy "patients read own" on public.patient_profiles for select using (auth.uid() = id);
drop policy if exists "patients insert own" on public.patient_profiles;
create policy "patients insert own" on public.patient_profiles for insert with check (auth.uid() = id);
drop policy if exists "patients update own" on public.patient_profiles;
create policy "patients update own" on public.patient_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "doctors read own" on public.doctor_profiles;
create policy "doctors read own" on public.doctor_profiles for select using (auth.uid() = id);
drop policy if exists "doctors read public" on public.doctor_profiles;
create policy "doctors read public" on public.doctor_profiles for select to authenticated using (true);
drop policy if exists "doctors insert own" on public.doctor_profiles;
create policy "doctors insert own" on public.doctor_profiles for insert with check (auth.uid() = id);
drop policy if exists "doctors update own" on public.doctor_profiles;
create policy "doctors update own" on public.doctor_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles read authenticated" on public.profiles;
create policy "profiles read authenticated" on public.profiles for select to authenticated using (true);

drop policy if exists "availability read own" on public.doctor_availability;
create policy "availability read own" on public.doctor_availability for select using (auth.uid() = doctor_id);
drop policy if exists "availability read authenticated" on public.doctor_availability;
create policy "availability read authenticated" on public.doctor_availability for select to authenticated using (true);
drop policy if exists "availability insert own" on public.doctor_availability;
create policy "availability insert own" on public.doctor_availability for insert with check (auth.uid() = doctor_id);
drop policy if exists "availability update own" on public.doctor_availability;
create policy "availability update own" on public.doctor_availability for update using (auth.uid() = doctor_id) with check (auth.uid() = doctor_id);
drop policy if exists "availability delete own" on public.doctor_availability;
create policy "availability delete own" on public.doctor_availability for delete using (auth.uid() = doctor_id);

drop policy if exists "appointments patient read own" on public.appointments;
create policy "appointments patient read own" on public.appointments for select using (auth.uid() = patient_id or auth.uid() = doctor_id);
drop policy if exists "appointments patient insert own" on public.appointments;
create policy "appointments patient insert own" on public.appointments for insert with check (auth.uid() = patient_id);
drop policy if exists "appointments doctor update own" on public.appointments;
create policy "appointments doctor update own" on public.appointments for update using (auth.uid() = doctor_id) with check (auth.uid() = doctor_id);
drop policy if exists "appointments patient update own" on public.appointments;
create policy "appointments patient update own" on public.appointments for update using (auth.uid() = patient_id) with check (auth.uid() = patient_id);

drop policy if exists "doctor insert reports" on public.medical_reports;
create policy "doctor insert reports" on public.medical_reports for insert to authenticated with check (
  uploaded_by = auth.uid()
  and exists (select 1 from public.profiles where id = auth.uid() and role = 'doctor')
);
drop policy if exists "patient and doctor can view" on public.medical_reports;
create policy "patient and doctor can view" on public.medical_reports for select to authenticated using (
  patient_id = auth.uid() or uploaded_by = auth.uid()
);
drop policy if exists "doctor update own reports" on public.medical_reports;
create policy "doctor update own reports" on public.medical_reports for update using (uploaded_by = auth.uid()) with check (uploaded_by = auth.uid());
drop policy if exists "doctor delete own reports" on public.medical_reports;
create policy "doctor delete own reports" on public.medical_reports for delete using (uploaded_by = auth.uid());

drop policy if exists "notifications read own" on public.notifications;
create policy "notifications read own" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "notifications insert own" on public.notifications;
create policy "notifications insert own" on public.notifications for insert with check (auth.uid() = user_id);
drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed data commented out: these INSERTs reference `auth.users(id)` and will
-- fail if the corresponding auth users do not exist in your project.
-- To enable seeds you can either:
-- 1) Create the auth users first (Auth → Users in Supabase dashboard) with
--    the same UUIDs used below, then uncomment and run these inserts.
-- 2) Keep seeds commented and create test users via the app or dashboard.
--
-- insert into public.profiles (id, role, full_name, email, phone)
-- values
--   ('44444444-4444-4444-4444-444444444444', 'patient', 'Aarav Shah', 'aarav@example.com', '+91 90000 00000'),
--   ('55555555-5555-5555-5555-555555555555', 'patient', 'Ananya Patel', 'ananya@example.com', '+91 91111 11111'),
--   ('11111111-1111-1111-1111-111111111111', 'doctor', 'Dr. Maya Sen', 'maya@example.com', '+91 92222 22222'),
--   ('22222222-2222-2222-2222-222222222222', 'doctor', 'Dr. Arjun Verma', 'arjun@example.com', '+91 93333 33333')
-- on conflict (id) do nothing;

-- insert into public.patient_profiles (id, date_of_birth, gender, blood_group, allergies, emergency_contact)
-- values
--   ('44444444-4444-4444-4444-444444444444', '1993-01-15', 'male', 'O+', '{penicillin}', 'Nisha Shah'),
--   ('55555555-5555-5555-5555-555555555555', '1991-07-20', 'female', 'A+', '{dust}', 'Rahul Patel')
-- on conflict (id) do nothing;

-- insert into public.doctor_profiles (id, specialty, qualifications, experience_years, consultation_fee, clinic_address, bio, available_days, available_hours)
-- values
--   ('11111111-1111-1111-1111-111111111111', 'Cardiology', 'MBBS, MD, DNB', 12, 120, 'Greenview Heart Clinic, Downtown', 'Evidence-based cardiac care with a strong focus on prevention, lifestyle medicine, and follow-up consistency.', '{monday,tuesday,wednesday,thursday,friday}', '09:00-17:00'),
--   ('22222222-2222-2222-2222-222222222222', 'Dermatology', 'MBBS, MD', 8, 90, 'Skin Studio, City Center', 'General and procedural dermatology for adults and adolescents with teleconsultation follow-up options.', '{monday,tuesday,wednesday,friday}', '10:00-18:00')
-- on conflict (id) do nothing;

-- insert into public.doctor_availability (doctor_id, weekday, start_time, end_time)
-- values
--   ('11111111-1111-1111-1111-111111111111', 1, '09:00', '12:00'),
--   ('11111111-1111-1111-1111-111111111111', 3, '14:00', '18:00'),
--   ('22222222-2222-2222-2222-222222222222', 2, '10:00', '13:00')
-- on conflict do nothing;

-- insert into public.appointments (id, doctor_id, patient_id, scheduled_at, reason, status)
-- values
--   ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', now() + interval '1 day', 'Chest discomfort review and ECG discussion', 'pending'),
--   ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', now() + interval '2 days', 'Follow-up after medication change', 'accepted'),
--   ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', now() + interval '3 days', 'Persistent rash and allergy check', 'waiting')
-- on conflict (id) do nothing;

-- insert into public.medical_reports (id, patient_id, doctor_id, appointment_id, title, file_name, file_url, mime_type, uploaded_by)
-- values
--   ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ECG Summary', 'ecg-summary.pdf', '#', 'application/pdf', 'doctor'),
--   ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', null, null, 'Blood Test Report', 'blood-test.jpg', '#', 'image/jpeg', 'patient')
-- on conflict (id) do nothing;
