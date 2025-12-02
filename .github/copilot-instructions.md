# GatorQuest Copilot Instructions

## Project Overview
GatorQuest is a story-driven university simulation game where players progress through four years of college (Freshman through Senior). Players make decisions that affect GPA, energy, social status, and money. The game ends based on win/lose conditions tied to player stats.

## Architecture

### Backend (Node.js/Express in `backend/`)
- **MongoDB database** with models: `Player`, `Quest` (stories), `User`
- **RESTful API** with controllers handling:
  - Player stats management (`playerController.js`)
  - Quest/story progression (`questController.js`)
  - Game state (`gameController.js`)
  - User authentication (`userController.js`)
- **Key endpoints**: `/api/players/{id}/{action}` (study, rest, party, etc.), `/api/quests/complete`
- **Middleware**: Auth validation (`authMiddleware.js`), admin checks (`adminMiddleware.js`)

### Frontend (Angular in `frontend/gator-quest-app/`)
- **Standalone components** (no NgModules)
- **Home component** manages game state flow: menu → game → gameover
- **Text-box component** displays stories and choices, handles player actions
- **Story progression**: Lives in `storyChoices.ts` as array of 20+ indexed stories
- **State tracking**: Stories cycle through array; game-over triggers when backend signals completion

## Critical Patterns

### Game End Conditions
When all quests are completed, check win/lose:
- **Fail**: GPA < 1.0 → "Failed out of UF"
- **Win**: Day ≥ 100 AND GPA ≥ 3.0 → "Graduated successfully"
- Logic in `gameController.js` `checkGameEnd()`, called from `questController.js` `completeQuest()`

### Story-Quest Mapping
- **Frontend**: 20+ stories in `storyChoices.ts` (hardcoded array, no database)
- **Backend**: Quest documents in MongoDB (separate from story display)
- **Flow**: Player selects choice → action sent to backend → stats updated → backend triggers quest completion check → returns `gameOver` flag if all quests done

### Player Actions
Valid actions trigger API calls: `study`, `rest`, `party`, `workout`, `class`, `event`, `eat`, `visit`
Response format includes:
```javascript
{ 
  message: string, 
  player: { gpa, energy, social, money, day, ... },
  gameOver?: boolean,
  gameStatus?: "graduated" | "failed",
  allQuestsCompleted?: boolean
}
```

### Frontend State Machine
- **"menu"** → user at start screen
- **"game"** → playing with stories displaying
- **"gameover"** → terminal state, shows final stats + restart button

## Key Files
- `backend/controllers/questController.js` - Quest completion + game-end check
- `backend/controllers/gameController.js` - Contains `checkGameEnd()` function
- `backend/models/questModel.js` - Tracks quest completion status
- `frontend/gator-quest-app/src/app/home/home.ts` - Game flow, state transitions
- `frontend/gator-quest-app/src/app/story/storyChoices.ts` - All story text/choices
- `.env` - Backend port (5000), MongoDB connection

## Debugging Tips
- Backend logs: "Day X begins", "Quest completed", "Game Over"
- Frontend logs: Story updates, player stats, game-over emissions
- Check browser localStorage: `playerId`, `playerName` for auth persistence
- GPA/Day progression should match story index progression (test with fixed quest array)

## Common Tasks
- **Add story**: Push new object to `storyChoices` array with unique `id`
- **Adjust win conditions**: Edit `checkGameEnd()` in `gameController.js` (day threshold, GPA threshold)
- **Add player action**: Add handler in `playerController.js`, register in text-box valid commands set
- **Test game-over**: Set GPA < 1.0 or manually advance day > 100 via API
