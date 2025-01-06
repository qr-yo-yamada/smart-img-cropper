import imageFiles from "@/assets/imageList.json";
import { useState } from "react";
import "./PhotoGallery.css";

// 公開フォルダ内の画像のファイル名をリストアップ
const imageFolderPath = "/src/assets/images/";

export const PhotoGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 選択された画像のインデックス

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const showNextImage = () => {
    if (selectedIndex !== null && selectedIndex < imageFiles.length - 1) {
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
        {imageFiles.map((fileName, index) => (
          <div
            key={index}
            className="card"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={`${imageFolderPath}${fileName}`}
              alt={`Image ${index + 1}`}
              className="card-image"
            />
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
              disabled={selectedIndex === imageFiles.length - 1} // 最後の画像では無効化
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
