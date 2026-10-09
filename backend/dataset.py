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
        colors = np.array([
            [0, 255, 255],
            [255, 255, 0],
            [255, 0, 255],
            [0, 255, 0],
            [0, 0, 255],
            [255, 255, 255],
            [0, 0, 0]
        ])
        
        distances = np.linalg.norm(mask_img[:, :, None, :] - colors[None, None, :, :], axis=-1)
        encoded = np.argmin(distances, axis=-1)
        
        return encoded.astype(np.int64)

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
        
        mask = cv2.imread(mask_path)
        if mask is None:
            raise ValueError(f"FATAL: The matrix couldn't find the mask at {mask_path}")
        
        mask = cv2.cvtColor(mask, cv2.COLOR_BGR2RGB)
        mask = cv2.resize(mask, self.img_size, interpolation=cv2.INTER_NEAREST)
        
        mask_tensor = self.encode_mask(mask)
        
        if self.transform:
            image = self.transform(image)
            
        mask_tensor = torch.from_numpy(mask_tensor).long()
        return image, mask_tensor