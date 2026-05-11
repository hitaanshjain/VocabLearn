# Local Development

## Requirements

- Node.js 18 or newer
- npm

## Install

```bash
cd back-end
npm install

cd ../front-end
npm install
```

## Environment

Create `back-end/.env` with your local values:

```env
PORT=3000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key
```

## Run Locally

```bash
cd back-end
npm start
```

In a second terminal:

```bash
cd front-end
npm run dev
```

## Validation

```bash
cd back-end
npm test
npm run lint

cd ../front-end
npm run lint
npm run build
```

## Portfolio Notes

If you are presenting this publicly, consider adding a short section to the README with screenshots, your role on the project, and a few measurable outcomes such as quiz completion, saved-word counts, or deployment uptime.
