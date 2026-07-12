import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Session } from "../types"

async function fetchSessions(): Promise<Session[]> {
  const res = await fetch("/api/admin/sessions")
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error fetching sessions")
  }
  const data = await res.json()
  return data.sessions
}

async function deleteSession(id: string): Promise<void> {
  const res = await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error deleting session")
  }
}

export function useSessions(initialData: Session[]) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    initialData,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (_, deletedId) => {
      // Optimistically update cache or invalidate
      queryClient.setQueryData<Session[]>(["sessions"], (old) => 
        old ? old.filter(s => s.id !== deletedId) : []
      )
      // queryClient.invalidateQueries({ queryKey: ["sessions"] }) // Uncomment if you prefer a hard refetch
    }
  })

  return {
    sessions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    deleteSession: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
