import { StudentRegistration } from '../types';

export function getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function isArrivalTimeValid(arrivalTime: string): boolean {
    const currentTime = getCurrentTime();
    return arrivalTime <= currentTime;
}

export function showMessage(message: string, type: 'success' | 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    const adminControls = document.querySelector('.admin-controls');
    adminControls?.insertBefore(messageDiv, adminControls.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

export function parseCSV(csv: string): StudentRegistration[] {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const student: any = {};
        
        headers.forEach((header, index) => {
            student[header.toLowerCase().replace(/\s+/g, '')] = values[index];
        });

        // Validate team number format
        const teamNumber = student.teamnumber;
        if (!/^\d{4}$/.test(teamNumber)) {
            throw new Error(`Invalid team number format: ${teamNumber}. Team number must be a 4-digit integer.`);
        }
        
        return {
            teamNumber: teamNumber,
            teamName: student.teamname,
            firstName: student.firstname,
            lastName: student.lastname,
            grade: student.grade,
            schoolName: student.schoolname,
            category: student.category,
            arrivalTime: student.arrivaltime
        };
    });
} 