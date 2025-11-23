## Alethea System Architecture

Alethea is an AI-augmented reliability intelligence engine designed to analyze logs, correlate failures, predict risks in pull requests, and answer complex SRE questions through a retrieval-augmented chatbot.
This document explains the full architecture across all phases of the system, from ingestion to inference to memory.

1. Core Building Blocks (Shared Infrastructure)

These modules form the core library used by all phases.

1.1 Log Parser

Purpose: Convert raw log lines (any format) into structured LogEvent objects.

Output shape:

interface LogEvent {
timestamp: Date | null;
level: string | null;
service: string | null;
message: string;
raw: string;
}

Responsibility:

Parse multiple log formats (standard, JSON, nginx, cloud logs, etc.)

Universal fallback for unknown formats

Used by ingestion, anomaly detection, and incident correlation.

1.2 Anomaly Detector

Purpose: Fast heuristic anomaly identification before AI reasoning.

Detects:

Error spikes

Repeated messages

Retry loops

Timeouts

Resource exhaustion

Multi-service cascades

Timestamp gaps

Output shape:

interface Anomaly {
type: string;
timestamp: Date | null;
message: string;
}

Used in the ingestion pipeline and for incident metadata enrichment.

1.3 Memory Layer (Vector + Metadata Storage)

The memory layer is the foundation of Alethea’s intelligence.

It consists of:

a. MongoDB storage (vector index)

Each knowledge item (log, PR, incident) is stored as:

{
"\_id": "uuid",
"type": "log|pr|incident",
"text": "...",
"summary": "...",
"embedding": [32 floats],
"metadata": { ... },
"createdAt": "timestamp"
}

b. Summarizer

Shortens long logs, diffs, and stories via Llama 3.3.

c. Pseudo-embedding generator

Creates a 32-dimensional numeric vector from summaries for semantic search.

d. Memory store helper

storeLog, storePR, storeIncident
Each object is summarized, embedded, and inserted into the memory DB.

e. Semantic retrieval

findSimilar(text) performs vector search against all memory entries.
Used heavily by the chatbot (Phase 4.4).

1.4 Incident Engine

Transforms raw logs into correlated “incidents”.

Includes:

groupEvents – Groups logs into incidents by time gaps

analyzeIncident – Extracts root cause, timeline, services

generateIncidentStory – Llama-powered narrative generation

correlateAndStore – Builds incident object and stores it in memory

1.5 Chat Intelligence Layer

Retrieval-augmented generation (RAG) chatbot.

Modules:

retrieveRelevantContext
Vector-based retrieval of relevant logs/incidents/PRs

buildRAGPrompt
Constructs grounded context-aware prompt

generateRAGAnswer
Uses Llama to generate final answer

chatWithAlethea
Main function aggregating retrieval + generation

1.6 PR Analyzer

Components:

GitHub webhook server

Octokit-based diff fetcher

Heuristic diff risk detector

AI PR risk report generator

Memory persistence for PR diffs

GitHub auto-commenter

2. Log Processing Pipeline (End-to-End)

The log pipeline transforms raw logs into meaningful incidents and long-term memory.

2.1 Input

Raw multiline logs via API or CLI.

2.2 Steps

1. Parsing

parseLogFiles → converts raw text to LogEvent[].

2. Anomaly detection

detectAnomalies identifies suspicious behavior.

3. Memory storage

Each log event is stored via storeLog:

Summary

Pseudo-embedding

Metadata

Vector index entry

4. Incident correlation

correlateAndStore(events) performs:

Time-window grouping

Root cause extraction

Service impact analysis

Timeline creation

AI story generation

Memory insertion of incident

5. Retrieval

Stored logs and incidents become searchable for future questions.

3. Pull Request Pipeline (End-to-End)

Triggered via GitHub webhook.

3.1 Steps

PR event received through /webhooks/github.

getPRDiff downloads full unified diff.

analyzeDiff detects unsafe patterns.

generatePRRiskReport produces an AI-generated risk narrative.

storePR inserts diff into semantic memory.

A GitHub PR comment is posted automatically.

Diff embeddings become available for similarity search and cross-incident matching.

4. Chat / Q&A Pipeline (Phase 4.4)

When a user asks a question:

4.1 Steps

retrieveRelevantContext(question)
Uses vector search to fetch logs/incidents/PRs relevant to the question.

buildRAGPrompt(question, context)
Builds a grounded prompt with only retrieved context.

generateRAGAnswer(prompt)
Uses Llama to produce an accurate, context-backed response.

Output contains:

the final answer

the items used as context

This enables Alethea to answer questions about historical failures, PR risks, and patterns.

5. Integrated System Flow

This section shows how all modules interconnect.

5.1 Logs → Incidents → Memory → Chat
Raw Logs
→ parseLogFiles
→ detectAnomalies
→ storeLog (summary + embedding → memory)
→ correlateAndStore (incident detection)
→ generateIncidentStory
→ storeIncident (summary + embedding)
→ Chat (vector retrieval uses logs + incidents)

5.2 PRs → Risk Analysis → Memory → Chat
GitHub PR Webhook
→ getPRDiff
→ analyzeDiff
→ generatePRRiskReport
→ storePR (summary + embedding → memory)
→ postCommentToGitHub
→ Chat (vector retrieval uses PRs + incidents)

5.3 Unified Memory Pool

All knowledge enters the same semantic memory:

Logs

PR diffs

Incidents

Vector search allows Alethea to relate:

an incident to a PR

a log pattern to historical events

a question to any relevant data

a new PR to past outages

5.4 Chat Query Across All Memory
User Question
→ retrieveRelevantContext
→ vector search across logs + incidents + PRs
→ buildRAGPrompt
→ generateRAGAnswer
→ return grounded explanation

6. Summary of Module Responsibilities
   Module Responsibility
   parser.ts universal log parsing
   anomaly_detector.ts heuristic anomaly detection
   summarize_text.ts text summarization (Llama)
   embedder.ts pseudo-embedding generation
   store_memory.ts storage of logs, PRs, incidents
   query.ts / retrieve.ts semantic vector search
   group.ts incident window detection
   analyze.ts service + root cause extraction
   story.ts incident narrative generation
   correlate.ts full incident creation & storage
   pr_analyzer/_ PR diff fetching, risk scoring, AI report
   chatbot/_ RAG query engine
7. High-Level Architecture Overview
                        ┌──────────────────────────┐
                        │      GitHub PR Webhook    │
                        └───────────┬──────────────┘
                                    │
                                    ▼
                          [ Phase 2: PR Analyzer ]
                                    │
                                    ▼
                                 Memory
                                    ▲
                                    │
        ┌─────────────── Raw Logs ──┘
        │                           │
        ▼                           │
 [ Phase 4.2: Ingestion ]           │
        ▼                           │
 [ Phase 4.3: Incidents ]           │
        ▼                           │
 [ AI Narrative + Memory ]──────────┘
                │
                ▼
      [ Phase 4.4: RAG Chatbot ]
                │
                ▼
           User Answers
