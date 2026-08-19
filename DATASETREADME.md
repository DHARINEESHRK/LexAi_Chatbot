# LexAI Dataset

This folder contains the final legal knowledge dataset and its generated embedding/index files used by LexAI.

## Dataset Overview

The final corpus contains **156,551 records**.

### Dataset Composition

| Data Type | Count |
|---|---:|
| Legal Provisions | 79,728 |
| Legal Definitions | 59,606 |
| Civilian QA | 879 |
| Legal QA | 9,984 |
| Criminal Law QA | 6,354 |
| **Total** | **156,551** |

### Question & Answer Data

The dataset contains **17,217 QA records**:

- Civilian QA: **879**
- Legal QA: **9,984**
- Criminal Law QA: **6,354**

The criminal-law QA data covers:

- Bharatiya Nyaya Sanhita (BNS), 2023
- Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
- Bharatiya Sakshya Adhiniyam (BSA), 2023

---

## Legal Provision Data

The legislation corpus contains different components of Indian legislation:

- Sections
- Chapters
- Clauses
- Documents
- Schedules
- Parts
- Annexures
- Appendices
- Forms
- Footnotes

These components preserve the structure and context of the source legislation.

---

## Legal Definitions

The corpus contains **59,606 legal definitions**.

Definitions preserve legal terminology along with relevant Act and section information where available.

Example:

```json
{
  "id": "DEF000001",
  "type": "definition",
  "act_id": "ACT000002",
  "section_id": "SEC000012",
  "term": "...",
  "definition": "..."
}
```

---

## Question & Answer Data

The QA dataset contains three categories.

### Civilian QA

**879 records**

Contains practical/legal questions intended for general users.

Example:

```json
{
  "type": "civilian_qa",
  "category": "General Consumer Law",
  "question": "When was the Consumer Protection Act 2019 enacted?",
  "answer": "..."
}
```

### Legal QA

**9,984 records**

Contains general Indian legal questions and answers.

Example:

```json
{
  "type": "legal_qa",
  "category": "Indian Legal Knowledge",
  "question": "Who is the respondent in the case Union of India vs. Maj. Gen. Manomoy Ganguly?",
  "answer": "The respondent is Maj. Gen. Manomoy Ganguly."
}
```

### Criminal Law QA

**6,354 records**

Contains questions and answers related to India's current criminal-law framework, including BNS, BNSS and BSA.

Example:

```json
{
  "type": "criminal_law_qa",
  "act": "Bharatiya Nyaya Sanhita, 2023",
  "section": "Section 1",
  "question": "...",
  "answer": "..."
}
```

---

## Files

The folder contains four final dataset artifacts.

| File | Approx. Size | Description |
|---|---|---|
| `documents.json` | 547 MB | Final legal corpus containing 156,551 records |
| `embeddings.npy` | 447 MB | 768-dimensional embeddings of the corpus |
| `index.faiss` | 447 MB | FAISS index generated from the embeddings |
| `id_map.json` | 3.4 MB | Maps vector/index positions to document IDs |
| **Total** | **~1.44 GB** | |

### documents.json

`documents.json` is the primary dataset file.

It contains the final cleaned and processed legal records.

Records can have different types, including:

- `legal_provision`
- `definition`
- `civilian_qa`
- `legal_qa`
- `criminal_law_qa`

Depending on the record type, fields may include:

- `id`
- `type`
- `component`
- `act`
- `act_id`
- `act_description`
- `section`
- `section_id`
- `title`
- `keywords`
- `question`
- `answer`
- `content`
- `embedding_text`

Not every record contains every field.

**Example Legal Provision:**

```json
{
  "id": "DOC000001",
  "type": "legal_provision",
  "component": "section",
  "act": "THE FATAL ACCIDENTS ACT, 1855",
  "section": "Section 1",
  "title": "Short title and extent",
  "keywords": [
    "accidents",
    "called",
    "extends",
    "fatal",
    "india"
  ],
  "content": "This Act may be called the Fatal Accidents Act, 1855..."
}
```

**Legal Metadata:**

Where available, legal records preserve contextual information such as:

- Act
- Act ID
- Act Description
- Part
- Chapter
- Section
- Section ID
- Clause
- Title
- Keywords
- Content

This allows the dataset to retain the relationship between legal text and its corresponding legislation.

### embeddings.npy

`embeddings.npy` contains the numerical representations generated from the final corpus.

**Embedding model:** `bhavyagiri/InLegal-Sbert`

**Embedding dimension:** `768`

There is one embedding corresponding to each record in the final corpus.

Therefore:

```
156,551 documents
    ↓
156,551 embeddings
    ↓
768 dimensions per embedding
```

The embeddings are stored as NumPy arrays using `float32`.

### index.faiss

`index.faiss` contains the FAISS vector index generated from the document embeddings.

It provides the searchable vector representation of the dataset.

The index corresponds to the embeddings stored in `embeddings.npy`.

### id_map.json

`id_map.json` maps the vector position used by the FAISS index to the corresponding document ID in `documents.json`.

Example:

```json
{
  "0": "DOC000001",
  "1": "DOC000002",
  "2": "DOC000003"
}
```

Therefore:

```
Vector 0 → DOC000001
Vector 1 → DOC000002
Vector 2 → DOC000003
```

This mapping keeps the vector data connected to the original legal records.

---

## Dataset Relationship

The four files represent the same final corpus:

```
documents.json
    │
    ├── 156,551 legal records
    │
    ▼
embeddings.npy
    │
    ├── 156,551 × 768 vectors
    │
    ▼
index.faiss
    │
    └── Vector search index

id_map.json
    │
    └── Vector position → Document ID
```

**Important:** The files must remain synchronized. If `documents.json` is changed, the corresponding embeddings and FAISS index should be regenerated.

---

## Dataset Summary

| Metric | Count |
|---|---:|
| Total Records | 156,551 |
| Legal Provisions | 79,728 |
| Legal Definitions | 59,606 |
| Civilian QA | 879 |
| Legal QA | 9,984 |
| Criminal Law QA | 6,354 |
| **Total QA** | **17,217** |
| Embedding Model | InLegal-SBERT |
| Embedding Dimension | 768 |

---

## Folder Structure

```
Dataset/
│
├── README.md
├── documents.json
├── embeddings.npy
├── index.faiss
└── id_map.json
```

These files together represent the final processed LexAI legal dataset.