from fastapi import FastAPI

app = FastAPI(title="Chess-App")


@app.get("/health")
def health():
    return {"ok": True, "app": "Chess-App"}
