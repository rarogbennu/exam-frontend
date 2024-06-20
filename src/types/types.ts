// Define Participant interface
interface Participant {
  id: number;
  name: string;
  gender: string;
  age: number;
  club: string;
}

// Interface for filter options
interface FilterOptions {
  gender: string;
  ageGroup: string;
  club: string;
  discipline: string;
}