-- Allow authenticated users to read chat_sessions
CREATE POLICY "Authenticated users can read chat_sessions"
  ON public.chat_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to delete chat_sessions
CREATE POLICY "Authenticated users can delete chat_sessions"
  ON public.chat_sessions
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow authenticated users to read chat_messages
CREATE POLICY "Authenticated users can read chat_messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to delete chat_messages
CREATE POLICY "Authenticated users can delete chat_messages"
  ON public.chat_messages
  FOR DELETE
  TO authenticated
  USING (true);
