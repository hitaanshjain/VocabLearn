# VocabLearn

## Description and Product Vision Statement

VocabLearn is a full-stack application that allows users to learn and practice new words to expand their vocabulary.

Our minimum viable product features a word bank to which the user can add words, which can be either entered by the user or generated. Once users accumulate enough words, they can be quizzed on the words in their bank, and they can see how many times they have successfully answers questions involving a given word. In addition, the app includes a reverse dictionary feature for users to look up words based on a prompt or definition.

## Team members

[Akshara Taraniganty](https://github.com/akshara-t)  
[Hitaansh Jain](https://github.com/hitaanshjain)  
[Wonden Gyatso](https://github.com/wondeng)  
[Sara Herschmann](https://github.com/saramhersch)  
[Jaylon McDuffie](https://github.com/treejitsu)

## Deployment

Frontend: [https://vocab-learn-frontend.onrender.com](https://vocab-learn-frontend.onrender.com)

Backend: [https://vocab-learn-api.onrender.com](https://vocab-learn-api.onrender.com)

Continuous deployment is configured with GitHub Actions and Render deploy hooks in [.github/workflows/cd.yml](.github/workflows/cd.yml).

For local setup and testing, see [CONTRIBUTING.md](CONTRIBUTING.md).

## History

VocabLearn was created as a way to help users expand their vocabulary and easily learn new words through quizzes and repitition. The idea originated from personal experiences of trying to find better vocabulary while writing as an English minor.

Please refer to our [CONTRIBUTING.md](https://github.com/agile-students-spring2026/final-subparallel/blob/master/CONTRIBUTING.md) file for guidelines on collaboration, responsibilities, and accountability among team members.

## Building and Testing

### Prerequisites

1. Install Node.js 18+ (includes npm).
2. Clone this repository.

### 1) Back-end setup and run

From the project root:

```bash
cd back-end
npm install
```

Create a `.env` file in `back-end/`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the API server:

```bash
npm start
```

Back-end runs at `http://localhost:3000`.

### 2) Front-end setup and run

Open a second terminal. From the project root:

```bash
cd front-end
npm install
npm run dev
```

Front-end runs at `http://localhost:5173`.

### Quick run checklist

1. Start back-end first (`back-end`, `npm start`).
2. Start front-end second (`front-end`, `npm run dev`).
3. Open `http://localhost:5173` in your browser.

## Continuous Integration

This project uses GitHub Actions to automate testing and deployment workflows.

Current workflows include:
- Automated backend testing
- Frontend build validation
- Continuous deployment workflows
- Git activity logging for project tracking
