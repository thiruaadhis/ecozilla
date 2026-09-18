import os
import numpy as np
import cv2

# Create the data vaults
os.makedirs('data/train_images', exist_ok=True)
os.makedirs('data/train_masks', exist_ok=True)

print("Generating synthetic ecosystem for the matrix...")
for i in range(10):
    # Fake satellite image (RGB noise)
    fake_img = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
    # Fake mask (classes 0 to 5)
    fake_mask = np.random.randint(0, 6, (256, 256), dtype=np.uint8)
    
    cv2.imwrite(f'data/train_images/fake_{i}.jpg', fake_img)
    cv2.imwrite(f'data/train_masks/fake_{i}.png', fake_mask)

print("Massive W! Fake dataset secured in the data vault.")