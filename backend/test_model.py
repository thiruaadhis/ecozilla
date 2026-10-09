import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
from model.unet import UNet

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = UNet()
model.load_state_dict(torch.load('model/weights/ecozilla_v5_gpu.pth', weights_only=True))
model.to(device)
model.eval()

def get_mask(img_path):
    img = cv2.imread(img_path)
    if img is None:
        raise FileNotFoundError(f"Missing file: {img_path}")
    
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_resized = cv2.resize(img, (256, 256))
    
    tensor = torch.from_numpy(img_resized).float().permute(2, 0, 1).unsqueeze(0).to(device) / 255.0
    
    with torch.no_grad():
        output = model(tensor)
        mask = torch.argmax(output, dim=1).squeeze().cpu().numpy()
        
    return img_resized, mask

img_raw, mask_pred = get_mask('before.jpg')

fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].set_title("Raw Orbit")
ax[0].imshow(img_raw)
ax[1].set_title("Raw U-Net Terrain Classes")
ax[1].imshow(mask_pred, cmap='viridis', vmin=0, vmax=6)

plt.tight_layout()
plt.show()