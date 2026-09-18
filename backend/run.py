import os
import cv2
import time
import torch
import base64
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from torchvision import transforms
from model.unet import UNet 

app = Flask(__name__)
CORS(app) # Unlocks the API for our frontend!

#  Initialize the Brain and Load the Memory!
model = UNet()
model.load_state_dict(torch.load('model/weights/ecozilla_v1.pth', weights_only=True))
model.eval()

def preprocess_image(cv_img):
    img_rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((256, 256))
    ])
    return transform(img_rgb).unsqueeze(0)

# The Color Palette
COLOR_MAP = np.array([
    [128, 128, 128], [0, 255, 255], [255, 255, 0], 
    [0, 128, 0], [255, 0, 0], [139, 69, 19]    
], dtype=np.uint8)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "EcoZilla Matrix is ALIVE", "lead_engineer": "Aadhi"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'image_t1' not in request.files or 'image_t2' not in request.files:
        return jsonify({"error": "Missing temporal data! Need both image_t1 and image_t2"}), 400
    
    file1 = request.files['image_t1']
    file2 = request.files['image_t2']
    
    img1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_COLOR)
    
    tensor_t1 = preprocess_image(img1)
    tensor_t2 = preprocess_image(img2)
    
    # Run BOTH timelines through the neural network
    with torch.no_grad():
        output_t1 = model(tensor_t1)
        output_t2 = model(tensor_t2)
        
    pred_mask_t1 = torch.argmax(output_t1, dim=1).squeeze(0).cpu().numpy()
    pred_mask_t2 = torch.argmax(output_t2, dim=1).squeeze(0).cpu().numpy()
    
    # ⚔️ THE DELTA ENGINE: Deforestation Detection Math
    # Class 3 = Forest, Class 5 = Barren (Dirt/Logged land)
    deforestation_zone = (pred_mask_t1 == 3) & (pred_mask_t2 == 5)
    
    # Paint the Tactical Map (Black background)
    alert_mask = np.zeros((256, 256, 3), dtype=np.uint8)
    # Paint the destroyed forest pixels glowing RED (BGR format: [0, 0, 255])
    alert_mask[deforestation_zone] = [0, 0, 255]
    
    # Package the tactical map for the frontend
    _, buffer = cv2.imencode('.png', alert_mask)
    encoded_alert = base64.b64encode(buffer).decode('utf-8')
    
    # Calculate severity for the Ranger Alert System
    total_pixels = 256 * 256
    lost_pixels = np.sum(deforestation_zone)
    loss_percentage = (lost_pixels / total_pixels) * 100
    
    return jsonify({
        "status": "success", 
        "message": "Delta Engine complete. Tactical alert map generated!",
        "deforestation_rate": f"{loss_percentage:.2f}%",
        "alert_mask_base64": encoded_alert
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)