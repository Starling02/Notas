from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, notes

# Crea las tablas al iniciar (suficiente para SQLite / desarrollo).
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notes.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "notes-api"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
