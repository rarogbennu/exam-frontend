import React, { useState, useEffect } from 'react';
import { getParticipants } from '../services/participantService';
import { getDisciplines } from '../services/disciplineService';
import { createResult, getResults, updateResult, deleteResult } from '../services/resultService';
import TimeInput from '../utils/TimeInput';

interface Participant {
  id: number;
  name: string;
  gender: string;
}

interface Discipline {
  id: number;
  disciplineName: string;
  resultType: 'TIME' | 'DISTANCE' | 'POINTS';
}

interface Result {
  id: number;
  participant: Participant;
  discipline: Discipline;
  resultValue: number;
  date: string;
  resultType: 'TIME' | 'DISTANCE' | 'POINTS';
}

const ResultManagement: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [newResult, setNewResult] = useState<Partial<Result>>({});
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [filterDiscipline, setFilterDiscipline] = useState<number | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Result>('resultValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [bulkResults, setBulkResults] = useState<Partial<Result>[]>([]);

  useEffect(() => {
    fetchParticipants();
    fetchDisciplines();
    fetchResults();
  }, []);

  const fetchParticipants = async () => {
    const fetchedParticipants = await getParticipants();
    setParticipants(fetchedParticipants);
  };

  const fetchDisciplines = async () => {
    const fetchedDisciplines = await getDisciplines();
    setDisciplines(fetchedDisciplines);
  };

  const fetchResults = async () => {
    const fetchedResults = await getResults();
    setResults(fetchedResults);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      // Handling bulk results
      const updatedBulkResults = [...bulkResults];
      updatedBulkResults[index] = { ...updatedBulkResults[index], [name]: name === 'participant' ? { id: Number(value) } : value };
      setBulkResults(updatedBulkResults);
    } else if (name === 'discipline') {
      const discipline = disciplines.find(d => d.id === Number(value)) || null;
      setSelectedDiscipline(discipline);
      if (editingResult) {
        setEditingResult({ ...editingResult, [name]: { id: Number(value) }, resultType: discipline?.resultType });
      } else {
        setNewResult({ ...newResult, [name]: { id: Number(value) }, resultType: discipline?.resultType });
      }
    } else if (editingResult) {
      setEditingResult({ ...editingResult, [name]: name === 'participant' ? { id: Number(value) } : value });
    } else {
      setNewResult({ ...newResult, [name]: name === 'participant' ? { id: Number(value) } : value });
    }
  };

  const handleTimeChange = (timeInSeconds: number, index?: number) => {
    if (index !== undefined) {
      // Handling bulk results
      const updatedBulkResults = [...bulkResults];
      updatedBulkResults[index] = { ...updatedBulkResults[index], resultValue: timeInSeconds };
      setBulkResults(updatedBulkResults);
    } else if (editingResult) {
      setEditingResult({ ...editingResult, resultValue: timeInSeconds });
    } else {
      setNewResult({ ...newResult, resultValue: timeInSeconds });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResult) {
        await updateResult(editingResult.id, {
          ...editingResult,
          participant: { id: Number(editingResult.participant.id) },
          discipline: { id: Number(editingResult.discipline.id) },
        });
        setEditingResult(null);
      } else if (bulkResults.length > 0) {
        // Submit bulk results
        for (const result of bulkResults) {
          await createResult({
            ...result,
            participant: { id: Number(result.participant?.id) },
            discipline: { id: Number(selectedDiscipline?.id) },
          } as Result);
        }
        setBulkResults([]);
      } else {
        await createResult({
          ...newResult,
          participant: { id: Number(newResult.participant?.id) },
          discipline: { id: Number(newResult.discipline?.id) },
        } as Result);
      }
      fetchResults();
      resetForm();
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };


  const resetForm = () => {
    setNewResult({});
    setEditingResult(null);
    setSelectedDiscipline(null);
    setBulkResults([]);
  };

  const addBulkResult = () => {
    setBulkResults([...bulkResults, {}]);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setSelectedDiscipline(result.discipline);
  };

  const handleDelete = async (id: number) => {
    await deleteResult(id);
    fetchResults();
  };

