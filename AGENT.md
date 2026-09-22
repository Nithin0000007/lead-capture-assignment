# AGENT.md

## AI Tools Used
- Gemini CLI (Agent) for code generation, architectural advice, and task orchestration.

## AI Tool Usage
- `codebase_investigator` (conceptual): Used for understanding the project structure and dependencies.
- `generalist` (conceptual): Used for refactoring the codebase, adding new models and endpoints, and setting up testing infrastructure.

## Important Prompts
- "Create an implementation plan for Senior assignment features."
- "Implement an Activity/Audit system that captures granular field changes."
- "Refactor lead normalization logic into reusable functions."

## Engineering Decisions
- **Architecture:** Introduced a service layer (`services/`) to keep controllers thin and improve maintainability, following the Senior assignment requirements.
- **Database:** Added `Activity` model to support audit logging, linked to `Lead`.
- **Normalization:** Centralized name (Title Case) and phone (E.164) normalization in `server/src/services/leadService.ts` to ensure consistency across the application.
- **Dockerization:** Provided `Dockerfile`s and `docker-compose.yml` to ensure reproducible development and production environments.
