# Database Schema

## Agents Table

The agents table stores information about AI agents in the system.

### Table Structure

| Column      | Type      | Description                                    | Constraints        |
|-------------|-----------|------------------------------------------------|-------------------|
| id          | uuid      | Unique identifier for the agent                | Primary Key       |
| name        | text      | Name of the agent                              | Not Null          |
| status      | text      | Current status of the agent                    | Not Null          |
| trust_score | integer   | Trust score of the agent (0-100)              | Not Null          |
| ai_score    | integer   | AI performance score (0-100)                   | Not Null          |
| type        | text      | Type/category of the agent                     | Not Null          |
| last_update | timestamp | Last time the agent was updated                | Not Null          |
| created_at  | timestamp | When the agent was created                     | Not Null          |

### Status Types
- active
- training
- inactive
- error

### Agent Types
- analyzer
- classifier
- predictor
- processor

### Example Entry 