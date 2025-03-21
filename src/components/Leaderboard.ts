import { Participant } from '../types';
import { firebaseService } from '../services/firebase';

export class Leaderboard {
    private table: HTMLTableElement;
    private unsubscribe: (() => void) | null = null;

    constructor() {
        this.table = document.getElementById('leaderboardTable') as HTMLTableElement;
        this.initializeLeaderboard();
    }

    private initializeLeaderboard(): void {
        // Start listening for participant updates
        this.unsubscribe = firebaseService.onParticipantsUpdate(participants => {
            this.updateLeaderboard(participants);
        });
    }

    private updateLeaderboard(participants: Participant[]): void {
        const tbody = this.table.querySelector('tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Filter participants with scores and sort by score
        const scoredParticipants = participants
            .filter(p => p.score !== undefined)
            .sort((a, b) => (b.score || 0) - (a.score || 0));

        // Add rows to the table
        scoredParticipants.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${participant.teamNumber}</td>
                <td>${participant.score}</td>
            `;
            tbody.appendChild(row);
        });

        // Add message if no scores are available
        if (scoredParticipants.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3" class="text-center">No scores available yet</td>
            `;
            tbody.appendChild(row);
        }
    }

    public destroy(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
} 