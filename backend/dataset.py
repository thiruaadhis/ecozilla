import os
import cv2
import numpy as np
import torch
from torch.utils.data import Dataset

class EcoZillaDataset(Dataset):
    def __init__(self, image_dir, mask_dir, transform=None):
        self.image_dir = image_dir
        self.mask_dir = mask_dir
        self.transform = transform
        self.images = os.listdir(image_dir)
        self.img_size = (512, 512)

    def encode_mask(self, mask_img):
        # Create an empty matrix of zeros
        encoded = np.zeros((mask_img.shape[0], mask_img.shape[1]), dtype=np.int64)
        
        # Map DeepGlobe RGB colors to strict math integers
        encoded[(mask_img == [0, 255, 255]).all(axis=2)] = 0   # Urban (Cyan)
        encoded[(mask_img == [255, 255, 0]).all(axis=2)] = 1   # Agriculture (Yellow)
        encoded[(mask_img == [255, 0, 255]).all(axis=2)] = 2   # Rangeland (Magenta)
        encoded[(mask_img == [0, 255, 0]).all(axis=2)] = 3     # Forest (Green)
        encoded[(mask_img == [0, 0, 255]).all(axis=2)] = 4     # Water (Blue)
        encoded[(mask_img == [255, 255, 255]).all(axis=2)] = 5 # Barren (White)
        encoded[(mask_img == [0, 0, 0]).all(axis=2)] = 6       # Unknown (Black)
        
        return encoded

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        img_name = self.images[idx]
        mask_name = img_name.replace('_sat.jpg', '_mask.png')
        
        img_path = os.path.join(self.image_dir, img_name)
        mask_path = os.path.join(self.mask_dir, mask_name)
        
        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, self.img_size)
        
        # Read mask in full RGB to catch the exact colors
        mask = cv2.imread(mask_path)
        if mask is None:
            raise ValueError(f"FATAL: The matrix couldn't find the mask at {mask_path}")
        
        mask = cv2.cvtColor(mask, cv2.COLOR_BGR2RGB)
        mask = cv2.resize(mask, self.img_size, interpolation=cv2.INTER_NEAREST)
        
        # Convert the RGB image into strict integer classes
        mask_tensor = self.encode_mask(mask)
        
        if self.transform:
            image = self.transform(image)
            
        mask_tensor = torch.from_numpy(mask_tensor).long()
        return image, mask_tensor