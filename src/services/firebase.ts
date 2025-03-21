import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove, push, get } from 'firebase/database';
import { Participant, CheckIn, CheckedInStudent, StudentRegistration, User } from '../types';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs, 
    onSnapshot,
    Timestamp,
    orderBy,
    limit
} from 'firebase/firestore';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    User as AuthUser
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBx0J-7e9mH0vkKSbRUcxMhZcsXB4R0xX4",
    authDomain: "bbc-db-2b51c.firebaseapp.com",
    databaseURL: "https://bbc-db-2b51c-default-rtdb.firebaseio.com",
    projectId: "bbc-db-2b51c",
    storageBucket: "bbc-db-2b51c.firebasestorage.app",
    messagingSenderId: "77284998973",
    appId: "1:77284998973:web:93841dba0eae859bc68f54",
    measurementId: "G-0JN0C2PDDE"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);

const participantsRef = ref(database, 'participants');
const checkInsRef = ref(database, 'checkIns');
const checkedInStudentsRef = ref(database, 'checkedInStudents');
const usersRef = ref(database, 'users');

export const firebaseService = {
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
    },

    // Checked-in Students
    async addCheckedInStudent(student: CheckedInStudent): Promise<void> {
        try {
            await addDoc(collection(db, 'checkedInStudents'), student);
        } catch (error) {
            console.error('Error adding checked-in student:', error);
            throw error;
        }
    },

    async getCheckedInStudents(): Promise<CheckedInStudent[]> {
        const snapshot = await get(checkedInStudentsRef);
        const students: CheckedInStudent[] = [];
        snapshot.forEach((childSnapshot) => {
            students.push(childSnapshot.val());
        });
        return students;
    },

    // Real-time listeners
    onCheckedInStudentsUpdate(callback: (students: CheckedInStudent[]) => void): () => void {
        return onValue(checkedInStudentsRef, (snapshot) => {
            const students: CheckedInStudent[] = [];
            snapshot.forEach((childSnapshot) => {
                students.push(childSnapshot.val());
            });
            callback(students);
        });
    },

    subscribeToParticipants(callback: (participants: Participant[]) => void): () => void {
        const q = query(collection(db, 'participants'));
        return onSnapshot(q, (snapshot) => {
            const participants: Participant[] = [];
            snapshot.forEach((doc) => {
                participants.push({ id: doc.id, ...doc.data() } as Participant);
            });
            callback(participants);
        });
    },

    // User Management
    async addUser(user: Omit<User, 'id'>): Promise<string> {
        const newUserRef = push(usersRef);
        await set(newUserRef, {
            ...user,
            id: newUserRef.key,
            registrationDate: new Date().toISOString()
        });
        return newUserRef.key!;
    },

    async updateUser(id: string, updates: Partial<User>): Promise<void> {
        const userRef = ref(database, `users/${id}`);
        await update(userRef, updates);
    },

    async deleteUser(id: string): Promise<void> {
        const userRef = ref(database, `users/${id}`);
        await remove(userRef);
    },

    async getAllUsers(): Promise<User[]> {
        const snapshot = await get(usersRef);
        const users: User[] = [];
        snapshot.forEach((childSnapshot) => {
            users.push(childSnapshot.val());
        });
        return users;
    },

    onUsersUpdate(callback: (users: User[]) => void): () => void {
        return onValue(usersRef, (snapshot) => {
            const users: User[] = [];
            snapshot.forEach((childSnapshot) => {
                users.push(childSnapshot.val());
            });
            callback(users);
        });
    }
}; 