const formatResultValue = (value: number, type: 'TIME' | 'DISTANCE' | 'POINTS'): { value: string, unit: string } => {
  if (type === 'TIME') {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);
    const hundredths = Math.floor((value % 1) * 100);
    return {
      value: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`,
      unit: 'HH:MM:SS:CC'
    };
  } else if (type === 'DISTANCE') {
    const meters = Math.floor(value);
    const centimeters = Math.floor((value % 1) * 100);
    return {
      value: `${meters}.${centimeters.toString().padStart(2, '0')}`,
      unit: 'm'
    };
  } else {
    return {
      value: value.toString(),
      unit: 'points'
    };
  }
};

  const filteredAndSortedResults = results
    .filter(result => !filterDiscipline || result.discipline.id === filterDiscipline)
    .filter(result => !filterGender || result.participant.gender === filterGender)
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <h2>Result Management</h2>
      <form onSubmit={handleSubmit}>
        {!editingResult && (
          <select 
            name="discipline" 
            onChange={handleInputChange}
            value={selectedDiscipline?.id || ''}
            required
          >
            <option value="">Select Discipline</option>
            {disciplines.map(discipline => (
              <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
            ))}
          </select>
        )}
        {selectedDiscipline && !editingResult ? (
          <>
            <button type="button" onClick={addBulkResult}>Add Result</button>
            {bulkResults.map((result, index) => (
              <div key={index}>
                <select 
                  name="participant" 
                  onChange={(e) => handleInputChange(e, index)} 
                  value={result.participant?.id || ''}
                  required
                >
                  <option value="">Select Participant</option>
                  {participants.map(participant => (
                    <option key={participant.id} value={participant.id}>{participant.name}</option>
                  ))}
                </select>
                {selectedDiscipline.resultType === 'TIME' ? (
                  <TimeInput
                    value={result.resultValue || 0}
                    onChange={(value) => handleTimeChange(value, index)}
                  />
                ) : (
                  <input
                    type="number"
                    name="resultValue"
                    placeholder={selectedDiscipline.resultType === 'DISTANCE' ? 'Distance (m)' : 'Points'}
                    step="0.01"
                    onChange={(e) => handleInputChange(e, index)}
                    value={result.resultValue || ''}
                    required
                  />
                )}
                <input
                  type="date"
                  name="date"
                  onChange={(e) => handleInputChange(e, index)}
                  value={result.date || ''}
                  required
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <select 
              name="participant" 
              onChange={handleInputChange} 
              value={editingResult?.participant.id || newResult.participant?.id || ''}
              required
            >
              <option value="">Select Participant</option>
              {participants.map(participant => (
                <option key={participant.id} value={participant.id}>{participant.name}</option>
              ))}
            </select>
            {editingResult && (
              <select 
                name="discipline" 
                onChange={handleInputChange}
                value={editingResult.discipline.id || ''}
                required
              >
                <option value="">Select Discipline</option>
                {disciplines.map(discipline => (
                  <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
                ))}
              </select>
            )}
            {selectedDiscipline?.resultType === 'TIME' ? (
              <TimeInput
                value={editingResult?.resultValue || newResult.resultValue || 0}
                onChange={handleTimeChange}
              />
            ) : (
              <input
                type="number"
                name="resultValue"
                placeholder={selectedDiscipline?.resultType === 'DISTANCE' ? 'Distance (m)' : 'Points'}
                step="0.01"
                onChange={handleInputChange}
                value={editingResult?.resultValue || newResult.resultValue || ''}
                required
              />
            )}
            <input
              type="date"
              name="date"
              onChange={handleInputChange}
              value={editingResult?.date || newResult.date || ''}
              required
            />
          </>
        )}
        <button type="submit">{editingResult ? 'Update Result' : 'Save Results'}</button>
        {editingResult && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div>
        <select onChange={(e) => setFilterDiscipline(Number(e.target.value) || null)}>
          <option value="">All Disciplines</option>
          {disciplines.map(discipline => (
            <option key={discipline.id} value={discipline.id}>{discipline.disciplineName}</option>
          ))}
        </select>
        <select onChange={(e) => setFilterGender(e.target.value || null)}>
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        <select onChange={(e) => setSortField(e.target.value as keyof Result)}>
          <option value="resultValue">Result Value</option>
          <option value="date">Date</option>
        </select>
        <button onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
          {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

    <table>
      <thead>
        <tr>
          <th>Participant</th>
          <th>Discipline</th>
          <th>Result</th>
          <th>Unit</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredAndSortedResults.map(result => {
          const formattedResult = formatResultValue(result.resultValue, result.resultType);
          return (
            <tr key={result.id}>
              <td>{result.participant.name}</td>
              <td>{result.discipline.disciplineName}</td>
              <td>{formattedResult.value}</td>
              <td>{formattedResult.unit}</td>
              <td>{result.date}</td>
              <td>
                <button onClick={() => handleEdit(result)}>Edit</button>
                <button onClick={() => handleDelete(result.id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
};

export default ResultManagement;