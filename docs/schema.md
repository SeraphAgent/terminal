# Database Schema

## Agents Table

The agents table stores information about AI agents in the system.

### Table Structure

| Column      | Type      | Description                      | Constraints |
| ----------- | --------- | -------------------------------- | ----------- |
| id          | uuid      | Unique identifier for the agent  | Primary Key |
| name        | text      | Name of the agent                | Not Null    |
| status      | text      | Current status of the agent      | Not Null    |
| trust_score | integer   | Trust score of the agent (0-100) | Not Null    |
| ai_score    | integer   | AI performance score (0-100)     | Not Null    |
| x_handle    | text      | X (Twitter) handle               | Nullable    |
| type        | text      | Type/category of the agent       | Not Null    |
| last_update | timestamp | Last time the agent was updated  | Not Null    |
| created_at  | timestamp | When the agent was created       | Not Null    |

### Status Types

- `active`: Agent is currently operational
- `training`: Agent is in training phase
- `inactive`: Agent is currently not active
- `error`: Agent has encountered an error

### Agent Types

- analyzer
- classifier
- predictor
- processor
