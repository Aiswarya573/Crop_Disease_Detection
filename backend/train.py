import os
import sys
from model import create_dataset_from_directory, build_cnn_model, train_model

DATA_DIR = os.environ.get('DATASET_PATH', './data/PlantVillage')
SAVE_PATH = os.environ.get('MODEL_SAVE_PATH', 'crop_disease_model.h5')
EPOCHS = int(os.environ.get('EPOCHS', '30'))
BATCH_SIZE = int(os.environ.get('BATCH_SIZE', '32'))


def main():
    if not os.path.exists(DATA_DIR):
        print(f"Dataset directory not found: {DATA_DIR}")
        print("Please download the PlantVillage dataset and set DATASET_PATH environment variable.")
        print("Expected class folders inside DATA_DIR:")
        print("  corn_common_rust/")
        print("  healthy/")
        print("  potato_early_blight/")
        print("  potato_late_blight/")
        print("  tomato_early_blight/")
        print("  tomato_late_blight/")
        sys.exit(1)

    print(f"Loading dataset from: {DATA_DIR}")
    train_ds, val_ds = create_dataset_from_directory(DATA_DIR, batch_size=BATCH_SIZE)

    print("Building CNN model (MobileNetV2 backbone)...")
    model = build_cnn_model()
    model.summary()

    print(f"Starting training for {EPOCHS} epochs...")
    history = train_model(model, train_ds, val_ds, epochs=EPOCHS, save_path=SAVE_PATH)

    final_val_acc = history.history['val_accuracy'][-1]
    print(f"\nTraining complete.")
    print(f"Best validation accuracy: {max(history.history['val_accuracy']):.4f}")
    print(f"Final validation accuracy: {final_val_acc:.4f}")
    print(f"Model saved to: {SAVE_PATH}")


if __name__ == '__main__':
    main()
