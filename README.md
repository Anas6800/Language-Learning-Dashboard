# Language Learning Dashboard

A comprehensive web application for learning and practicing multiple languages with vocabulary management, quizzes, and progress tracking.

## Features

### 🔐 Authentication
- Firebase Authentication system
- Secure user registration and login
- Email/password authentication

### 📚 Vocabulary Management
- Add new words with translations and examples
- Organize words by language and category
- Difficulty levels (Easy, Medium, Hard)
- Search and filter functionality
- Track word progress and review history

### 🧠 Quiz System
- Random quiz generation from saved words
- Customizable quiz settings (language, difficulty, question count)
- Real-time feedback and scoring
- Quiz history and performance tracking

### 📊 Progress Tracking
- Comprehensive statistics dashboard
- Interactive charts showing learning progress
- Language distribution visualization
- Achievement system
- Study streak tracking

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark mode support
- Clean and intuitive interface
- Smooth animations and transitions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd language-learning-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Firebase Setup:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. Configure Firebase:
   - Open `src/firebase.ts`
   - Replace the placeholder configuration with your Firebase project details

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Firebase Configuration

Update `src/firebase.ts` with your Firebase project configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── Vocabulary/
│   │   └── VocabularyManager.tsx
│   ├── Quiz/
│   │   └── QuizManager.tsx
│   └── Progress/
│       └── ProgressTracker.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── VocabularyContext.tsx
│   ├── QuizContext.tsx
│   └── ProgressContext.tsx
├── types/
│   └── vocabulary.ts
├── firebase.ts
├── App.tsx
└── index.css
```

## Features in Detail

### Vocabulary Management
- Add words with original text, translation, language, category, and example sentences
- Filter words by language, difficulty, or search terms
- Track review history and performance for each word
- Delete words you no longer need

### Quiz System
- Generate quizzes from your vocabulary
- Choose specific languages or difficulty levels
- Get immediate feedback on your answers
- Track your overall accuracy and improvement

### Progress Tracking
- Visual charts showing your learning over time
- Statistics on total words learned and quiz performance
- Achievement system to motivate your learning
- Study streak tracking to maintain consistency

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Build the application:
```bash
npm run build
```

5. Deploy to Firebase Hosting:
```bash
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

Built with ❤️ for language learners everywhere
