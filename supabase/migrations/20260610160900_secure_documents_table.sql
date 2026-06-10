-- Eliminar políticas públicas de la tabla documents para asegurar que solo
-- se pueda acceder desde el servidor usando la secret key (service_role).

DROP POLICY IF EXISTS "Allow read for authenticated users" ON public.documents;
DROP POLICY IF EXISTS "Allow read for anon users" ON public.documents;
