from fastapi import APIRouter

from scansaydone.config import VERSION

router = APIRouter()


@router.get("/", tags=["General"])
def root():
    return {
        "app": "ScanSayDone API",
        "team": "Dunk & Code XD",
        "status": "online",
        "docs": "/docs",
    }


@router.get("/health", tags=["General"])
def health_check():
    return {"status": "ok", "version": VERSION}
