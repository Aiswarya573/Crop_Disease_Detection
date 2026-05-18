import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

IMAGE_SIZE = (224, 224)
NUM_CLASSES = 6
CLASS_NAMES = [
    'corn_common_rust',
    'healthy',
    'potato_early_blight',
    'potato_late_blight',
    'tomato_early_blight',
    'tomato_late_blight',
]


def build_cnn_model():
    base = tf.keras.applications.MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights='imagenet',
    )
    base.trainable = False

    model = models.Sequential([
        base,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.4),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(NUM_CLASSES, activation='softmax'),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy'],
    )

    return model


def load_or_build_model(weights_path=None):
    model = build_cnn_model()
    if weights_path:
        try:
            model.load_weights(weights_path)
        except Exception:
            pass
    return model


def preprocess_image(image_array):
    img = tf.image.resize(image_array, IMAGE_SIZE)
    img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
    return np.expand_dims(img.numpy(), axis=0)


def train_model(model, train_dataset, val_dataset, epochs=20, save_path='crop_disease_model.h5'):
    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3),
        tf.keras.callbacks.ModelCheckpoint(save_path, save_best_only=True),
    ]

    history = model.fit(
        train_dataset,
        validation_data=val_dataset,
        epochs=epochs,
        callbacks=callbacks,
    )

    return history


def create_dataset_from_directory(data_dir, batch_size=32, validation_split=0.2, seed=42):
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=validation_split,
        subset='training',
        seed=seed,
        image_size=IMAGE_SIZE,
        batch_size=batch_size,
        label_mode='categorical',
        class_names=CLASS_NAMES,
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=validation_split,
        subset='validation',
        seed=seed,
        image_size=IMAGE_SIZE,
        batch_size=batch_size,
        label_mode='categorical',
        class_names=CLASS_NAMES,
    )

    augment = tf.keras.Sequential([
        layers.RandomFlip('horizontal_and_vertical'),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.15),
        layers.RandomContrast(0.1),
    ])

    train_ds = train_ds.map(
        lambda x, y: (augment(x, training=True), y),
        num_parallel_calls=tf.data.AUTOTUNE,
    ).prefetch(tf.data.AUTOTUNE)

    val_ds = val_ds.prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds
