import { useEffect, useState } from 'react';
import { getDisciplines } from '../services/disciplineService';

const Disciplines = () => {
    const [disciplines, setDisciplines] = useState([]);

    useEffect(() => {
        const fetchDisciplines = async () => {
            try {
                const data = await getDisciplines();
                setDisciplines(data);
            } catch (error) {
                console.error('Error fetching disciplines:', error);
            }
        };

        fetchDisciplines();
    }, []);

    return (
        <div>
            <h1>Disciplines</h1>
            <ul>
                {disciplines.map(discipline => (
                    <li key={discipline.id}>{discipline.disciplineName}</li>
                ))}
            </ul>
        </div>
    );
};

export default Disciplines;