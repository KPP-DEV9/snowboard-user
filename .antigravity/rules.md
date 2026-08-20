# AGENTIC WORKSPACE RULES (FRONTEND)

## 1. Response Persona & Tone (Caveman Code)

- Answer direct. No fluff. No pleasantries. No "Sure! Here is...".
- Minimal prose. Let code do the talking.
- Use short sentences or bullet points.
- Output complete code blocks or unified diffs. Never truncate code with `// ... rest of code`.
- Explain only non-obvious architecture or edge-case handling.

---

## 2. Architecture & Code Boundaries (Ponytail Style)

- **Separation of Concerns:** Keep business logic, UI presentation, and data access decoupled.
- **Single Responsibility:** 1 file = 1 primary export. Extract subcomponents, helper hooks, or utility functions when lines exceed ~150 lines.
- **File Structure:** Colocate tests, types, and styles adjacent to their component/module. Avoid barrel files (`index.ts` re-exporting everything).
- **State Management:**
  - Favor local component state first.
  - Lift state up only when siblings require sync.
  - Keep server state (cached queries) strictly separated from UI state.
- **Dependency Hygiene:** Zero circular dependencies. Never add external npm packages without explicit user instruction. Prefer native web/platform APIs.

---

## 3. Refactoring & Diff Safety Guardrails

- **Preserve Behavior:** Never alter public APIs, prop contracts, or observable component behavior without explicit instruction.
- **Diff Hygiene:** Never reformat untouched code or run destructive linters across entire files. Keep git diffs strictly isolated to target changes.
- **Guard Clauses:** Flatten deep nested conditionals using early returns.
- **Dead Code:** Strip unused imports, dead variables, orphaned interfaces, and legacy comments.
- **Constants:** Extract magic strings, layout values, and configuration timeouts into typed constants.
- **Safety Gate:** Verify existing test suites pass before and after refactoring.

---

## 4. TypeScript, Tailwind & Implementation Standards

- **Type Safety:**
  - Strict mode enabled. Zero `any` usage (`unknown` + type narrowing instead).
  - Prefer `type` aliases for unions/intersections; `interface` for extendable object contracts.
  - Derive types using `typeof`, `keyof`, `ReturnType<T>`, and `z.infer<typeof schema>`.
- **Tailwind CSS:**
  - Never use string concatenation for dynamic classes. Always use a utility like `cn()` (`clsx` + `tailwind-merge`) to resolve styling conflicts.
- **Zod & Validation:**
  - Validate at all external boundaries (API payloads, query params, form inputs, env vars).
  - Parse, don't validate (`schema.parse` or `schema.safeParse`).
- **Error Handling:** Fail fast at boundaries. Return structured error results or throw custom typed errors. Never swallow errors with empty `catch` blocks.

---

## 5. Next.js 14/15 App Router & Performance Standards

- **Server-First Boundary:**
  - Default all components to React Server Components (RSC).
  - **CRITICAL:** Never use React hooks (`useState`, `useEffect`) or DOM event handlers (`onClick`) in Server Components.
  - Add `'use client'` only for interactive user event listeners, browser APIs, or local state.
  - Mutate data via Server Actions (`'use server'`). Pair with `useActionState` and optimistic UI (`useOptimistic`).
  - Never call raw internal DB/services directly from Client Components.
- **Data Fetching & Routing:**
  - Support Next.js 15 async dynamic APIs: Await `params` and `searchParams` before validation/consumption.
  - Colocate loading states (`loading.tsx`), error boundaries (`error.tsx`), and layout wrappers.
- **Performance & a11y Standards:**
  - Avoid unnecessary `useEffect` (derive state during render or execute in event handlers).
  - Always use `next/image` and `next/font` for media and typography optimization.
  - Use Semantic HTML (`<button>`, `<main>`) instead of clickable `<div>` elements.
- **Security Guardrails:**
  - Sanitize all raw HTML and rich-text inputs before rendering to prevent XSS.

---

## 6. Execution & Testing Workflow (TDD / Skills)

- **Red-Green-Refactor:** Write or update the failing unit test before modifying implementation code.
- **Test Quality:** Test behaviors and user-facing contracts, not internal private implementation details.
- **Guardrails:** Implement changes in small, isolated steps. Ensure no regressions before finalizing.
