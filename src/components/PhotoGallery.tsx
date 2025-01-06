import { useEffect, useState } from "react";
import "./PhotoGallery.css";
import * as faceapi from "@vladmandic/face-api";

const imageFolderPath = "/src/assets/images/";

export const PhotoGallery = () => {
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // モデルロード関数
  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    console.log("Face API.js models loaded");
    setIsModelLoaded(true); // モデルロード完了フラグを更新
  };

  useEffect(() => {
    // モデルロードの初期化
    const initialize = async () => {
      await loadModels();
    };
    initialize();

    // 画像ファイルリストの初期化
    import("@/assets/imageList.json").then((module) => {
      setImageFiles(module.default);
    });
  }, []);

  useEffect(() => {
    if (imageFiles.length > 0 && isModelLoaded) {
      processImages();
    }
  }, [imageFiles, isModelLoaded]);

  const processImages = async () => {
    const results: string[] = [];

    for (const fileName of imageFiles) {
      const img = new Image();
      img.src = `${imageFolderPath}${fileName}`;
      await new Promise((resolve) => {
        img.onload = async () => {
          const canvas = await cropFace(img);
          if (canvas) {
            results.push(canvas.toDataURL());
          } else {
            results.push(img.src); // 顔検出失敗時は元の画像を使用
          }
          resolve(true);
        };
      });
    }

    setProcessedImages(results);
  };

  const cropFace = async (
    image: HTMLImageElement
  ): Promise<HTMLCanvasElement | null> => {
    const detections = await faceapi.detectSingleFace(
      image,
      new faceapi.TinyFaceDetectorOptions()
    );
    if (!detections) {
      console.warn(`No face detected: ${image.src}`);
      return null;
    }

    const { x, y, width, height } = detections.box;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return null;

    const size = Math.max(width, height);
    canvas.width = size;
    canvas.height = size;

    context.drawImage(
      image,
      x - (size - width) / 2,
      y - (size - height) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return canvas;
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNextImage = () => {
    if (selectedIndex !== null && selectedIndex < processedImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const showPreviousImage = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="gallery">
      <div className="image-list">
        {processedImages.map((src, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleImageClick(index)}
          >
            <img src={src} alt={`Image ${index + 1}`} className="card-image" />
            <div className="card-title">Image {index + 1}</div>
          </div>
        ))}
      </div>

      {/* モーダル表示 */}
      {selectedIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じない
          >
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <button
              className="previous-button"
              onClick={showPreviousImage}
              disabled={selectedIndex === 0} // 最初の画像では無効化
            >
              ◀
            </button>
            <img
              src={`${imageFolderPath}${imageFiles[selectedIndex]}`}
              alt={`Image ${selectedIndex + 1}`}
              className="modal-image"
            />
            <button
              className="next-button"
              onClick={showNextImage}
              disabled={selectedIndex === processedImages.length - 1} // 最後の画像では無効化
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
