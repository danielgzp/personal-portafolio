-- Drop foreign key constraint first
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_session_id_fkey;

-- Alter chat_sessions id column type
ALTER TABLE public.chat_sessions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.chat_sessions ALTER COLUMN id TYPE VARCHAR(255);

-- Alter chat_messages session_id column type
ALTER TABLE public.chat_messages ALTER COLUMN session_id TYPE VARCHAR(255);

-- Re-add the foreign key constraint
ALTER TABLE public.chat_messages 
  ADD CONSTRAINT chat_messages_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES public.chat_sessions(id) 
  ON DELETE CASCADE;
