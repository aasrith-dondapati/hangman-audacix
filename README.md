# Hangman Game - Audacix Code Exercise

A Django REST Framework API with a React frontend for a Hangman game.

## Features

- RESTful API built with Django REST Framework
- SQLite database for easy setup and testing
- React frontend with modern UI
- Complete game state management
- Real-time game updates

## Requirements

- Python 3.8+
- Node.js 14+ and npm
- Virtual environment (venv)

## Setup Instructions

### Backend Setup

1. **Create and activate virtual environment** (if not already done):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

4. **Start the Django development server**:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## API Endpoints

### 1. Create New Game
- **Endpoint**: `POST /game/new`
- **Response**: `{ "id": <game_id> }`

### 2. Get Game State
- **Endpoint**: `GET /game/<game_id>`
- **Response**:
  ```json
  {
    "status": "InProgress|Won|Lost",
    "word_state": "P__",
    "incorrect_guesses_made": 0,
    "incorrect_guesses_remaining": 2
  }
  ```

### 3. Make a Guess
- **Endpoint**: `POST /game/<game_id>/guess`
- **Request Body**: `{ "letter": "P" }`
- **Response**:
  ```json
  {
    "correct": true,
    "status": "InProgress|Won|Lost",
    "word_state": "P__",
    "incorrect_guesses_made": 0,
    "incorrect_guesses_remaining": 2
  }
  ```

## Game Rules

- Words are randomly selected from: ["Hangman", "Python", "Audacix", "Bottle", "Pen"]
- Players can make incorrect guesses equal to half the word length (rounded up)
- Example: "Pen" (3 letters) allows 2 incorrect guesses
- Game status can be: `InProgress`, `Won`, or `Lost`

## Project Structure

```
hangman-audacix/
├── hangman_api/          # Django project settings
├── game/                  # Game app
│   ├── models.py         # Game model
│   ├── views.py          # API views
│   ├── serializers.py    # API serializers
│   └── urls.py           # URL routing
├── frontend/             # React application
│   └── src/
│       ├── App.js        # Main game component
│       └── App.css       # Styling
└── manage.py            # Django management script
```

## Testing

To test the API endpoints, you can use curl or any API client:

```bash
# Create a new game
curl -X POST http://localhost:8000/game/new -H "Content-Type: application/json"

# Get game state (replace <id> with actual game ID)
curl http://localhost:8000/game/<id>

# Make a guess (replace <id> with actual game ID)
curl -X POST http://localhost:8000/game/<id>/guess \
  -H "Content-Type: application/json" \
  -d '{"letter": "P"}'
```

## Notes

- The backend uses SQLite by default for easy setup
- CORS is configured to allow requests from `http://localhost:3000`
- The frontend automatically refreshes game state every second when a game is in progress
