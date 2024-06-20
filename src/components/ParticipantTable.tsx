import React from 'react';

interface Participant {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  team: string;
  disciplines: { id: number; disciplineName: string }[];
}

interface ParticipantTableProps {
    participants: Participant[];
    getAgeBracket: (birthdate: string) => string;
    calculateAge: (birthdate: string) => number;
    setCurrentParticipant: (participant: Participant) => void;
    handleDeleteParticipant: (participantId: number) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalParticipants: number;
    participantsPerPage: number;
    handleSort: (key: keyof Participant) => void;
    sortConfig: { key: keyof Participant; direction: 'ascending' | 'descending' } | null;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
    participants,
    getAgeBracket,
    calculateAge,
    setCurrentParticipant,
    handleDeleteParticipant,
    currentPage,
    setCurrentPage,
    totalParticipants,
    participantsPerPage,
    handleSort,
    sortConfig
}) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            Navn {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('gender')}>
                            Køn {sortConfig?.key === 'gender' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('birthdate')}>
                            Alder {sortConfig?.key === 'birthdate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('team')}>
                            Hold {sortConfig?.key === 'team' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th>Discipliner</th>
                        <th>Handlinger</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map(participant => (
                        <tr key={participant.id}>
                            <td>{participant.name}</td>
                            <td>{participant.gender}</td>
                            <td>{calculateAge(participant.birthdate)} ({getAgeBracket(participant.birthdate)})</td>
                            <td>{participant.team}</td>
                            <td>{participant.disciplines.map(d => d.disciplineName).join(', ')}</td>
                            <td>
                                <button onClick={() => setCurrentParticipant(participant)}>Opdater</button>
                                <button onClick={() => handleDeleteParticipant(participant.id)}>Slet</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * participantsPerPage >= totalParticipants}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ParticipantTable;