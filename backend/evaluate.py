import os
import cv2
import torch
import numpy as np
from torchvision import transforms
from model.unet import UNet

def calculate_iou(pred_mask, true_mask, num_classes):
    ious = []
    for cls in range(num_classes):
        pred_inds = pred_mask == cls
        true_inds = true_mask == cls
        intersection = (pred_inds[true_inds]).sum()
        union = pred_inds.sum() + true_inds.sum() - intersection
        if union == 0:
            ious.append(float('nan')) 
        else:
            ious.append(float(intersection) / float(max(union, 1)))
    return np.nanmean(ious)

def evaluate_matrix():
    print("Booting up the EcoZilla Evaluation Engine...")
    
    model = UNet()
    model.load_state_dict(torch.load('model/weights/ecozilla_v1.pth', weights_only=True))
    model.eval()
    
    image_dir = 'data/test_images'
    mask_dir = 'data/test_masks'
    
    image_files = os.listdir(image_dir)
    
    if not image_files:
        print("No test images found! The vault is empty, fam. Drop some data in!")
        return

    total_iou = 0
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize((256, 256))
    ])

    print(f"Found {len(image_files)} test samples. Running inference...")
    
    with torch.no_grad():
        for img_name in image_files:
            # Load image
            img_path = os.path.join(image_dir, img_name)
            img = cv2.imread(img_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            input_tensor = transform(img).unsqueeze(0)
            
            # Load ground truth mask (assuming it's a grayscale image with class IDs 0-5)
            mask_path = os.path.join(mask_dir, img_name.replace('.jpg', '.png'))
            true_mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
            true_mask = cv2.resize(true_mask, (256, 256), interpolation=cv2.INTER_NEAREST)
            
            # Predict
            output = model(input_tensor)
            pred_mask = torch.argmax(output, dim=1).squeeze(0).cpu().numpy()
            
            # Score
            iou = calculate_iou(pred_mask, true_mask, num_classes=6)
            total_iou += iou
            
    final_score = (total_iou / len(image_files)) * 100
    print(f"Matrix Evaluation Complete!")
    print(f"Real-World Mean IoU Score: {final_score:.2f}%")

if __name__ == '__main__':
    evaluate_matrix()