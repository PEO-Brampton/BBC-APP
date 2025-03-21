import './styles.css';
import { auth, db } from './firebase-config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    where,
    updateDoc,
    doc
} from 'firebase/firestore';

// DOM Elements
const sidebar = document.querySelector('.sidebar') as HTMLElement;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement;
const registerBtn = document.getElementById('registerBtn') as HTMLButtonElement;
const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
const leaderboardBtn = document.getElementById('leaderboardBtn') as HTMLButtonElement;
const judgeBtn = document.getElementById('judgeBtn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logoutBtn') as HTMLButtonElement;

const homePage = document.getElementById('homePage') as HTMLDivElement;
const registerPage = document.getElementById('registerPage') as HTMLDivElement;
const loginPage = document.getElementById('loginPage') as HTMLDivElement;
const leaderboardPage = document.getElementById('leaderboardPage') as HTMLDivElement;
const judgePage = document.getElementById('judgePage') as HTMLDivElement;

const registerForm = document.getElementById('registerForm') as HTMLFormElement;
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const leaderboardList = document.getElementById('leaderboardList') as HTMLDivElement;

let currentUser: User | null = null;

// Navigation
function showPage(pageId: string) {
    [homePage, registerPage, loginPage, leaderboardPage, judgePage].forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId)?.classList.add('active');

    [homeBtn, registerBtn, loginBtn, leaderboardBtn, judgeBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${pageId.replace('Page', 'Btn')}`)?.classList.add('active');
}

// Event Listeners for Navigation
homeBtn.addEventListener('click', () => showPage('homePage'));
registerBtn.addEventListener('click', () => showPage('registerPage'));
loginBtn.addEventListener('click', () => showPage('loginPage'));
leaderboardBtn.addEventListener('click', () => showPage('leaderboardPage'));
judgeBtn.addEventListener('click', () => showPage('judgePage'));

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showPage('homePage');
        alert('Logged out successfully!');
    } catch (error) {
        alert('Error logging out: ' + error);
    }
});

// Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            name,
            email,
            role: 'participant',
            score: 0
        });
        alert('Registration successful!');
        showPage('homePage');
    } catch (error) {
        alert('Registration failed: ' + error);
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const password = (document.getElementById('loginPassword') as HTMLInputElement).value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        showPage('homePage');
    } catch (error) {
        alert('Login failed: ' + error);
    }
});

// Leaderboard
async function updateLeaderboard() {
    try {
        const q = query(collection(db, 'users'), orderBy('score', 'desc'));
        const querySnapshot = await getDocs(q);
        
        leaderboardList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userElement = document.createElement('div');
            userElement.className = 'leaderboard-item';
            userElement.innerHTML = `
                <span>${userData.name}</span>
                <span>${userData.score}</span>
            `;
            leaderboardList.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        // User is signed in
        registerBtn.style.display = 'none';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        leaderboardBtn.style.display = 'block';
        judgeBtn.style.display = 'block';
    } else {
        // User is signed out
        registerBtn.style.display = 'block';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        leaderboardBtn.style.display = 'none';
        judgeBtn.style.display = 'none';
    }
});

// Initial leaderboard update
updateLeaderboard(); 