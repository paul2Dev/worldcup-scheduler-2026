export function useTeamModal() {
  const selectedTeamId = useState<number | null>('teamModal', () => null)

  function openTeam(id: number) {
    selectedTeamId.value = id
  }

  function closeTeam() {
    selectedTeamId.value = null
  }

  return { selectedTeamId, openTeam, closeTeam }
}
