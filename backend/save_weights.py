import torch
from model.unet import UNet

model = UNet()
# Target locked on the new vault location
torch.save(model.state_dict(), 'model/weights/ecozilla_v1.pth')
print("Random matrix weights successfully extracted to model/weights/ecozilla_v1.pth")