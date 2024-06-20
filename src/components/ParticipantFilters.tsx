import React from 'react';

interface Discipline {
  id: number;
  disciplineName: string;
}

interface ParticipantFiltersProps {
  searchTerm: string;
  filters: any;
  teams: string[];
  disciplines: Discipline[];
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ParticipantFilters: React.FC<ParticipantFiltersProps> = ({
    searchTerm,
    filters,
    teams,
    disciplines,
    handleSearchChange,
    handleFilterChange
}) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Find med navn"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <select name="gender" onChange={handleFilterChange} value={filters.gender}>
                <option value="">Alle</option>
                <option value="MALE">Mand</option>
                <option value="FEMALE">Kvinde</option>
            </select>
            <select name="ageBracket" onChange={handleFilterChange} value={filters.ageBracket}>
                <option value="">Alle aldersklasser</option>
                <option value="children">Børn (6-9)</option>
                <option value="youth">Unge (10-13)</option>
                <option value="junior">Junior (14-22)</option>
                <option value="adult">Voksne (23-40)</option>
                <option value="senior">Senior (41+)</option>
            </select>
            <select name="team" onChange={handleFilterChange} value={filters.team}>
                <option value="">Alle hold</option>
                {teams.map((team, index) => (
                    <option key={index} value={team}>{team}</option>
                ))}
            </select>
            <select name="discipline" onChange={handleFilterChange} value={filters.discipline}>
              <option value="">Alle discipliner</option>
              {disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id.toString()}>
                  {discipline.disciplineName}
                </option>
              ))}
            </select>
        </div>
    );
};

export default ParticipantFilters;