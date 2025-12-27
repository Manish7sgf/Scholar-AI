# ScholarAI

> **Ethical AI-Powered Research Writing Assistant for Academic Journal Paper Publication**

ScholarAI is a comprehensive platform designed to assist researchers in writing, structuring, and formatting academic papers for journal publication. Built with ethical AI principles at its core, it emphasizes transparency and academic integrity.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

### Backend (FastAPI + Python)
- **Template Service**: Support for multiple journal formats (IEEE, Springer Nature, Elsevier, ACM, APA 7th, MLA 9th)
- **DOCX Export**: Export papers to properly formatted Word documents with journal-specific styling
- **AI Detector**: Analyze text for AI-generated content patterns (for transparency, NOT evasion)
- **Brainstorm Service**: Generate paper outlines based on topic, research type, and field
- **LLM Integration**: OpenAI-powered writing assistance and improvements
- **RESTful API**: Clean, well-documented API endpoints

### Frontend (Next.js + React + TypeScript)
- **Rich Text Editor**: TipTap-powered editor with comprehensive formatting tools
- **Template Selection**: Easy switching between journal formats
- **AI Assistant Panel**: Chat interface with quick actions for text improvement
- **AI Detector Panel**: Analyze content and generate disclosure statements
- **Brainstorm Panel**: Generate paper structure and outlines
- **Export Modal**: Export to formatted DOCX with optional AI disclosure
- **Responsive Design**: Clean, professional UI built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose (recommended)
- OR Node.js 18+ and Python 3.11+ (for local development)
- OpenAI API key (optional, for AI features)

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Manish7sgf/Scholar-AI.git
cd Scholar-AI
```

2. Set up environment variables:
```bash
# Create .env file in root directory
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

3. Start the services:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OpenAI API key
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if needed
npm run dev
```

## 📚 Tech Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Document Generation**: python-docx
- **LLM**: OpenAI API
- **Validation**: Pydantic

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: TipTap
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Radix UI
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (coming soon)

## 📖 Documentation

- [API Documentation](docs/API.md) - Complete API reference
- [Backend README](backend/README.md) - Backend setup and development
- [Frontend README](frontend/README.md) - Frontend setup and development
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute

## 🎯 Usage Guide

### 1. Select a Template
Choose from supported journal formats (IEEE, Springer, Elsevier, ACM, APA, MLA)

### 2. Brainstorm Your Paper
- Enter your research topic, field, and type
- Get title suggestions and recommended structure
- Review key points and methodology suggestions

### 3. Write Your Content
- Use the rich text editor with formatting tools
- Add sections based on template recommendations
- Track word counts per section

### 4. Use AI Assistance
- **Improve Text**: Clarity, formality, simplification, expansion, summarization, grammar
- **Generate Sections**: AI-assisted content generation
- **Chat**: Ask questions about writing and structure

### 5. Check AI Content
- Analyze sections for AI-generated patterns
- Review detection scores and flagged content
- Generate proper AI disclosure statements

### 6. Export Your Paper
- Review paper structure and content
- Add AI disclosure if needed
- Export to formatted DOCX document

## ⚖️ Ethical Usage

**IMPORTANT**: This tool is designed for ethical academic writing assistance:

- ✅ **DO**: Use AI assistance for improving clarity, fixing grammar, and generating ideas
- ✅ **DO**: Disclose AI usage in journal submissions using our disclosure generator
- ✅ **DO**: Review and validate all AI-generated content
- ✅ **DO**: Use the AI detector for transparency, not evasion

- ❌ **DON'T**: Submit AI-generated content without proper disclosure
- ❌ **DON'T**: Use this tool to evade AI detection
- ❌ **DON'T**: Replace original research with AI-generated content
- ❌ **DON'T**: Violate academic integrity guidelines

**The AI detector is for TRANSPARENCY, helping authors identify and properly disclose AI usage, NOT for evasion.**

## 🛠️ Development

### Project Structure
```
Scholar-AI/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py      # API routes
│   │   ├── config.py    # Configuration
│   │   ├── models/      # Pydantic schemas
│   │   └── services/    # Business logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utilities
│   ├── Dockerfile
│   └── package.json
├── docs/               # Documentation
├── docker-compose.yml  # Docker orchestration
└── README.md
```

### Running Tests
```bash
# Backend tests (coming soon)
cd backend
pytest

# Frontend tests (coming soon)
cd frontend
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT API
- FastAPI team for the excellent framework
- Next.js team for the React framework
- TipTap for the rich text editor
- All contributors and users

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation
- Review existing issues

## 🔮 Roadmap

- [ ] User authentication and accounts
- [ ] Save and load papers
- [ ] Collaboration features
- [ ] More journal templates
- [ ] Citation management
- [ ] LaTeX export
- [ ] Mobile app
- [ ] Self-hosted LLM options

---

**Made with ❤️ for the research community**
