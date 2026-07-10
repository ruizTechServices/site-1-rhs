create index role_assignments_assigned_by_idx
on public.role_assignments (assigned_by)
where assigned_by is not null;
