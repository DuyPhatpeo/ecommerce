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

  /** ======================
   *  RESPONSIVE THUMBNAILS
   * ====================== */
  useEffect(() => {
    const updateVisibleThumbs = () => {
      if (window.innerWidth < 640) {
        setVisibleThumbs(3);
      } else {
        setVisibleThumbs(4);
      }
    };

    updateVisibleThumbs();
    window.addEventListener("resize", updateVisibleThumbs);
    return () => window.removeEventListener("resize", updateVisibleThumbs);
  }, []);

  /** ======================
   *  HANDLE MAIN IMAGE CHANGE
   * ====================== */
  const changeImage = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= images.length) return;
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
    [images.length, thumbIndex, visibleThumbs]
  );

  const nextImage = useCallback(() => {
    changeImage((selectedImage + 1) % images.length);
  }, [selectedImage, images.length, changeImage]);

  const prevImage = useCallback(() => {
    changeImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  }, [selectedImage, images.length, changeImage]);

  /** ======================
   *  SCROLL LOCK & KEYBOARD
   * ====================== */
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

  /** ======================
   *  ZOOM & DRAG
   * ====================== */
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

  /** ======================
   *  TOUCH SUPPORT
   * ====================== */
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

  /** ======================
   *  THUMBNAILS SLIDE
   * ====================== */
  const handleNextThumbs = () =>
    setThumbIndex((prev) => Math.min(prev + 1, maxThumbIndex));

  const handlePrevThumbs = () => setThumbIndex((prev) => Math.max(prev - 1, 0));

  const visibleImages = images.slice(thumbIndex, thumbIndex + visibleThumbs);

  /** ======================
   *  RENDER
   * ====================== */
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
              src={images[selectedImage]}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>

          {images.length > 1 && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                icon={<ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                icon={<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10"
              />
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Zoom icon */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 z-10">
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Thumbnails slider */}
      {images.length > 1 && (
        <div className="relative px-8 sm:px-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {thumbIndex > 0 && (
              <button
                onClick={handlePrevThumbs}
                className="absolute left-0 z-10 p-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
              </button>
            )}

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
                    <div className="aspect-[3/4] w-14 sm:w-18 md:w-20 lg:w-24 bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={img}
                        alt={`${title} ${actualIndex + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover object-center select-none"
                      />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {thumbIndex < maxThumbIndex && (
              <button
                onClick={handleNextThumbs}
                className="absolute right-0 z-10 p-2 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center cursor-zoom-out select-none"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2.5 sm:p-3 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95 z-10"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Image counter in modal */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm sm:text-base font-medium z-10">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                icon={
                  <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                }
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 sm:p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 z-10"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                icon={
                  <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                }
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 sm:p-4 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 z-10"
              />
            </>
          )}

          {/* Zoom instructions */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs sm:text-sm z-10">
            <span className="hidden sm:inline">
              Scroll to zoom • Drag to pan •{" "}
            </span>
            <span>Press ESC to close</span>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative max-w-[90vw] sm:max-w-5xl max-h-[70vh] sm:max-h-[85vh]"
          >
            <img
              src={images[selectedImage]}
              alt={title}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                  position.y / zoom
                }px)`,
                transition: dragging ? "none" : "transform 0.15s ease-out",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
              className="object-contain w-full h-full max-w-full max-h-[70vh] sm:max-h-[85vh]"
              onClick={(e) => {
                e.stopPropagation();
                if (zoom <= 1) {
                  setZoom(2);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);
