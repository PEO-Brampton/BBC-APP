# Bridge Competition App

A web application for managing a bridge building competition, built with TypeScript and Firebase.

## Features

- User authentication (register/login)
- Leaderboard system
- Judge portal for evaluating submissions
- Modern, responsive UI with a static sidebar navigation
- Real-time updates using Firebase

## Tech Stack

- TypeScript
- Firebase (Authentication & Firestore)
- HTML5
- CSS3
- Font Awesome Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bridge-competition.git
cd bridge-competition
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Copy your Firebase configuration to `src/firebase-config.ts`

4. Start the development server:
```bash
npm start
```

## Project Structure

```
src/
├── index.html          # Main HTML file
├── index.ts           # Main TypeScript file
├── styles.css         # Global styles
└── firebase-config.ts # Firebase configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 