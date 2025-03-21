# Bridge Building Competition Web App

A web application for managing a bridge building competition, featuring user registration, judge scoring system, and a leaderboard.

## Features

- User Registration and Authentication
- Judge Scoring System
- Real-time Leaderboard
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd bridge-competition-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings
   - Replace the placeholder values in `src/firebase-config.ts` with your actual Firebase configuration

4. Start the development server:
```bash
npm start
```

5. Build for production:
```bash
npm run build
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
   - Create a new repository on GitHub
   - Push your code to the repository
   - Go to repository Settings > Pages
   - Select the `gh-pages` branch as the source
   - Your site will be available at `https://<your-username>.github.io/<repository-name>`

## Project Structure

```
bridge-competition-app/
├── src/
│   ├── index.html
│   ├── index.ts
│   ├── styles.css
│   └── firebase-config.ts
├── package.json
├── tsconfig.json
├── webpack.config.js
└── README.md
```

## Technologies Used

- TypeScript
- Firebase (Authentication & Firestore)
- Webpack
- HTML5 & CSS3

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 