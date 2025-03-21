import { CheckedInStudent } from '../types';
import { firebaseService } from '../services/firebase';

export class JudgePortal {
    private dropdown: HTMLSelectElement;
    private studentDetails: HTMLElement;
    private unsubscribe: (() => void) | null = null;

    constructor() {
        this.dropdown = document.getElementById('studentDropdown') as HTMLSelectElement;
        this.studentDetails = document.getElementById('studentDetails') as HTMLElement;

        this.initializePortal();
    }

    private initializePortal(): void {
        // Add change handler to dropdown
        this.dropdown.addEventListener('change', () => this.handleStudentSelect());

        // Start listening for checked-in students updates
        this.unsubscribe = firebaseService.onCheckedInStudentsUpdate(students => {
            this.updateDropdown(students);
        });
    }

    private updateDropdown(students: CheckedInStudent[]): void {
        // Clear existing options
        this.dropdown.innerHTML = '<option value="">Select a student</option>';

        // Add new options
        students.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.firstName} ${student.lastName} (Team ${student.teamNumber})`;
            this.dropdown.appendChild(option);
        });
    }

    private handleStudentSelect(): void {
        const selectedId = this.dropdown.value;
        if (!selectedId) {
            this.studentDetails.style.display = 'none';
            return;
        }

        // Get selected student from Firebase
        firebaseService.getCheckedInStudents().then(students => {
            const student = students.find(s => s.id === selectedId);
            if (student) {
                this.displayStudentDetails(student);
            }
        });
    }

    private displayStudentDetails(student: CheckedInStudent): void {
        this.studentDetails.innerHTML = `
            <h3>Student Details</h3>
            <div class="student-info">
                <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
                <p><strong>Team Number:</strong> ${student.teamNumber}</p>
                <p><strong>Grade:</strong> ${student.grade}</p>
                <p><strong>School:</strong> ${student.schoolName}</p>
                <p><strong>Category:</strong> ${student.category}</p>
                <p><strong>Check-in Time:</strong> ${new Date(student.checkInTime).toLocaleString()}</p>
            </div>
        `;
        this.studentDetails.style.display = 'block';
    }

    public destroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
} 