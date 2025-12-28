# Contributing to ScholarAI

First off, thank you for considering contributing to ScholarAI! It's people like you that make ScholarAI such a great tool for the research community.

## Code of Conduct

By participating in this project, you are expected to uphold our commitment to ethical AI usage and academic integrity. We expect all contributors to:

- Use respectful and inclusive language
- Be welcoming to newcomers
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members
- Maintain academic integrity and ethical standards

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, versions)
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear use case** for the feature
- **Expected behavior** and benefits
- **Alternative solutions** you've considered
- **Mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Add tests** if applicable
4. **Update documentation** as needed
5. **Write clear commit messages**
6. **Test your changes** thoroughly
7. **Submit a pull request**

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install pytest black flake8  # Development tools
```

**Code Style:**
- Follow PEP 8
- Use type hints
- Write docstrings for functions and classes
- Keep functions focused and small

**Testing:**
```bash
pytest tests/
```

**Formatting:**
```bash
black app/
flake8 app/
```

### Frontend Development

```bash
cd frontend
npm install
```

**Code Style:**
- Follow TypeScript strict mode
- Use functional components with hooks
- Keep components focused and reusable
- Use Tailwind utility classes

**Testing:**
```bash
npm test
npm run lint
```

## Project Structure

### Backend (`/backend`)
```
backend/
├── app/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Configuration
│   ├── models/
│   │   └── schemas.py    # Pydantic models
│   └── services/
│       ├── template_service.py
│       ├── docx_service.py
│       ├── detector_service.py
│       ├── brainstorm_service.py
│       └── llm_service.py
└── tests/                # Test files
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # React components
│   └── lib/
│       ├── api.ts        # API client
│       ├── store.ts      # State management
│       └── utils.ts      # Utilities
└── tests/                # Test files
```

## Coding Guidelines

### Python (Backend)

```python
# Good
def detect_ai_content(text: str) -> DetectionResult:
    """
    Analyze text for AI-generated content patterns.
    
    Args:
        text: Text to analyze
        
    Returns:
        DetectionResult with score and suggestions
    """
    if not text or len(text.strip()) < 50:
        return DetectionResult(score=0, level="low", ...)
    
    score = self._calculate_score(text)
    return DetectionResult(...)
```

### TypeScript (Frontend)

```typescript
// Good
interface SectionProps {
  section: Section;
  onUpdate: (content: string) => void;
}

export function SectionEditor({ section, onUpdate }: SectionProps) {
  const [content, setContent] = useState(section.content);
  
  const handleChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(newContent);
  };
  
  return (
    <div className="editor-container">
      {/* Editor content */}
    </div>
  );
}
```

## Commit Messages

Follow conventional commits:

```
feat: Add export to LaTeX format
fix: Resolve DOCX export margin issue
docs: Update API documentation
style: Format code with black
refactor: Simplify detection algorithm
test: Add tests for template service
chore: Update dependencies
```

## Documentation

- Update README.md for major changes
- Document new API endpoints in docs/API.md
- Add JSDoc/docstrings for new functions
- Update component documentation
- Include examples where helpful

## Testing Guidelines

### Backend Tests

```python
def test_detect_ai_content():
    """Test AI detection with sample text"""
    service = DetectorService()
    result = service.detect("Sample text...")
    
    assert result.score >= 0
    assert result.score <= 100
    assert result.level in ["low", "medium", "high"]
```

### Frontend Tests

```typescript
describe('Editor', () => {
  it('should update content on change', () => {
    const onUpdate = jest.fn();
    render(<Editor onUpdate={onUpdate} />);
    
    // Test interaction
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New content' }
    });
    
    expect(onUpdate).toHaveBeenCalledWith('New content');
  });
});
```

## Adding New Features

### New Journal Template

1. Add template to `backend/app/services/template_service.py`
2. Include all required fields (fonts, margins, sections)
3. Test DOCX export with new template
4. Update documentation

### New AI Feature

1. Implement in appropriate service file
2. Add API endpoint in `main.py`
3. Update Pydantic schemas if needed
4. Add frontend integration
5. Document the feature
6. Ensure ethical usage guidelines are clear

### New UI Component

1. Create component in `frontend/src/components/`
2. Follow existing patterns and styles
3. Make it responsive
4. Add to Storybook (if available)
5. Update relevant pages

## Ethical Considerations

When contributing, keep in mind:

1. **Transparency**: AI features should promote disclosure, not evasion
2. **Academic Integrity**: Don't add features that encourage plagiarism
3. **User Education**: Help users understand ethical AI usage
4. **Clear Documentation**: Explain limitations and proper usage
5. **Responsible AI**: Consider impacts on academic community

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for making ScholarAI better! 🎉
