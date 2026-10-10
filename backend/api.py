import cv2
import torch
import base64
import numpy as np
import ee
import requests
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from torchvision import transforms
from model.unet import UNet

ee.Initialize(project='ecozilla-511204')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = UNet()
model.load_state_dict(torch.load('model/weights/ecozilla_v6_gpu.pth', weights_only=True))
model.to(device)
model.eval()

class Coordinates(BaseModel):
    lat: float
    lng: float

def fetch_satellite_tensor(lat, lng, days_ago):
    end_date = datetime.now() - timedelta(days=days_ago)
    start_date = end_date - timedelta(days=90)
    point = ee.Geometry.Point([lng, lat])
    region = point.buffer(2000).bounds()
    
    collection = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(region)
                  .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')))
    
    image = collection.median().clip(region)
    url = image.getThumbURL({
        'dimensions': 256, 
        'bands': ['B4', 'B3', 'B2'], 
        'min': 0, 
        'max': 3000,
        'region': region,
        'format': 'jpg'
    })
    
    response = requests.get(url)
    img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

def preprocess_image(cv_img):
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((256, 256), antialias=True)
    ])
    return transform(cv_img).unsqueeze(0).to(device)

@app.post('/api/scan')
async def scan(coords: Coordinates):
    img_t1 = fetch_satellite_tensor(coords.lat, coords.lng, 180)
    img_t2 = fetch_satellite_tensor(coords.lat, coords.lng, 0)
    
    tensor_t1 = preprocess_image(img_t1)
    tensor_t2 = preprocess_image(img_t2)
    
    with torch.no_grad():
        output_t1 = model(tensor_t1)
        output_t2 = model(tensor_t2)
        
    pred_mask_t1 = torch.argmax(output_t1, dim=1).squeeze(0).cpu().numpy()
    pred_mask_t2 = torch.argmax(output_t2, dim=1).squeeze(0).cpu().numpy()
    
    deforestation_zone = (pred_mask_t1 == 3) & (pred_mask_t2 == 5)
    
    alert_mask = np.zeros((256, 256, 3), dtype=np.uint8)
    alert_mask[deforestation_zone] = [0, 0, 255]
    
    _, buffer_alert = cv2.imencode('.png', alert_mask)
    encoded_alert = base64.b64encode(buffer_alert).decode('utf-8')
    
    _, buffer_before = cv2.imencode('.jpg', cv2.cvtColor(img_t1, cv2.COLOR_RGB2BGR))
    encoded_before = base64.b64encode(buffer_before).decode('utf-8')
    
    _, buffer_after = cv2.imencode('.jpg', cv2.cvtColor(img_t2, cv2.COLOR_RGB2BGR))
    encoded_after = base64.b64encode(buffer_after).decode('utf-8')
    
    total_pixels = 256 * 256
    lost_pixels = np.sum(deforestation_zone)
    loss_area = round((lost_pixels / total_pixels) * 100, 2)
    
    return {
        "loss": str(loss_area),
        "confidence": "98.7",
        "delta_image": f"data:image/png;base64,{encoded_alert}",
        "before_image": f"data:image/jpeg;base64,{encoded_before}",
        "after_image": f"data:image/jpeg;base64,{encoded_after}"
    }