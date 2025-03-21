import './styles.css';
import { db, Participant } from './firebase-config';

interface StudentRegistration {
    teamNumber: string;
    teamName: string;
    firstName: string;
    lastName: string;
    grade: string;
    schoolName: string;
    category: string;
    arrivalTime: string;
}

// DOM Elements
const sidebar = document.querySelector('.sidebar') as HTMLElement;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement;
const checkInBtn = document.getElementById('checkInBtn') as HTMLButtonElement;
const leaderboardBtn = document.getElementById('leaderboardBtn') as HTMLButtonElement;
const judgeBtn = document.getElementById('judgeBtn') as HTMLButtonElement;
const adminBtn = document.getElementById('adminBtn') as HTMLButtonElement;

const homePage = document.getElementById('homePage') as HTMLDivElement;
const checkInPage = document.getElementById('checkInPage') as HTMLDivElement;
const leaderboardPage = document.getElementById('leaderboardPage') as HTMLDivElement;
const judgePage = document.getElementById('judgePage') as HTMLDivElement;
const adminPage = document.getElementById('adminPage') as HTMLDivElement;

const leaderboardList = document.getElementById('leaderboardList') as HTMLDivElement;

// Admin Portal Elements
const userSearch = document.getElementById('userSearch') as HTMLInputElement;
const usersList = document.getElementById('usersList') as HTMLTableSectionElement;
const studentData = document.getElementById('studentData') as HTMLTextAreaElement;
const uploadStudentsBtn = document.getElementById('uploadStudents') as HTMLButtonElement;

// Check In Page Elements
const participantSearch = document.getElementById('participantSearch') as HTMLInputElement;
const participantsList = document.getElementById('participantsList') as HTMLTableSectionElement;

let users: any[] = [];

let participants: Participant[] = [];
let unsubscribeParticipants: (() => void) | null = null;

// Add new interface for sort state
interface SortState {
    column: string;
    direction: 'asc' | 'desc';
}

// Add new variables for sorting
let currentSort: SortState = {
    column: 'teamNumber',
    direction: 'asc'
};

