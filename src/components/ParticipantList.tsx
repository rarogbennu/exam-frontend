import React, { useEffect, useState } from 'react';
import ParticipantForm from './ParticipantForm';
import ParticipantTable from './ParticipantTable';
import ParticipantFilters from './ParticipantFilters';
import { getParticipants, createParticipant, updateParticipant, deleteParticipant, getTeams, getDisciplines } from '../services/participantService';

interface Discipline {
  id: number;
  disciplineName: string;
  resultType: string;
}

interface Participant {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  team: string;
  disciplines: Discipline[];
}

const ParticipantList: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [newParticipant, setNewParticipant] = useState<Participant>({ id: 0, name: '', gender: '', birthdate: '', team: '', disciplines: [] });
    const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
    const [teams, setTeams] = useState<string[]>([]);
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ gender: '', ageBracket: '', team: '', discipline: '' });
    const [sortConfig, setSortConfig] = useState<{ key: keyof Participant; direction: 'ascending' | 'descending' } | null>(null);

    const participantsPerPage = 20;

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchParticipants();
    }, [currentPage, searchTerm, filters]);

    const fetchInitialData = async () => {
        try {
            const [fetchedTeams, fetchedDisciplines] = await Promise.all([getTeams(), getDisciplines()]);
            setTeams(fetchedTeams);
            setDisciplines(fetchedDisciplines);
            fetchParticipants();
        } catch (error: any) {
            console.error('Error fetching initial data:', error.message);
        }
    };

    const fetchParticipants = async () => {
        try {
            const data = await getParticipants();
            setParticipants(data);
        } catch (error: any) {
            console.error('Error fetching participants:', error.message);
        }
    };

    const handleCreateParticipant = async () => {
        try {
            await createParticipant(newParticipant);
            setNewParticipant({ id: 0, name: '', gender: '', birthdate: '', team: '', disciplines: [] });
            fetchParticipants();
        } catch (error: any) {
            console.error('Error creating participant:', error.message);
        }
    };

    const handleUpdateParticipant = async (participantId: number, updatedParticipant: Participant) => {
        if (currentParticipant) {
            try {
                await updateParticipant(participantId, updatedParticipant);
                setCurrentParticipant(null);
                fetchParticipants();
            } catch (error: any) {
                console.error('Error updating participant:', error.message);
            }
        }
    };

    const handleDeleteParticipant = async (participantId: number) => {
        try {
            await deleteParticipant(participantId);
            fetchParticipants();
        } catch (error: any) {
            console.error('Error deleting participant:', error.message);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const calculateAge = (birthdate: string): number => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeBracket = (birthdate: string) => {
        const age = calculateAge(birthdate);
        if (age >= 6 && age <= 9) return 'children';
        if (age >= 10 && age <= 13) return 'youth';
        if (age >= 14 && age <= 22) return 'junior';
        if (age >= 23 && age <= 40) return 'adult';
        return 'senior';
    };

    const handleSort = (key: keyof Participant) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedParticipants = React.useMemo(() => {
        let sortableParticipants = [...participants];
        if (sortConfig !== null) {
            sortableParticipants.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableParticipants;
    }, [participants, sortConfig]);

    const filteredParticipants = sortedParticipants
        .filter(participant =>
            participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(participant =>
            filters.gender ? participant.gender === filters.gender : true
        )
        .filter(participant =>
            filters.ageBracket ? getAgeBracket(participant.birthdate) === filters.ageBracket : true
        )
        .filter(participant =>
            filters.team ? participant.team === filters.team : true
        )
        .filter(participant =>
            filters.discipline ? participant.disciplines.some(d => d.id.toString() === filters.discipline) : true
        );

    const paginatedParticipants = filteredParticipants.slice(
        (currentPage - 1) * participantsPerPage,
        currentPage * participantsPerPage
    );

    return (
        <div>
            <h1>Participants</h1>
            <ParticipantFilters
                searchTerm={searchTerm}
                filters={filters}
                teams={teams}
                disciplines={disciplines}
                handleSearchChange={handleSearchChange}
                handleFilterChange={handleFilterChange}
            />
            <ParticipantForm
                newParticipant={newParticipant}
                setNewParticipant={setNewParticipant}
                handleCreateParticipant={handleCreateParticipant}
                disciplines={disciplines}
            />
            {currentParticipant && (
                <ParticipantForm
                    newParticipant={currentParticipant}
                    setNewParticipant={setCurrentParticipant}
                    handleCreateParticipant={() => handleUpdateParticipant(currentParticipant.id, currentParticipant)}
                    disciplines={disciplines}
                />
            )}
            <ParticipantTable
                participants={paginatedParticipants}
                getAgeBracket={getAgeBracket}
                calculateAge={calculateAge}
                setCurrentParticipant={setCurrentParticipant}
                handleDeleteParticipant={handleDeleteParticipant}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalParticipants={filteredParticipants.length}
                participantsPerPage={participantsPerPage}
                handleSort={handleSort}
                sortConfig={sortConfig}
            />
        </div>
    );
};

export default ParticipantList;