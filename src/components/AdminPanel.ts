import { User } from '../types';
import { firebaseService } from '../services/firebase';
import { parseCSV, showMessage } from '../utils/helpers';

export class AdminPanel {
    private bulkRegistrationForm: HTMLFormElement;
    private usersTable: HTMLTableElement;
    private unsubscribe: (() => void) | null = null;

    constructor() {
        this.bulkRegistrationForm = document.getElementById('bulkRegistrationForm') as HTMLFormElement;
        this.usersTable = document.getElementById('usersTable') as HTMLTableElement;

        this.initializePanel();
    }

    private initializePanel(): void {
        // Add form submit handler for bulk registration
        this.bulkRegistrationForm.addEventListener('submit', this.handleBulkRegistration.bind(this));

        // Start listening for user updates
        this.unsubscribe = firebaseService.onUsersUpdate(users => {
            this.updateUsersTable(users);
        });
    }

    private async handleBulkRegistration(event: Event): Promise<void> {
        event.preventDefault();

        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        const file = fileInput.files?.[0];
        
        if (!file) {
            showMessage('Please select a CSV file', 'error');
            return;
        }

        try {
            const text = await file.text();
            const students = parseCSV(text);
            
            if (students.length === 0) {
                showMessage('No valid student data found in CSV', 'error');
                return;
            }

            await firebaseService.registerStudents(students);
            showMessage(`${students.length} students registered successfully`, 'success');
            this.bulkRegistrationForm.reset();
        } catch (error) {
            console.error('Error registering students:', error);
            showMessage('Failed to register students', 'error');
        }
    }

    private updateUsersTable(users: User[]): void {
        const tbody = this.usersTable.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}">
                            Delete
                        </button>
                    </div>
                </td>
            `;

            // Add delete button handler
            const deleteBtn = row.querySelector('.delete-user-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.handleDeleteUser(user.id));
            }

            tbody.appendChild(row);
        });
    }

    private async handleDeleteUser(id: string): Promise<void> {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await firebaseService.deleteUser(id);
            showMessage('User deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showMessage('Failed to delete user', 'error');
        }
    }

    public destroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
} 