import cv2
import torch
import base64
import numpy as np
from flask import Flask, jsonify, request
from torchvision import transforms
from model.unet import UNet 

app = Flask(__name__)

# Initialize the Brain
model = UNet()
model.eval()

def preprocess_image(cv_img):
    img_rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((256, 256))
    ])
    return transform(img_rgb).unsqueeze(0)

# The Color Palette (BGR format for OpenCV)
# Mapping our 6 classes to actual colors!
COLOR_MAP = np.array([
    [128, 128, 128], # 0: Urban (Gray)
    [0, 255, 255],   # 1: Agriculture (Yellow)
    [255, 255, 0],   # 2: Rangeland (Cyan)
    [0, 128, 0],     # 3: Forest (Green)
    [255, 0, 0],     # 4: Water (Blue)
    [139, 69, 19]    # 5: Barren (Brown)
], dtype=np.uint8)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "EcoZilla Matrix is ALIVE", "lead_engineer": "Aadhi"})

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    input_tensor = preprocess_image(img)
    
    with torch.no_grad():
        output_tensor = model(input_tensor)
    
    # --- POST-PROCESSING MAGIC ---
    # 1. The Argmax Crush: Get the winning class for each pixel [256, 256]
    pred_mask = torch.argmax(output_tensor, dim=1).squeeze(0).cpu().numpy()
    
    # 2. The Paint Job: Map the classes to our BGR colors
    colored_mask = COLOR_MAP[pred_mask]
    
    # 3. The Base64 Encode: Convert the painted image to a text string
    _, buffer = cv2.imencode('.png', colored_mask)
    encoded_img_string = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({
        "status": "success", 
        "message": "Image successfully segmented and painted!",
        "mask_base64": encoded_img_string
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)