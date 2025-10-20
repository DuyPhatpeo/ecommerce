import { useState, useCallback, useEffect, memo } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Button from "../ui/Button";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [fade, setFade] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const visibleThumbs = 4;

  const changeImage = useCallback((newIndex: number) => {
    setFade(false);
    setTimeout(() => {
      setSelectedImage(newIndex);
      setFade(true);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }, 150);
  }, []);

  const nextImage = useCallback(() => {
    changeImage((selectedImage + 1) % images.length);
  }, [selectedImage, images.length, changeImage]);

  const prevImage = useCallback(() => {
    changeImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  }, [selectedImage, images.length, changeImage]);

  // Khóa scroll khi mở zoom
  useEffect(() => {
    document.body.style.overflow = isZoomed ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isZoomed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      if (e.key === "Escape") setIsZoomed(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isZoomed, nextImage, prevImage]);

  // Handle zoom & drag
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(3, z - e.deltaY * 0.0015)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div className="space-y-5">
      {/* Ảnh chính */}
      <div
        className="relative aspect-[4/5] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <div
          className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={images[selectedImage]}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Nút điều hướng */}
        {images.length > 1 && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous image"
              icon={<ChevronLeft className="w-5 h-5" />}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              icon={<ChevronRight className="w-5 h-5" />}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
            />
          </>
        )}

        {/* Nút Zoom */}
        <div className="absolute bottom-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all">
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex justify-center px-6 mt-2">
        <div
          className={`grid gap-3 max-w-md ${
            images.length === 1
              ? "grid-cols-1 justify-items-center"
              : images.length === 2
              ? "grid-cols-2 justify-items-center"
              : images.length === 3
              ? "grid-cols-3 justify-items-center"
              : "grid-cols-4"
          }`}
        >
          {images.slice(0, visibleThumbs).map((img, idx) => {
            const remaining = images.length - visibleThumbs;
            const showOverlay = idx === visibleThumbs - 1 && remaining > 0;

            return (
              <button
                key={idx}
                onClick={() => !showOverlay && changeImage(idx)}
                aria-label={`Select image ${idx + 1}`}
                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === idx
                    ? "border-orange-500 scale-105 shadow-md"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="aspect-[4/5] w-full bg-gray-50 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${title} ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center select-none"
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                      +{remaining}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center cursor-zoom-out select-none"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                icon={<ChevronLeft className="w-6 h-6 text-white" />}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white/10"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                icon={<ChevronRight className="w-6 h-6 text-white" />}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white/10"
              />
            </>
          )}

          <div
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="max-w-5xl max-h-[90vh] overflow-hidden"
          >
            <img
              src={images[selectedImage]}
              alt={title}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                  position.y / zoom
                }px)`,
                transition: dragging ? "none" : "transform 0.15s ease",
                cursor: zoom > 1 ? "grab" : "zoom-out",
              }}
              draggable={false}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);
