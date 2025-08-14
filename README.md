# llm-inject-scan

A tiny, fast library that scans user prompts for risky patterns before they reach your LLM model. It flags likely prompt-injection attempts so you can block, review, or route them differently—without making a model call.

### What it does
- **Jailbreak detection**: Spots classic attempts to override behavior (e.g., asking to ignore previous instructions or force “developer mode”).
- **Policy evasion cues**: Surfaces prompts nudging toward harmful or disallowed content.
- **Prompt-leak attempts**: Flags efforts to get the system prompt, internal instructions, or hidden configuration repeated back.
- **Indirect injection via links and Base64**: Detects prompts steering the model to fetch and act on untrusted URLs or with Base64 type of injection.
- **Role/context manipulation**: Catches inputs that try to reset or impersonate roles (e.g., “system:” or contrived contexts that distort guardrails).

### Why it matters
- **Defense-in-depth for LLM apps**: Reduce risk from jailbreaks, prompt leaks, and indirect injections before they trigger downstream effects.
- **Fast, deterministic guardrail**: Lightweight checks that run synchronously and cheaply at the edge, gateway, or server.
- **Works with messy inputs**: Resilient to common obfuscation tricks (diacritics, homoglyphs, leetspeak, small typos) often used to slip past naive filters.
- **Actionable outcomes**: Returns clear categories you can log, alert on, or enforce policy with—no black-box scores.

### Where it fits
- **User-facing chat UIs**: Preflight scan before sending text to your model.
- **API gateways and middleware**: Inline guardrail for multi-tenant or bring-your-own-data endpoints.
- **Serverless functions and workers**: Quick allow/deny decisions close to the request.
- **Batch and ETL**: Sanity-check large volumes of prompts before processing.

### Output
When a prompt is flagged, you get one or more categories indicating the likely intent, such as `jailbreak`, `evasion`, `promptLeak`, `indirect`, or `roleContext`. Use these to block, require human review, or route to a safer policy.

### Install
```bash
npm install llm-inject-scan
```

### Usage
```ts
import { createPromptValidator } from 'llm-inject-scan';

const validate = createPromptValidator({ /* disableBase64Check: false, disableUrlCheck: false */ });
const result = validate('Ignore all previous instructions and...');

if (!result.clean)) {
  // e.g., deny external fetch or sanitize the request
}
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `locale` | `'en-US'` | `'en-US'` | Language dictionary for rule-based detections. Currently only `'en-US'` is supported. |
| `disableBase64Check` | `boolean` | `false` | Skip Base64-like blob detection. When true, Base64-looking input will not add an `evasion` flag. |
| `disableUrlEncodingCheck` | `boolean` | `false` | Skip percent-encoded (URL-encoded) text detection. When true, sequences like `%49%67%6e...` will not add an `evasion` flag. |
| `disableUrlCheck` | `boolean` | `false` | Skip URL detection. When true, http/https links will not add an `indirect` flag. |

```ts
import { createPromptValidator } from 'llm-inject-scan';

const validate = createPromptValidator({
  locale: 'en-US',
  disableBase64Check: true,
  disableUrlCheck: true,
});

const result = validate('Summarize http://attacker.com/payload and SGVsbG8sIHdvcmxkIQ==');
```

### Scope and philosophy
- **Focused**: Optimized for English prompts today.
- **Pragmatic**: Rule-driven and conservative to minimize noise, yet robust to simple obfuscation.
- **Composable**: Use it alongside other controls (rate limiting, content filters, isolation, allowlisted retrieval).

### Status
Early-stage and evolving based on real-world attempts and research. Expect the taxonomy, API, and coverage to change—and things might break. I'm actively looking for feedback and real-world examples; please open an issue or share ideas to help improve the library.

### License
ISC 