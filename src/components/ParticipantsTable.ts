import { Participant, SortState } from '../types';
import { firebaseService } from '../services/firebase';
import { showMessage } from '../utils/helpers';

export class ParticipantsTable {
    private table: HTMLTableElement;
    private sortState: SortState = { column: 'teamNumber', direction: 'asc' };
    private unsubscribe: (() => void) | null = null;

    constructor() {
        this.table = document.getElementById('participantsTable') as HTMLTableElement;
        this.initializeTable();
    }

    private initializeTable(): void {
        // Add sort handlers to table headers
        const headers = this.table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort') as keyof Participant;
                this.handleSort(column);
            });
        });

        // Load initial data
        this.loadParticipants();
    }

    private async loadParticipants(): Promise<void> {
        try {
            // Unsubscribe from previous listener if exists
            if (this.unsubscribe) {
                this.unsubscribe();
            }

            // Subscribe to real-time updates
            this.unsubscribe = await firebaseService.subscribeToParticipants(
                (participants) => {
                    this.updateTable(participants);
                }
            );
        } catch (error) {
            console.error('Error loading participants:', error);
            showMessage('Error loading participants', 'error');
        }
    }

    private updateTable(participants: Participant[]): void {
        const tbody = this.table.querySelector('tbody');
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';

        // Sort participants
        const sortedParticipants = [...participants].sort((a, b) => {
            const aValue = a[this.sortState.column];
            const bValue = b[this.sortState.column];

            // Handle null/undefined values
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Compare values
            if (aValue < bValue) return this.sortState.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortState.direction === 'asc' ? 1 : -1;
            return 0;
        });

        // Add new rows
        sortedParticipants.forEach(participant => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${participant.teamNumber}</td>
                <td>${participant.teamName}</td>
                <td>${participant.firstName} ${participant.lastName}</td>
                <td>${participant.grade}</td>
                <td>${participant.schoolName}</td>
                <td>${participant.category}</td>
                <td>${participant.arrivalTime || '-'}</td>
                <td>${participant.status}</td>
            `;
            tbody.appendChild(row);
        });
    }

    private handleSort(column: keyof Participant): void {
        if (this.sortState.column === column) {
            // Toggle direction if same column
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.sortState.column = column;
            this.sortState.direction = 'asc';
        }

        // Update sort indicators
        const headers = this.table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            const headerColumn = header.getAttribute('data-sort') as keyof Participant;
            if (headerColumn === this.sortState.column) {
                header.classList.add('sorted');
                header.setAttribute('data-direction', this.sortState.direction);
            } else {
                header.classList.remove('sorted');
                header.removeAttribute('data-direction');
            }
        });
    }

    public cleanup(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
} 