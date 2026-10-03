from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import torch
import cv2
import numpy as np
from torchvision import transforms
from model.unet import UNet
import io

app = FastAPI()

# Allow Next.js to talk to FastAPI without getting blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Wake up the matrix (Targeting the V5 weights)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Matrix API Online. Routing to: {device}")

model = UNet(num_classes=7).to(device)
# We use a try-except so the server doesn't crash if V5 isn't fully saved yet
try:
    model.load_state_dict(torch.load('model/weights/ecozilla_v5_gpu.pth'))
    model.eval()
    print("V5 Weights successfully injected.")
except FileNotFoundError:
    print("WARNING: V5 weights not found yet. The matrix is still training!")

transform = transforms.ToTensor()

@app.post("/api/infer")
async def execute_inference(before: UploadFile = File(...), after: UploadFile = File(...)):
    # Read the incoming image bytes
    before_bytes = await before.read()
    after_bytes = await after.read()
    
    # We will drop the deforestation calculation logic right here 
    # to compare the forests and paint the missing trees red!
    
    return {"status": "success", "message": "Satellite feeds received. Matrix calculation pending."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)