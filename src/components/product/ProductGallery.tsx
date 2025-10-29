import { useState, useCallback, useEffect, memo } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [visibleThumbs, setVisibleThumbs] = useState(4);
  const [thumbIndex, setThumbIndex] = useState(0);
  const maxThumbIndex = Math.max(0, images.length - visibleThumbs);

  const safeImages = images.length ? images : ["placeholder.jpg"];

  /** Responsive thumbnails */
  useEffect(() => {
    const updateVisibleThumbs = () => {
      setVisibleThumbs(window.innerWidth < 640 ? 3 : 4);
    };
    updateVisibleThumbs();
    window.addEventListener("resize", updateVisibleThumbs);
    return () => window.removeEventListener("resize", updateVisibleThumbs);
  }, []);

  /** Image change */
  const changeImage = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= safeImages.length) return;
      setFade(false);
      setTimeout(() => {
        setSelectedImage(newIndex);
        setFade(true);
        setZoom(1);
        setPosition({ x: 0, y: 0 });

        if (newIndex < thumbIndex) {
          setThumbIndex(newIndex);
        } else if (newIndex >= thumbIndex + visibleThumbs) {
          setThumbIndex(newIndex - visibleThumbs + 1);
        }
      }, 150);
    },
    [safeImages.length, thumbIndex, visibleThumbs]
  );

  const nextImage = useCallback(() => {
    changeImage((selectedImage + 1) % safeImages.length);
  }, [selectedImage, safeImages.length, changeImage]);

  const prevImage = useCallback(() => {
    changeImage(
      selectedImage === 0 ? safeImages.length - 1 : selectedImage - 1
    );
  }, [selectedImage, safeImages.length, changeImage]);

  /** Scroll lock & keyboard */
  useEffect(() => {
    document.body.style.overflow = isZoomed ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isZoomed]);

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

  /** Zoom & drag */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(1, Math.min(4, z - e.deltaY * 0.001)));
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

  /** Touch support */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom <= 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && zoom <= 1) {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      const diffX = touchStart.x - touchEnd.x;
      const diffY = Math.abs(touchStart.y - touchEnd.y);

      if (Math.abs(diffX) > 50 && diffY < 100) {
        if (diffX > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }
  };

  /** Thumbnails slide */
  const handleNextThumbs = () =>
    setThumbIndex((prev) => Math.min(prev + 1, maxThumbIndex));
  const handlePrevThumbs = () => setThumbIndex((prev) => Math.max(prev - 1, 0));

  const visibleImages = safeImages.slice(
    thumbIndex,
    thumbIndex + visibleThumbs
  );

  /** Render */
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main image */}
      <div className="relative group">
        <div
          className="relative aspect-[3/4] sm:aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={safeImages[selectedImage] || "placeholder.jpg"}
              alt={title}
              onError={(e) => (e.currentTarget.src = "placeholder.jpg")}
              loading="lazy"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>

          {/* Prev/Next buttons */}
          {safeImages.length > 1 && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                icon={<ChevronLeft className="w-5 h-5" />}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                icon={<ChevronRight className="w-5 h-5" />}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
              />
            </>
          )}

          {/* Counter */}
          {safeImages.length > 1 && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
              {selectedImage + 1} / {safeImages.length}
            </div>
          )}

          {/* Zoom icon */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 z-10">
            <Maximize2 className="w-5 h-5 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="relative px-8 sm:px-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Prev button (always visible) */}
            <Button
              onClick={handlePrevThumbs}
              disabled={thumbIndex === 0}
              className={`absolute left-0 z-10 p-2 rounded-full border shadow-md transition-all ${
                thumbIndex === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 border-gray-200 hover:scale-110 active:scale-95"
              }`}
              icon={<ChevronLeft className="w-4 h-4" />}
            />

            <div className="flex justify-center gap-2 sm:gap-3 overflow-hidden">
              {visibleImages.map((img, idx) => {
                const actualIndex = thumbIndex + idx;
                const isActive = selectedImage === actualIndex;

                return (
                  <button
                    key={actualIndex}
                    onClick={() => changeImage(actualIndex)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? "border-orange-500 shadow-lg ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300 opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <div className="aspect-[3/4] w-16 sm:w-20 bg-gray-100">
                      <img
                        src={img || "placeholder.jpg"}
                        alt={`${title} ${actualIndex + 1}`}
                        onError={(e) =>
                          (e.currentTarget.src = "placeholder.jpg")
                        }
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next button (always visible) */}
            <Button
              onClick={handleNextThumbs}
              disabled={thumbIndex === maxThumbIndex}
              className={`absolute right-0 z-10 p-2 rounded-full border shadow-md transition-all ${
                thumbIndex === maxThumbIndex
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 border-gray-200 hover:scale-110 active:scale-95"
              }`}
              icon={<ChevronRight className="w-4 h-4" />}
            />
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <Button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full text-white transition-all hover:scale-110 active:scale-95 z-10"
            icon={<X className="w-6 h-6" />}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative max-w-[90vw] sm:max-w-5xl max-h-[85vh]"
          >
            <img
              src={safeImages[selectedImage] || "placeholder.jpg"}
              onError={(e) => (e.currentTarget.src = "placeholder.jpg")}
              alt={title}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                  position.y / zoom
                }px)`,
                transition: dragging ? "none" : "transform 0.15s ease-out",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
              className="object-contain w-full h-full max-h-[85vh]"
              onClick={(e) => {
                e.stopPropagation();
                if (zoom <= 1) setZoom(2);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);
