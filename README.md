# LexAI ⚖️🤖

**AI-Powered Legal Understanding for Indian Law**

LexAI is an intelligent legal chatbot that makes Indian legal information accessible through a conversational interface. It combines modern NLP, semantic retrieval, RAG (Retrieval-Augmented Generation), and Natural Language Inference to provide evidence-grounded legal answers.

> **Note:** This repository contains the public-facing API and documentation. The private inference pipeline, legal knowledge base, model artifacts, and deployment configuration are intentionally excluded.

---

## 🎯 Overview

Legal information is often difficult to understand due to complex terminology, technical language, and lengthy documents. LexAI solves this by allowing users to ask natural-language questions and receive structured, evidence-based answers.

### Example Questions

```
"What are the rights of an arrested person?"
"Explain bail in simple terms."
"What is the difference between regular bail and anticipatory bail?"
"What is an FIR and what happens after it's registered?"
```

---

## 👥 Target Users

- 👨‍⚖️ **Rookie Advocates** – Building foundational legal knowledge
- 🎓 **Law Students** – Learning Indian legal concepts
- 📚 **Learners** – Understanding Indian law fundamentals
- 👤 **Citizens** – Accessing understandable legal information

> **Disclaimer:** LexAI is an educational assistant and should not replace professional legal advice.

---

## ✨ Key Features

### 💬 Conversational Legal Q&A
Ask questions in natural language without needing to know complex legal terminology. LexAI understands meaning, not just keywords.

### 🔎 Retrieval-Augmented Generation (RAG)
Answers are grounded in actual legal information retrieved from the knowledge base, not generated from pure language model knowledge alone.

### 🧠 Semantic Search
User queries are converted into semantic representations and matched against the legal knowledge base, enabling meaning-based retrieval even when wording differs.

### 📊 Evidence-Based Reranking
Retrieved documents are ranked by relevance, ensuring the most important legal information is used during answer generation.

### ✅ NLI-Based Validation
Generated claims are validated against retrieved evidence using Natural Language Inference, identifying whether answers are supported, contradictory, or uncertain.

### 📎 Source Attribution
Answers include references to source documents, allowing users to verify information independently.

---

## 🧠 AI/ML Architecture

LexAI combines multiple AI and NLP components in a unified pipeline:

```
User Question
    ↓
Query Processing (NLP)
    ↓
Semantic Embeddings
    ↓
Vector Search & Retrieval
    ↓
Document Reranking
    ↓
LLM Generation
    ↓
Claim Extraction
    ↓
NLI Validation
    ↓
Answer + Sources + Validation Status
```

### Core Components

| Component | Purpose |
|-----------|---------|
| **NLP** | Process and understand legal questions |
| **Embeddings** | Represent queries and documents semantically |
| **Vector Search** | Retrieve relevant legal documents efficiently |
| **RAG** | Ground generation using retrieved evidence |
| **Reranking** | Prioritize the most relevant documents |
| **LLM** | Generate natural-language explanations |
| **NLI** | Validate generated claims against evidence |
| **Source Attribution** | Track and reference source documents |

---

## 🛠️ Technology Stack

### Backend
- **Python**
- **FastAPI**

### AI/ML
- Natural Language Processing (NLP)
- Sentence Transformers (Semantic Embeddings)
- Vector Search (FAISS-based Retrieval)
- Large Language Models
- Natural Language Inference (NLI)
- Cross-Encoder Reranking

### API & Data
- REST API with JSON
- Evidence-based Validation

> **Note:** Model weights, private prompts, vector indexes, and credentials are stored in private infrastructure.

---

## 🔌 API Endpoints

### POST `/api/ask`

Ask LexAI a legal question.

**Request:**
```json
{
    "query": "Explain bail in simple terms."
}
```

**Response:**
```json
{
    "answer": "Bail is a temporary release mechanism...",
    "validation_status": "REVIEW_REQUIRED",
    "sources": [
        "DOC123456",
        "DOC123789"
    ],
    "timing": {
        "retrieval": 0.067,
        "reranking": 0.092,
        "generation": 23.930,
        "total": 24.090
    }
}
```

### Validation Status

- **`SUPPORTED`** – Response has supporting evidence
- **`REVIEW_REQUIRED`** – Response needs additional verification
- **`REJECTED`** – Response failed validation criteria