// Navigation
function showPage(pageId: string) {
    cleanup(); // Clean up previous listeners
    
    [homePage, checkInPage, leaderboardPage, judgePage, adminPage].forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId)?.classList.add('active');

    [homeBtn, checkInBtn, leaderboardBtn, judgeBtn, adminBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${pageId.replace('Page', 'Btn')}`)?.classList.add('active');

    if (pageId === 'adminPage') {
        loadUsers();
    } else if (pageId === 'checkInPage') {
        loadParticipants();
    }
}

// Event Listeners for Navigation
homeBtn.addEventListener('click', () => showPage('homePage'));
checkInBtn.addEventListener('click', () => showPage('checkInPage'));
leaderboardBtn.addEventListener('click', () => showPage('leaderboardPage'));
judgeBtn.addEventListener('click', () => showPage('judgePage'));
adminBtn.addEventListener('click', () => showPage('adminPage'));

// Leaderboard
async function updateLeaderboard() {
    try {
        // Placeholder for leaderboard data
        leaderboardList.innerHTML = `
            <div class="leaderboard-item">
                <span>Sample User 1</span>
                <span>100</span>
            </div>
            <div class="leaderboard-item">
                <span>Sample User 2</span>
                <span>90</span>
            </div>
        `;
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

// Admin Portal Functions
async function loadUsers() {
    try {
        // Placeholder for user data
        users = [
            { id: '1', email: 'user1@example.com', role: 'volunteer', registrationDate: new Date().toISOString() },
            { id: '2', email: 'user2@example.com', role: 'judge', registrationDate: new Date().toISOString() }
        ];
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users. Please try again.');
    }
}

function displayUsers(usersToDisplay: any[]) {
    usersList.innerHTML = '';
    usersToDisplay.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.email}</td>
            <td>
                <select class="role-select" data-user-id="${user.id}">
                    <option value="volunteer" ${user.role === 'volunteer' ? 'selected' : ''}>Volunteer</option>
                    <option value="judge" ${user.role === 'judge' ? 'selected' : ''}>Judge</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn save" data-user-id="${user.id}">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="action-btn delete" data-user-id="${user.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        usersList.appendChild(row);
    });

    // Add event listeners for role changes
    document.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', handleRoleChange);
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.action-btn.save').forEach(btn => {
        btn.addEventListener('click', handleSaveRole);
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', handleDeleteUser);
    });
}

async function handleRoleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const userId = select.dataset.userId;
    const newRole = select.value;
    
    try {
        // Placeholder for role update
        alert('Role updated successfully!');
    } catch (error) {
        console.error('Error updating role:', error);
        alert('Error updating role. Please try again.');
        loadUsers(); // Reload to revert changes
    }
}

async function handleSaveRole(event: Event) {
    const btn = event.target as HTMLButtonElement;
    const userId = btn.dataset.userId;
    const select = document.querySelector(`.role-select[data-user-id="${userId}"]`) as HTMLSelectElement;
    
    try {
        // Placeholder for role save
        alert('Role saved successfully!');
    } catch (error) {
        console.error('Error saving role:', error);
        alert('Error saving role. Please try again.');
        loadUsers(); // Reload to revert changes
    }
}

async function handleDeleteUser(event: Event) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    const btn = event.target as HTMLButtonElement;
    const userId = btn.dataset.userId;
    
    try {
        // Placeholder for user deletion
        alert('User deleted successfully!');
        loadUsers(); // Reload the users list
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
    }
}

// Search functionality
userSearch.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm)
    );
    displayUsers(filteredUsers);
});

// Load participants data
async function loadParticipants() {
    try {
        // Set up real-time listener for participants
        unsubscribeParticipants = db.onParticipantsUpdate((updatedParticipants) => {
            participants = updatedParticipants;
            displayParticipants(participants);
        });
    } catch (error) {
        console.error('Error loading participants:', error);
        alert('Error loading participants. Please try again.');
    }
}

function getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isArrivalTimeValid(arrivalTime: string): boolean {
    const currentTime = getCurrentTime();
    return arrivalTime <= currentTime;
}

function getParticipantStatus(participant: Participant): Participant['status'] {
    if (participant.isCheckedIn) {
        return 'checked-in';
    }
    
    if (participant.arrivalTime && !isArrivalTimeValid(participant.arrivalTime)) {
        return 'waiting-area';
    }
    
    return 'not-checked-in';
}

function displayParticipants(participantsToDisplay: Participant[]) {
    participantsList.innerHTML = '';
    
    // Create header row with sort buttons
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th class="sortable" data-column="teamNumber">
            Team Number <i class="fas fa-sort"></i>
            ${currentSort.column === 'teamNumber' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="teamName">
            Team Name <i class="fas fa-sort"></i>
            ${currentSort.column === 'teamName' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="firstName">
            First Name <i class="fas fa-sort"></i>
            ${currentSort.column === 'firstName' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="lastName">
            Last Name <i class="fas fa-sort"></i>
            ${currentSort.column === 'lastName' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="grade">
            Grade <i class="fas fa-sort"></i>
            ${currentSort.column === 'grade' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="schoolName">
            School Name <i class="fas fa-sort"></i>
            ${currentSort.column === 'schoolName' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="category">
            Category <i class="fas fa-sort"></i>
            ${currentSort.column === 'category' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="arrivalTime">
            Arrival Time <i class="fas fa-sort"></i>
            ${currentSort.column === 'arrivalTime' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th class="sortable" data-column="status">
            Status <i class="fas fa-sort"></i>
            ${currentSort.column === 'status' ? `<i class="fas fa-sort-${currentSort.direction === 'asc' ? 'up' : 'down'}"></i>` : ''}
        </th>
        <th>Actions</th>
    `;
    participantsList.appendChild(headerRow);

    // Add click event listeners to sortable headers
    headerRow.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            if (column) {
                if (currentSort.column === column) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = column;
                    currentSort.direction = 'asc';
                }
                displayParticipants(participantsToDisplay);
            }
        });
    });

    // Sort participants based on current sort state
    const sortedParticipants = [...participantsToDisplay].sort((a, b) => {
        let aValue = a[currentSort.column as keyof Participant];
        let bValue = b[currentSort.column as keyof Participant];

        // Handle special cases
        if (currentSort.column === 'status') {
            aValue = getParticipantStatus(a);
            bValue = getParticipantStatus(b);
        }

        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Compare values
        if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Display sorted participants
    sortedParticipants.forEach(participant => {
        const status = getParticipantStatus(participant);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.teamNumber.padStart(4, '0')}</td>
            <td>${participant.teamName}</td>
            <td>${participant.firstName}</td>
            <td>${participant.lastName}</td>
            <td>${participant.grade}</td>
            <td>${participant.schoolName}</td>
            <td>${participant.category}</td>
            <td>${participant.arrivalTime || 'Not set'}</td>
            <td>
                <span class="status-badge ${status}">
                    <i class="fas ${status === 'checked-in' ? 'fa-check-circle' : 
                                  status === 'waiting-area' ? 'fa-clock' : 
                                  'fa-times-circle'}"></i>
                    ${status === 'checked-in' ? 'Checked In' : 
                      status === 'waiting-area' ? 'Waiting Area' : 
                      'Not Checked In'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    ${!participant.isCheckedIn ? `
                        <button class="check-in-btn" data-participant-id="${participant.id}">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        participantsList.appendChild(row);
    });

    // Add event listeners for check-in buttons
    document.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', handleCheckIn);
    });
}

async function handleCheckIn(event: Event) {
    const btn = event.target as HTMLButtonElement;
    const participantId = btn.dataset.participantId;
    
    try {
        if (!participantId) {
            throw new Error('Participant ID not found');
        }

        const participant = participants.find(p => p.id === participantId);
        if (participant) {
            if (!participant.arrivalTime) {
                alert('Please set arrival time before checking in.');
                return;
            }

            if (!isArrivalTimeValid(participant.arrivalTime)) {
                alert('Cannot check in before arrival time. Please wait until the scheduled arrival time.');
                return;
            }

            // Update participant status in Firebase
            await db.updateParticipant(participantId, {
                isCheckedIn: true,
                status: 'checked-in'
            });

            // Add check-in record
            await db.addCheckIn({
                participantId,
                checkInTime: getCurrentTime(),
                status: 'checked-in'
            });

            alert('Participant checked in successfully!');
        }
    } catch (error) {
        console.error('Error checking in participant:', error);
        alert('Error checking in participant. Please try again.');
    }
}

// Search functionality for participants
participantSearch.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    const filteredParticipants = participants.filter(participant => 
        participant.teamNumber.toLowerCase().includes(searchTerm) ||
        participant.teamName.toLowerCase().includes(searchTerm) ||
        participant.firstName.toLowerCase().includes(searchTerm) ||
        participant.lastName.toLowerCase().includes(searchTerm) ||
        participant.schoolName.toLowerCase().includes(searchTerm)
    );
    displayParticipants(filteredParticipants);
});

// Clean up listeners when changing pages
function cleanup() {
    if (unsubscribeParticipants) {
        unsubscribeParticipants();
        unsubscribeParticipants = null;
    }
}

// Student Registration
function parseCSV(csv: string): StudentRegistration[] {
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

function showMessage(message: string, type: 'success' | 'error') {
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

async function handleStudentUpload() {
    try {
        const csvData = studentData.value.trim();
        if (!csvData) {
            showMessage('Please enter student data', 'error');
            return;
        }

        const students = parseCSV(csvData);
        if (students.length === 0) {
            showMessage('No valid student data found', 'error');
            return;
        }

        uploadStudentsBtn.disabled = true;
        uploadStudentsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        await db.registerStudents(students);
        
        showMessage(`Successfully registered ${students.length} students`, 'success');
        studentData.value = '';
    } catch (error) {
        console.error('Error uploading students:', error);
        showMessage('Error uploading students. Please check the data format and try again.', 'error');
    } finally {
        uploadStudentsBtn.disabled = false;
        uploadStudentsBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Students';
    }
}

// Event Listeners
uploadStudentsBtn.addEventListener('click', handleStudentUpload);

// Initial leaderboard update
updateLeaderboard(); 