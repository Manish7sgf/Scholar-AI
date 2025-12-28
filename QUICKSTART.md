# Quick Start Guide - ScholarAI

Get ScholarAI up and running in 5 minutes!

## Option 1: Local Development (Recommended for Development)

### Backend
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key (optional)

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend
```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## Option 2: Docker Compose (Recommended for Production)

```bash
# Create environment file
echo "OPENAI_API_KEY=your_key_here" > .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## First Steps After Installation

1. **Open the app** at http://localhost:3000
2. **Select a journal template** from the sidebar (e.g., IEEE, Springer)
3. **Try the Brainstorm panel** to generate a paper outline
4. **Add sections** and start writing
5. **Use AI Assistant** for writing help (requires OpenAI API key)
6. **Run AI Detector** to check content transparency
7. **Export to DOCX** when ready

## Optional: Configure OpenAI API Key

For AI-powered features (writing assistance, chat, section generation):

1. Get an API key from https://platform.openai.com/api-keys
2. Add to backend `.env` file:
   ```
   OPENAI_API_KEY=sk-...your-key-here
   ```
3. Restart backend server

**Note:** AI detection and templates work without OpenAI API key!

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.11+)
- Verify all dependencies installed: `pip list`
- Check port 8000 is available: `lsof -i :8000`

### Frontend won't build
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check port 3000 is available: `lsof -i :3000`

### Docker issues
- Ensure Docker is running: `docker ps`
- Check logs: `docker-compose logs`
- Rebuild: `docker-compose build --no-cache`

## Environment Variables Summary

### Backend (.env)
```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
CORS_ORIGINS=http://localhost:3000
APP_NAME=ScholarAI
APP_VERSION=1.0.0
DEBUG=False
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## What's Next?

- Read the [full README](README.md) for detailed information
- Check [API Documentation](docs/API.md) for endpoint details
- See [Contributing Guidelines](CONTRIBUTING.md) to contribute
- Explore the code in `backend/app/` and `frontend/src/`

## Need Help?

- Check the documentation
- Review error messages in terminal
- Look at browser console for frontend issues
- Open an issue on GitHub

Happy writing! 📝✨
