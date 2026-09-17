import cv2
import torch
import numpy as np
from flask import Flask, jsonify, request
from torchvision import transforms

# The absolute flex: Importing your custom AI architecture
from model.unet import UNet 

app = Flask(__name__)

# Initialize the EcoZilla Brain
model = UNet()
model.eval() # Locks the brain into "inference mode" (no training allowed)

def preprocess_image(cv_img):
    img_rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((256, 256))
    ])
    return transform(img_rgb).unsqueeze(0)

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
    
    # 1. Preprocess the image into math
    input_tensor = preprocess_image(img)
    
    # 2. Feed the tensor directly into the AI!
    with torch.no_grad(): # Tells PyTorch to save memory, we are just predicting
        output_tensor = model(input_tensor)
    
    return jsonify({
        "status": "success", 
        "message": "AI Inference Complete! The matrix has spoken.",
        "output_shape": list(output_tensor.shape)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)