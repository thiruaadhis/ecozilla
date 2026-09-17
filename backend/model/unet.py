import torch
import torch.nn as nn

# The EcoZilla Neural Network
class UNet(nn.Module):
    def __init__(self, in_channels=3, num_classes=6):
        super(UNet, self).__init__()
        
        # The Encoder (Compresses the image to find features)
        self.encoder = nn.Sequential(
            nn.Conv2d(in_channels, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )
        
        # The Decoder (Upscales it back into a colored mask)
        self.decoder = nn.Sequential(
            nn.Conv2d(64, num_classes, kernel_size=3, padding=1),
            nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True)
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x
        
# Quick test to make sure the matrix accepts it
if __name__ == "__main__":
    model = UNet()
    dummy_input = torch.randn(1, 3, 256, 256) # Simulating our exact tensor!
    output = model(dummy_input)
    print(f"Success! Model output shape: {output.shape}")