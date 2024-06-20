import React from 'react';

interface Discipline {
  id: number;
  disciplineName: string;
  resultType: string;
}

interface ParticipantFormProps {
    newParticipant: any;
    setNewParticipant: (participant: any) => void;
    handleCreateParticipant: () => void;
    disciplines: Discipline[];
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({
    newParticipant,
    setNewParticipant,
    handleCreateParticipant,
    disciplines
}) => {
    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDisciplines = Array.from(e.target.selectedOptions, option => disciplines.find(d => d.id.toString() === option.value));
        setNewParticipant({ ...newParticipant, disciplines: selectedDisciplines });
    };

    return (
        <form onSubmit={e => { e.preventDefault(); handleCreateParticipant(); }}>
            <input
                type="text"
                placeholder="Navn"
                value={newParticipant.name}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                required
            />
            <select
                value={newParticipant.gender}
                onChange={e => setNewParticipant({ ...newParticipant, gender: e.target.value })}
                required
            >
                <option value="">Vælg køn</option>
                <option value="MALE">Mand</option>
                <option value="FEMALE">Kvinde</option>
            </select>
            <input
                type="date"
                placeholder="Fødselsdag"
                value={newParticipant.birthdate}
                onChange={e => setNewParticipant({ ...newParticipant, birthdate: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Hold"
                value={newParticipant.team}
                onChange={e => setNewParticipant({ ...newParticipant, team: e.target.value })}
                required
            />
            <select
                multiple
                value={newParticipant.disciplines.map(d => d.id.toString())}
                onChange={handleDisciplineChange}
                required
            >
                {disciplines.map((discipline) => (
                    <option key={discipline.id} value={discipline.id.toString()}>{discipline.disciplineName}</option>
                ))}
            </select>
            <button type="submit">Tilføj deltager</button>
        </form>
    );
};

export default ParticipantForm;