---

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
    "status": "ok",
    "model": "LexAI",
    "engine_loaded": true
}
```

---

## 📦 Project Structure

```
LexAI_Chatbot/
├── README.md                 # Project documentation
├── lexai_public_api.py       # FastAPI application
├── requirements.txt          # Python dependencies
├── .gitignore               # Git ignore rules
└── LICENSE                  # License information
```

**Private components** (excluded from public repo):
- Legal knowledge base
- Vector indexes
- Embedding models
- Model configuration & weights
- Private prompts
- Deployment credentials

---

## 🔐 Security Best Practices

Never commit secrets to version control:

```
❌ API Keys
❌ Model Credentials
❌ Cloud Credentials
❌ Database Credentials
❌ Deployment Tokens
```

Use environment variables instead:

```env
LEXAI_API_URL=https://your-api-domain.example
LEXAI_API_KEY=your-secret-key
```

> **Important:** If credentials are ever committed, revoke and regenerate them immediately. Deletion from recent commits does not guarantee removal from Git history.

---

## 🧪 Example Python Client

```python
import requests

API_URL = "https://your-api-domain.example"

query = "Explain bail in simple terms."

response = requests.post(
    f"{API_URL}/api/ask",
    headers={"Content-Type": "application/json"},
    json={"query": query},
    timeout=120
)

response.raise_for_status()
data = response.json()

print("ANSWER:")
print(data["answer"])

print("\nVALIDATION STATUS:")
print(data["validation_status"])

print("\nSOURCES:")
print(data["sources"])

print("\nTIMING:")
print(data["timing"])
```

---

## 🛣️ Future Improvements

Potential enhancements for future versions:

- Conversational context and follow-up questions
- Query rewriting for improved retrieval
- Fine-grained source-level citations
- Multilingual legal Q&A support
- Legal-domain-specific reranking
- Enhanced contradiction detection
- User-controlled evidence inspection
- Authentication & rate limiting
- Production-grade deployment optimization
- Latency optimization
- Comprehensive legal evaluation benchmarks

---

## ⚡ Why RAG?

Large language models generate fluent text, but fluency doesn't guarantee accuracy. LexAI uses Retrieval-Augmented Generation to ensure answers are grounded in actual legal information.

**Traditional LLM Approach:**
```
Question → LLM → Answer (may be inaccurate)
```

**LexAI RAG Approach:**
```
Question → Retrieve Evidence → Rerank → Generate → Validate → Answer + Sources
```

This ensures **reliability, transparency, and evidence-based reasoning**.

---

## ⚖️ Responsible Legal AI

LexAI is designed around core principles for responsible legal AI:

✅ **Evidence-Grounded Generation** – Answers backed by retrieved documents  
✅ **Source References** – Traceable to original legal information  
✅ **Validation Status** – Clear indication of confidence level  
✅ **NLI-Based Checking** – Claims validated against evidence  
✅ **Human-Review Awareness** – System recognizes its limitations  

**Important:** Legal matters should always be verified against authoritative sources and discussed with qualified legal professionals when necessary.

---

## ⚠️ Legal Disclaimer

**LexAI is an educational and informational AI assistant.**

- Does not provide professional legal representation
- Does not establish an attorney-client relationship
- Legal rules and procedures change over time
- Information should be verified with authoritative sources
- Consult a qualified legal professional for specific situations

---

## 🤝 Contributing

Contributions to the public interface, documentation, testing, and integration are welcome.

**When contributing, please:**
1. ✅ Do not commit credentials or secrets
2. ✅ Do not upload private datasets
3. ✅ Do not expose model weights or private prompts
4. ✅ Do not commit deployment credentials
5. ✅ Keep proprietary components outside public commits

---

## 👨‍💻 Authors

### Dharineesh R.K.
**Project Lead & Developer**
- Overall system architecture
- Application development
- API integration
- Public-facing implementation

GitHub: [https://github.com/DHARINEESHRK](https://github.com/DHARINEESHRK)

### Dharaneshwaran A.
**AI/ML Contributor**
- NLP & semantic processing
- Retrieval pipeline development
- Model experimentation
- NLI-based validation system

---

## 🎓 Project Collaboration

LexAI combines expertise across multiple domains:

| Area | Contributor |
|------|-------------|
| Software Engineering & Architecture | Dharineesh R.K. |
| Natural Language Processing | Dharaneshwaran A. |
| Information Retrieval | Dharaneshwaran A. |
| Machine Learning & LLMs | Dharaneshwaran A. |
| API Design & Integration | Dharineesh R.K. |
| System Design | Dharineesh R.K. |

---

## 📜 License

A license has not yet been selected for this repository.

Until a license is added, the code should **not** be assumed to be available for unrestricted reuse, modification, or redistribution.

---

## ⭐ Getting Started

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Configure environment variables
4. Start the API server
5. Send requests to `/api/ask` with legal questions

For detailed setup instructions, see the deployment documentation.

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the maintainers
- Review the API documentation

---

**LexAI: Ask questions. Retrieve evidence. Generate answers. Validate claims.**

Built by **Dharineesh R.K. & Dharaneshwaran A.**
