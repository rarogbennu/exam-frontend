export const getParticipants = async () => {
    const response = await fetch('http://localhost:8080/participants');
    if (!response.ok) {
        throw new Error('Failed to fetch participants');
    }
    return response.json();
};

export const createParticipant = async (participant: any) => {
    const response = await fetch('http://localhost:8080/participants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(participant),
    });
    if (!response.ok) {
        throw new Error('Failed to create participant');
    }
    return response.json();
};

export const updateParticipant = async (participantId: number, updatedParticipant: any) => {
    const response = await fetch(`http://localhost:8080/participants/${participantId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedParticipant),
    });
    if (!response.ok) {
        throw new Error('Failed to update participant');
    }
    return response.json();
};

export const deleteParticipant = async (participantId: number) => {
    const response = await fetch(`http://localhost:8080/participants/${participantId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete participant');
    }
};

export const getTeams = async (): Promise<string[]> => {
  const response = await fetch('http://localhost:8080/participants/teams');
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  return response.json();
};

export const getDisciplines = async (): Promise<Discipline[]> => {
  const response = await fetch('http://localhost:8080/disciplines');
  if (!response.ok) {
    throw new Error('Failed to fetch disciplines');
  }
  return response.json();
};