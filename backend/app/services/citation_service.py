from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

class Citation(BaseModel):
    author: str
    title: str
    journal: str
    year: str
    doi: str = None

class FormatCitationRequest(BaseModel):
    citation: dict
    style: str

@router.get("/citations/doi/{doi}")
async def fetch_citation_from_doi(doi: str):
    """Fetch citation details from DOI using CrossRef API"""
    try:
        # Use CrossRef API to fetch citation data
        url = f"https://api.crossref.org/works/{doi}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        work = data.get("message", {})
        
        # Extract relevant fields
        authors = work.get("author", [])
        author_str = ", ".join([f"{a.get('family', '')}, {a.get('given', '')}" for a in authors[:3]])
        if len(authors) > 3:
            author_str += " et al."
        
        title = work.get("title", [""])[0]
        journal = work.get("container-title", [""])[0]
        year = work.get("published", {}).get("date-parts", [[""]])[0][0]
        
        return {
            "author": author_str,
            "title": title,
            "journal": journal,
            "year": str(year),
            "doi": doi
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch DOI: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing DOI: {str(e)}")

@router.post("/citations/format")
async def format_citation(request: FormatCitationRequest):
    """Format a citation according to the specified style"""
    citation = request.citation
    style = request.style.lower()
    
    try:
        if style == "ieee":
            formatted = f"[{citation.get('id', '1')}] {citation['author']}, \"{citation['title']},\" {citation['journal']}, {citation['year']}."
        elif style == "apa":
            formatted = f"{citation['author']} ({citation['year']}). {citation['title']}. {citation['journal']}."
        elif style == "mla":
            formatted = f"{citation['author']}. \"{citation['title']}.\" {citation['journal']}, {citation['year']}."
        else:
            # Default format
            formatted = f"{citation['author']}, \"{citation['title']},\" {citation['journal']}, {citation['year']}."
        
        return {"formatted": formatted}
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required field: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error formatting citation: {str(e)}")
