# Alethea — System Architecture

Alethea is an AI-augmented Reliability Intelligence Engine that analyzes logs, correlates incidents, evaluates pull requests, and answers complex SRE questions using hybrid retrieval-augmented reasoning (RAG).

---

## 1. Core System Architecture Overview
Alethea consists of four primary subsystems that bridge the gap between code changes and runtime behavior:

* **Log Intelligence:** Logs → Events → Incidents → Memory → Chat
* **Code Intelligence:** PRs → Risk Analysis → Memory → Insights

Both logs and PRs feed into a **Shared Semantic Memory**, enabling contextual cross-understanding between code change risks and historical failures.

---

## 2. Shared Core Infrastructure

### 2.1 Log Parser
Converts raw text logs into structured events.
* **Supports:** Plaintext, JSON, Server logs, and Unknown formats (fallback parser).
* **Data Structure:**
    ```typescript
    interface LogEvent {
      timestamp: Date | null;
      level: string | null;
      service: string | null;
      message: string;
      raw: string;
    }
    ```

### 2.2 Anomaly Detector
Fast, rule-based identification of suspicious conditions before AI reasoning.
* **Detection Scopes:** Error spikes, retry storms, cascading failures, timeout clusters, and resource exhaustion.

### 2.3 Memory Layer (Long-Term Intelligence)
Alethea maintains a persistent semantic memory in **MongoDB** of logs, incidents, and PRs.
* **Responsibilities:** Summarization (LLaMA), Pseudo-vector embedding generation, and Semantic similarity search.
* **Storage Schema:**
    ```json
    {
      "_id": "uuid",
      "type": "log" | "incident" | "pr",
      "text": "...",
      "summary": "...",
      "embedding": [32 floats],
      "metadata": {},
      "createdAt": "timestamp"
    }
    ```

### 2.4 Incident Engine
Transforms logs into meaningful incidents by grouping events via time-window clustering, identifying root causes, and generating AI-driven narratives.

### 2.5 Chat Intelligence Layer (RAG)
A Retrieval-Augmented Generation chatbot that retrieves historical memory, builds grounded prompts, and generates contextual answers for SRE investigations.

---

## 3. Redis Caching Layer (Performance Engine)
Redis (v4) is used for short-lived performance caching to reduce external dependency load and API latency. It is an accelerator, not a hard dependency.

| Data Type | Key Pattern | TTL |
| :--- | :--- | :--- |
| **GitHub Repos** | `repos:<userId>` | 180 sec |
| **Pull Requests** | `prs:<owner>/<repo>` | 180 sec |
| **Log Analysis** | `logs:<hash>` | 120 sec |

---

## 4. End-to-End Pipelines

### 4.1 Logs Processing Pipeline
1. **Input:** Raw text/file uploads.
2. **Cache Check:** Check Redis for existing log hash.
3. **Analyze:** Parse → Detect Anomalies → Correlate & Store.
4. **Narrative:** Generate Incident Story via AI.
5. **Memory:** Save to Semantic Memory and return structured response.

### 4.2 Pull Request Pipeline
1. **Trigger:** Webhook or Dashboard fetch.
2. **Fetch:** Check Redis for cached metadata; fallback to Octokit (GitHub API).
3. **Analysis:** Extract diffs → Analyze risk patterns → Generate AI Risk Report.
4. **Action:** Auto-comment on GitHub and persist to Memory.

### 4.3 Chat/Q&A Pipeline
1. **Query:** User asks a question.
2. **Retrieval:** Vector search through Memory (logs/PRs/incidents).
3. **Reasoning:** AI combines retrieved evidence to build a grounded response.

---

## 5. Module Responsibility Summary

| Module | Responsibility |
| :--- | :--- |
| `parser.ts` | Log parsing and normalization |
| `anomaly_detector.ts` | Rule-based pattern detection |
| `summarize_text.ts` | LLaMA-based text distillation |
| `embedder.ts` | Pseudo-embedding generation |
| `store_memory.ts` | Database persistence logic |
| `pr_analyzer/` | PR diff analysis and risk scoring |
| `chatbot/` | RAG logic and prompt building |
| `redisClient.ts` | Redis connection management |