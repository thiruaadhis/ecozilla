import cv2
import numpy as np

# 1. Create a fake 256x256 satellite image (random static noise)
fake_img = np.random.randint(0, 256, (256, 256, 3), dtype=np.uint8)
cv2.imwrite('data/test_images/sample_1.jpg', fake_img)

# 2. Create a fake human-drawn mask (random pixels mapped to classes 0-5)
fake_mask = np.random.randint(0, 6, (256, 256), dtype=np.uint8)
cv2.imwrite('data/test_masks/sample_1.png', fake_mask)

print("Dummy test data successfully injected into the vault!")