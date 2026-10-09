import sys
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms
from model.unet import UNet
from dataset import EcoZillaDataset

if __name__ == '__main__':
    if not torch.cuda.is_available():
        sys.exit("FATAL ERROR: No GPU detected! The matrix requires your RTX 4060.")

    device = torch.device('cuda')
    print(f"Matrix Compute Engine: {torch.cuda.get_device_name(0)} is LOCKED IN.")

    transform = transforms.Compose([
        transforms.ToTensor()
    ])

    train_dataset = EcoZillaDataset('data/train_images', 'data/train_masks', transform=transform)
    test_dataset = EcoZillaDataset('data/test_images', 'data/test_masks', transform=transform)

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=4, pin_memory=True)
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False, num_workers=4, pin_memory=True)

    model = UNet(num_classes=7).to(device)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.CrossEntropyLoss()

    print("Igniting 100-Epoch Run with Auto-Checkpointing...")

    epochs = 100
    best_val_loss = float('inf')

    for epoch in range(epochs): 
        model.train()
        train_loss = 0
        for images, true_masks in train_loader:
            images = images.to(device)
            true_masks = true_masks.to(device)
            
            optimizer.zero_grad()
            predictions = model(images)
            loss = criterion(predictions, true_masks)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            
        avg_train_loss = train_loss / len(train_loader)
        
        model.eval()
        val_loss = 0
        with torch.no_grad():
            for val_images, val_masks in test_loader:
                val_images = val_images.to(device)
                val_masks = val_masks.to(device)
                
                val_preds = model(val_images)
                v_loss = criterion(val_preds, val_masks)
                val_loss += v_loss.item()
                
        avg_val_loss = val_loss / len(test_loader)
        
        print(f"Epoch {epoch+1}/{epochs} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f}")
        
        if avg_val_loss < best_val_loss:
            print(f"  -> Massive W! Val loss dropped from {best_val_loss:.4f} to {avg_val_loss:.4f}. Securing V6 weights.")
            best_val_loss = avg_val_loss
            torch.save(model.state_dict(), 'model/weights/ecozilla_v6_gpu.pth')

    print("Training Complete. All systems nominal. Model weights saved to 'model/weights/ecozilla_v6_gpu.pth'.")