export interface Participant {
    id: string;
    teamNumber: string;
    teamName: string;
    firstName: string;
    lastName: string;
    grade: string;
    schoolName: string;
    category: 'junior' | 'senior';
    arrivalTime: string | null;
    isCheckedIn: boolean;
    status: 'registered' | 'checked-in' | 'judged';
    score?: number;
}

export interface CheckIn {
    participantId: string;
    checkInTime: string;
    status: 'checked-in' | 'late' | 'absent';
}

export interface CheckedInStudent extends Participant {
    checkInTime: string;
    checkInDate: string;
}

export interface StudentRegistration {
    teamNumber: string;
    teamName: string;
    firstName: string;
    lastName: string;
    grade: string;
    schoolName: string;
    category: 'junior' | 'senior';
    arrivalTime?: string;
}

export interface SortState {
    column: keyof Participant;
    direction: 'asc' | 'desc';
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'judge' | 'volunteer';
    registrationDate: string;
} 