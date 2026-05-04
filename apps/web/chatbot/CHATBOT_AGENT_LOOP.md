# Operon Chatbot Agent Loop

Use this loop when the user says `improve chatbot`.

## Loop

1. Read chatbot memory files:
   - `apps/web/chatbot/CHATBOT_AGENT.md`
   - `apps/web/chatbot/CHATBOT_MEMORY.md`
   - `apps/web/chatbot/CHATBOT_CONVERSATION_FLOWS.md`
   - `apps/web/chatbot/CHATBOT_JSON_SCHEMA.md`
   - `apps/web/chatbot/CHATBOT_AGENT_LOOP.md`
   - `apps/web/chatbot/INTEGRATION.md`
2. Inspect relevant site files only as read-only context:
   - `apps/web/AGENTS.md`
   - `apps/web/AGENT_LOOP.md`
   - `apps/web/PROJECT_MEMORY.md`
   - quote, product, pricing, SEO, or page files relevant to the task
3. Improve one chatbot area only:
   - prompts
   - logic
   - state mapping
   - policy
   - knowledge
   - scenarios
   - UI
   - tests
   - memory docs
4. Do not edit live site files.
5. Validate no core files changed.
6. Run isolated tests when code changes:
   - `node apps/web/chatbot/tests/chatbot.test.js`
7. Update `CHATBOT_MEMORY.md` or `CHATBOT_CONVERSATION_FLOWS.md` if knowledge or behaviour changed.
8. Output:
   - what changed
   - files changed
   - validation performed
   - isolation confirmation
   - next safe step

## Hard Stop

Stop and ask before continuing if a task requires editing:

- live page files
- product logic
- quote logic
- pricing modules
- lead capture
- Supabase logic
- deployment config

## Quality Bar

Every chatbot improvement should make the assistant:

- clearer
- more useful
- safer
- more aligned with Operon Flooring
- more likely to guide users into the structured quote journey

It must not make the assistant more likely to calculate prices or interfere with the quote system.
