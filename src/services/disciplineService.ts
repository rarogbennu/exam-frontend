export const getDisciplines = async () => {
    const response = await fetch('http://localhost:8080/disciplines');
    if (!response.ok) {
        throw new Error('Failed to fetch disciplines');
    }
    return response.json();
};

export const createDiscipline = async (discipline: any) => {
    const response = await fetch('http://localhost:8080/disciplines', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discipline),
    });
    if (!response.ok) {
        throw new Error('Failed to create discipline');
    }
    return response.json();
};

export const updateDiscipline = async (disciplineId: number, updatedDiscipline: any) => {
    const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDiscipline),
    });
    if (!response.ok) {
        throw new Error('Failed to update discipline');
    }
    return response.json();
};

export const deleteDiscipline = async (disciplineId: number) => {
    const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete discipline');
    }
};