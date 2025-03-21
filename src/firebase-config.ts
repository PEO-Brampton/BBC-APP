import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove, push, get } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "AIzaSyBx0J-7e9mH0vkKSbRUcxMhZcsXB4R0xX4",
    authDomain: "bbc-db-2b51c.firebaseapp.com",
    databaseURL: "https://bbc-db-2b51c-default-rtdb.firebaseio.com",
    projectId: "bbc-db-2b51c",
    storageBucket: "bbc-db-2b51c.firebasestorage.app",
    messagingSenderId: "77284998973",
    appId: "1:77284998973:web:93841dba0eae859bc68f54",
    measurementId: "G-0JN0C2PDDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
const participantsRef = ref(database, 'participants');
const checkInsRef = ref(database, 'checkIns');

// Types
export interface Participant {
    id: string;
    teamNumber: string;
    teamName: string;
    firstName: string;
    lastName: string;
    grade: string;
    schoolName: string;
    category: string;
    arrivalTime: string | null;
    isCheckedIn: boolean;
    status: 'registered' | 'waiting-area' | 'checked-in';
}

export interface CheckIn {
    participantId: string;
    checkInTime: string;
    status: 'checked-in' | 'waiting-area';
}

export interface StudentRegistration {
    teamNumber: string;
    teamName: string;
    firstName: string;
    lastName: string;
    grade: string;
    schoolName: string;
    category: string;
    arrivalTime: string;
}

// Database functions
export const db = {
    // Participants
    async addParticipant(participant: Omit<Participant, 'id'>): Promise<string> {
        const newParticipantRef = push(participantsRef);
        await set(newParticipantRef, {
            ...participant,
            id: newParticipantRef.key
        });
        return newParticipantRef.key!;
    },

    async updateParticipant(id: string, updates: Partial<Participant>): Promise<void> {
        const participantRef = ref(database, `participants/${id}`);
        await update(participantRef, updates);
    },

    async deleteParticipant(id: string): Promise<void> {
        const participantRef = ref(database, `participants/${id}`);
        await remove(participantRef);
    },

    // Check-ins
    async addCheckIn(checkIn: CheckIn): Promise<void> {
        const checkInRef = ref(database, `checkIns/${checkIn.participantId}`);
        await set(checkInRef, checkIn);
    },

    async updateCheckInStatus(participantId: string, status: CheckIn['status']): Promise<void> {
        const checkInRef = ref(database, `checkIns/${participantId}`);
        await update(checkInRef, { status });
    },

    // Real-time listeners
    onParticipantsUpdate(callback: (participants: Participant[]) => void): () => void {
        return onValue(participantsRef, (snapshot) => {
            const participants: Participant[] = [];
            snapshot.forEach((childSnapshot) => {
                participants.push(childSnapshot.val());
            });
            callback(participants);
        });
    },

    onCheckInsUpdate(callback: (checkIns: CheckIn[]) => void): () => void {
        return onValue(checkInsRef, (snapshot) => {
            const checkIns: CheckIn[] = [];
            snapshot.forEach((childSnapshot) => {
                checkIns.push(childSnapshot.val());
            });
            callback(checkIns);
        });
    },

    // Bulk student registration
    async registerStudents(students: StudentRegistration[]): Promise<void> {
        try {
            const batchPromises = students.map(student => {
                const newParticipantRef = push(participantsRef);
                return set(newParticipantRef, {
                    ...student,
                    id: newParticipantRef.key,
                    isCheckedIn: false,
                    status: 'registered',
                    arrivalTime: student.arrivalTime || null
                });
            });

            await Promise.all(batchPromises);
        } catch (error) {
            console.error('Error registering students:', error);
            throw error;
        }
    },

    // Get all participants
    async getAllParticipants(): Promise<Participant[]> {
        const snapshot = await get(participantsRef);
        const participants: Participant[] = [];
        snapshot.forEach((childSnapshot) => {
            participants.push(childSnapshot.val());
        });
        return participants;
    }
}; 