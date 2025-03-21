import './styles.css';
import { db, Participant, CheckedInStudent } from './firebase-config';
import { CheckInForm } from './components/CheckInForm';
import { ParticipantsTable } from './components/ParticipantsTable';
import { JudgePortal } from './components/JudgePortal';
import { AdminPanel } from './components/AdminPanel';
import { Leaderboard } from './components/Leaderboard';

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
const checkInBtn = document.getElementById('checkInBtn') as HTMLButtonElement;
const leaderboardBtn = document.getElementById('leaderboardBtn') as HTMLButtonElement;
const judgeBtn = document.getElementById('judgeBtn') as HTMLButtonElement;
const adminBtn = document.getElementById('adminBtn') as HTMLButtonElement;

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

// Add generate random students button
const generateRandomStudentsBtn = document.createElement('button');
generateRandomStudentsBtn.className = 'primary-btn';
generateRandomStudentsBtn.innerHTML = '<i class="fas fa-random"></i> Generate Random Students';
generateRandomStudentsBtn.style.marginBottom = '1rem';
document.querySelector('.registration-form')?.insertBefore(generateRandomStudentsBtn, studentData);

// Check In Page Elements
const participantSearch = document.getElementById('participantSearch') as HTMLInputElement;
const participantsList = document.getElementById('participantsList') as HTMLTableSectionElement;

// Judge Portal Elements
const checkedInStudentsDropdown = document.getElementById('checkedInStudents') as HTMLSelectElement;
const judgeDetails = document.querySelector('.judge-details') as HTMLDivElement;
const judgeSearchInput = document.getElementById('judgeSearch') as HTMLInputElement;

let users: any[] = [];

let participants: Participant[] = [];
let unsubscribeParticipants: (() => void) | null = null;

let allCheckedInStudents: CheckedInStudent[] = [];
let filteredCheckedInStudents: CheckedInStudent[] = [];
let unsubscribeCheckedInStudents: (() => void) | null = null;

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

// Initialize components
const checkInForm = new CheckInForm();
const participantsTable = new ParticipantsTable();
const judgePortal = new JudgePortal();
const adminPanel = new AdminPanel();
const leaderboard = new Leaderboard();

// Handle navigation
function handleNavigation() {
    const hash = window.location.hash.slice(1) || 'checkIn';
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');

    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === hash) {
            page.classList.add('active');
        }
    });

    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === hash) {
            btn.classList.add('active');
        }
    });
}

// Add navigation event listeners
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (e.currentTarget as HTMLElement).getAttribute('data-page')!;
        window.location.hash = page;
        handleNavigation();
    });
});

// Handle initial navigation and hash changes
window.addEventListener('load', handleNavigation);
window.addEventListener('hashchange', handleNavigation);

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
    
    if (participant.status === 'waiting-area') {
        return 'waiting-area';
    }
    
    return 'registered';
}

