import os
import shutil
import random

# Define paths
train_img_dir = 'data/train_images'
train_mask_dir = 'data/train_masks'
test_img_dir = 'data/test_images'
test_mask_dir = 'data/test_masks'

# Create test vaults
os.makedirs(test_img_dir, exist_ok=True)
os.makedirs(test_mask_dir, exist_ok=True)

# Get all files and shuffle them
all_images = os.listdir(train_img_dir)
random.seed(42) 
random.shuffle(all_images)

# Calculate 10%
split_idx = int(len(all_images) * 0.1)
test_images = all_images[:split_idx]

print(f"Moving {len(test_images)} files to the test vault...")

# Move the files physically using DeepGlobe's exact naming convention
for img_name in test_images:
    mask_name = img_name.replace('_sat.jpg', '_mask.png')
    
    # Move Image
    shutil.move(os.path.join(train_img_dir, img_name), os.path.join(test_img_dir, img_name))
    # Move Mask
    shutil.move(os.path.join(train_mask_dir, mask_name), os.path.join(test_mask_dir, mask_name))

print("Static split complete. Test data secured.")