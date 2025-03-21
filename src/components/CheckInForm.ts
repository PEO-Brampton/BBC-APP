import { Participant, CheckedInStudent } from '../types';
import { firebaseService } from '../services/firebase';
import { getCurrentTime, isArrivalTimeValid, showMessage } from '../utils/helpers';

export class CheckInForm {
    private form: HTMLFormElement;
    private teamNumberInput: HTMLInputElement;
    private teamNameInput: HTMLInputElement;
    private firstNameInput: HTMLInputElement;
    private lastNameInput: HTMLInputElement;
    private gradeInput: HTMLInputElement;
    private schoolNameInput: HTMLInputElement;
    private categoryInput: HTMLSelectElement;
    private arrivalTimeInput: HTMLInputElement;

    constructor() {
        this.form = document.getElementById('checkInForm') as HTMLFormElement;
        this.teamNumberInput = document.getElementById('teamNumber') as HTMLInputElement;
        this.teamNameInput = document.getElementById('teamName') as HTMLInputElement;
        this.firstNameInput = document.getElementById('firstName') as HTMLInputElement;
        this.lastNameInput = document.getElementById('lastName') as HTMLInputElement;
        this.gradeInput = document.getElementById('grade') as HTMLInputElement;
        this.schoolNameInput = document.getElementById('schoolName') as HTMLInputElement;
        this.categoryInput = document.getElementById('category') as HTMLSelectElement;
        this.arrivalTimeInput = document.getElementById('arrivalTime') as HTMLInputElement;

        this.initializeForm();
    }

    private initializeForm(): void {
        // Set current time as default arrival time
        this.arrivalTimeInput.value = getCurrentTime();

        // Add form submit handler
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    private async handleSubmit(): Promise<void> {
        const arrivalTime = this.arrivalTimeInput.value;
        if (!isArrivalTimeValid(arrivalTime)) {
            showMessage('Arrival time cannot be in the future', 'error');
            return;
        }

        const participant: Participant = {
            id: Date.now().toString(),
            teamNumber: this.teamNumberInput.value,
            teamName: this.teamNameInput.value,
            firstName: this.firstNameInput.value,
            lastName: this.lastNameInput.value,
            grade: this.gradeInput.value,
            schoolName: this.schoolNameInput.value,
            category: this.categoryInput.value as 'junior' | 'senior',
            arrivalTime,
            isCheckedIn: true,
            status: 'checked-in'
        };

        const checkedInStudent: CheckedInStudent = {
            ...participant,
            checkInTime: getCurrentTime(),
            checkInDate: new Date().toISOString().split('T')[0]
        };

        try {
            await firebaseService.addCheckedInStudent(checkedInStudent);
            showMessage('Student checked in successfully!', 'success');
            this.form.reset();
            this.arrivalTimeInput.value = getCurrentTime();
        } catch (error) {
            console.error('Error checking in student:', error);
            showMessage('Error checking in student. Please try again.', 'error');
        }
    }
} 