import os
import cv2
import torch
from torch.utils.data import Dataset
import numpy as np

class EcoZillaDataset(Dataset):
    def __init__(self, images_dir, masks_dir, transform=None):
        self.images_dir = images_dir
        self.masks_dir = masks_dir
        self.transform = transform
        # Grab all the image filenames in the directory
        self.images = os.listdir(images_dir)

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        # 1. Get the paths
        img_path = os.path.join(self.images_dir, self.images[idx])
        # Assuming masks have the exact same name but are saved as .png
        mask_name = self.images[idx].replace('.jpg', '.png')
        mask_path = os.path.join(self.masks_dir, mask_name)

        # 2. Load and format the Satellite Image
        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # 3. Load the Mask (Read as grayscale since it just contains class numbers 0-5)
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE) 

        # 4. Apply PyTorch Transforms (like resizing to 256x256)
        if self.transform:
            image = self.transform(image)

        # 5. Convert mask to a LongTensor (Required for CrossEntropyLoss math)
        mask = torch.from_numpy(mask).long()

        return image, mask