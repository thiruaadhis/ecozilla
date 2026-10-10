import torch
import cv2
import numpy as np
import matplotlib.pyplot as plt
from torchvision import transforms
from model.unet import UNet

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = UNet()
state_dict = torch.load('model/weights/ecozilla_v6_gpu.pth', weights_only=True)
model.load_state_dict(state_dict)
model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Resize((256, 256), antialias=True)
])

before_img = cv2.imread('before.png')
before_img = cv2.cvtColor(before_img, cv2.COLOR_BGR2RGB)

after_img = cv2.imread('after.png')
after_img = cv2.cvtColor(after_img, cv2.COLOR_BGR2RGB)

before_tensor = transform(before_img).unsqueeze(0).to(device)
after_tensor = transform(after_img).unsqueeze(0).to(device)

with torch.no_grad():
    out_before = model(before_tensor)
    out_after = model(after_tensor)

mask_before = torch.argmax(out_before.squeeze(), dim=0).cpu().numpy()
mask_after = torch.argmax(out_after.squeeze(), dim=0).cpu().numpy()

forest_class_index = 1 
non_forest_class_index = 0 

deforestation_mask = np.where(
    (mask_before == forest_class_index) & (mask_after == non_forest_class_index), 
    1, 
    0
)

highlighted_after = cv2.resize(after_img, (256, 256))
highlighted_after[deforestation_mask == 1] = [255, 0, 0]

fig, axes = plt.subplots(1, 3, figsize=(18, 6))

axes[0].imshow(cv2.resize(before_img, (256, 256)))
axes[0].set_title('T-Minus 6 Months (Before)', fontsize=14, fontweight='bold')

axes[1].imshow(cv2.resize(after_img, (256, 256)))
axes[1].set_title('Current Orbit (After)', fontsize=14, fontweight='bold')

axes[2].imshow(highlighted_after)
axes[2].set_title('Deforestation Delta (Red)', fontsize=14, fontweight='bold')

for ax in axes:
    ax.axis('off')

plt.savefig('deforestation_delta_test.png', bbox_inches='tight', dpi=300, facecolor='#F8F9FA')
print("Delta matrix rendered: deforestation_delta_test.png")