function displayParticipants(participantsToDisplay: Participant[]) {
    console.log('Displaying participants with updated check-in functionality');
    participantsList.innerHTML = '';
    
    // Create header row
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
                                  'fa-user'}"></i>
                    ${status === 'checked-in' ? 'Checked In' : 
                      status === 'waiting-area' ? 'Waiting Area' : 
                      'Registered'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    ${!participant.isCheckedIn ? `
                        ${participant.status === 'registered' ? `
                            <button class="waiting-area-btn" data-participant-id="${participant.id}">
                                <i class="fas fa-clock"></i>
                            </button>
                            <button class="check-in-btn" data-participant-id="${participant.id}">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        ${participant.status === 'waiting-area' ? `
                            <button class="check-in-btn" data-participant-id="${participant.id}">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    ` : ''}
                </div>
            </td>
        `;
        participantsList.appendChild(row);
    });

    // Add event listeners for check-in and waiting area buttons
    document.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', handleCheckIn);
    });
    document.querySelectorAll('.waiting-area-btn').forEach(btn => {
        btn.addEventListener('click', handleWaitingArea);
    });
}

async function handleWaitingArea(event: Event) {
    const btn = event.target as HTMLButtonElement;
    const participantId = btn.dataset.participantId;
    
    try {
        if (!participantId) {
            throw new Error('Participant ID not found');
        }

        const participant = participants.find(p => p.id === participantId);
        if (!participant) {
            throw new Error('Participant not found');
        }

        const currentTime = getCurrentTime();
        const currentDate = new Date().toISOString().split('T')[0];

        // Update participant status in Firebase
        await db.updateParticipant(participantId, {
            status: 'waiting-area',
            arrivalTime: currentTime
        });

        // Add check-in record
        await db.addCheckIn({
            participantId,
            checkInTime: currentTime,
            status: 'waiting-area'
        });

        showMessage('Participant moved to waiting area successfully!', 'success');
    } catch (error) {
        console.error('Error moving participant to waiting area:', error);
        showMessage('Error moving participant to waiting area. Please try again.', 'error');
    }
}

async function handleCheckIn(event: Event) {
    const btn = event.target as HTMLButtonElement;
    const participantId = btn.dataset.participantId;
    
    try {
        if (!participantId) {
            throw new Error('Participant ID not found');
        }

        const participant = participants.find(p => p.id === participantId);
        if (!participant) {
            throw new Error('Participant not found');
        }

        const currentTime = getCurrentTime();
        const currentDate = new Date().toISOString().split('T')[0];

        // Update participant status in Firebase
        await db.updateParticipant(participantId, {
            isCheckedIn: true,
            status: 'checked-in',
            arrivalTime: participant.arrivalTime || currentTime
        });

        // Add check-in record
        await db.addCheckIn({
            participantId,
            checkInTime: currentTime,
            status: 'checked-in'
        });

        // Add to checked-in students table
        await db.addCheckedInStudent({
            ...participant,
            checkInTime: currentTime,
            checkInDate: currentDate,
            isCheckedIn: true,
            status: 'checked-in'
        });

        showMessage('Participant checked in successfully!', 'success');
    } catch (error) {
        console.error('Error checking in participant:', error);
        showMessage('Error checking in participant. Please try again.', 'error');
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

// Judge Portal Functions
async function loadCheckedInStudents() {
    try {
        // Set up real-time listener for checked-in students
        unsubscribeCheckedInStudents = db.onCheckedInStudentsUpdate((updatedStudents) => {
            allCheckedInStudents = updatedStudents;
            filteredCheckedInStudents = updatedStudents;
            updateCheckedInStudentsDropdown();
        });
    } catch (error) {
        console.error('Error loading checked-in students:', error);
        showMessage('Error loading checked-in students. Please try again.', 'error');
    }
}

function updateCheckedInStudentsDropdown() {
    checkedInStudentsDropdown.innerHTML = '<option value="">Select a student...</option>';
    
    filteredCheckedInStudents.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.teamNumber.padStart(4, '0')} - ${student.firstName} ${student.lastName} (${student.schoolName})`;
        checkedInStudentsDropdown.appendChild(option);
    });
}

// Add search functionality for judge portal
judgeSearchInput.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    
    filteredCheckedInStudents = allCheckedInStudents.filter(student => 
        student.teamNumber.toLowerCase().includes(searchTerm) ||
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.schoolName.toLowerCase().includes(searchTerm)
    );
    
    updateCheckedInStudentsDropdown();
});

function displayStudentDetails(studentId: string) {
    const student = filteredCheckedInStudents.find(s => s.id === studentId);
    if (!student) {
        judgeDetails.innerHTML = '<p>No student selected</p>';
        return;
    }

    judgeDetails.innerHTML = `
        <h3>Student Details</h3>
        <div class="student-info">
            <p><strong>Team Number:</strong> ${student.teamNumber.padStart(4, '0')}</p>
            <p><strong>Team Name:</strong> ${student.teamName}</p>
            <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
            <p><strong>Grade:</strong> ${student.grade}</p>
            <p><strong>School:</strong> ${student.schoolName}</p>
            <p><strong>Category:</strong> ${student.category}</p>
            <p><strong>Check-in Time:</strong> ${student.checkInTime}</p>
            <p><strong>Check-in Date:</strong> ${student.checkInDate}</p>
        </div>
    `;
}

// Event Listeners
checkedInStudentsDropdown.addEventListener('change', (e) => {
    const studentId = (e.target as HTMLSelectElement).value;
    displayStudentDetails(studentId);
});

// Initial leaderboard update
updateLeaderboard(); 