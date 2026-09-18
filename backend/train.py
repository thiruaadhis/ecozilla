import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms
from model.unet import UNet
from dataset import EcoZillaDataset

# 1. Setup the Data Pipeline
transform = transforms.Compose([
    transforms.ToTensor()
])
dataset = EcoZillaDataset('data/train_images', 'data/train_masks', transform=transform)
# Feed the matrix 2 images at a time
dataloader = DataLoader(dataset, batch_size=2, shuffle=True) 

# 2. Initialize the Brain
model = UNet() 
# NOTE: If you have an Nvidia GPU, change the above to: model = UNet().cuda()

optimizer = optim.Adam(model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

print("Initiating Synthetic Training Run...")
for epoch in range(2): 
    model.train()
    epoch_loss = 0
    for images, true_masks in dataloader:
        # If using GPU, uncomment these:
        # images = images.cuda()
        # true_masks = true_masks.cuda()
        
        optimizer.zero_grad()
        predictions = model(images)
        loss = criterion(predictions, true_masks)
        loss.backward()
        optimizer.step()
        epoch_loss += loss.item()
        
    print(f"Epoch {epoch} | Loss: {epoch_loss/len(dataloader):.4f}")

# 3. Save the test brain to a NEW file so we don't cook V1
torch.save(model.state_dict(), 'model/weights/ecozilla_test_run.pth')
print("Matrix survival confirmed! Test weights secured.")