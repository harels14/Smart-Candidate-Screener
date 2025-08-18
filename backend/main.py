from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.api.cv_routes import router as cv_router


app = FastAPI(title="HR Platform API", version="1.0.0")
app.include_router(cv_router, prefix="/api")

origins = ["http://localhost:5173"] # Vite default port

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")  #Send data
async def root():
    return {"message": "HR Platform API is running successfully!"}

@app.post("/") #Get data
async def receive_data(data):
    return {"message" : "received data"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/api/test")
async def try_endpoint():
    return {"data": "This is a test endpoint", "success": True}

if __name__ == "__main__":
    uvicorn.run(app,host = "0.0.0.0", port=8000)