# Bridge Competition Management System

A web application for managing the Bridge Competition, including student check-in, judging, and score tracking.

## Features

- Student Check-in System
- Real-time Participant Management
- Judge Portal for Scoring
- Leaderboard Display
- Admin Panel for User Management
- Bulk Student Registration via CSV

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PEO-Brampton/BBC-APP.git
cd BBC-APP
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Realtime Database
   - Copy your Firebase configuration
   - Update the configuration in `src/services/firebase.ts`

## Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4000`.

## Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/     # UI Components
├── services/      # Firebase and other services
├── utils/         # Helper functions
├── types/         # TypeScript interfaces
├── index.ts       # Main application entry
├── index.html     # HTML template
└── styles.css     # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 