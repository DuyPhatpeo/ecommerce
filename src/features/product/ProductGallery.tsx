import { useState, useCallback, useEffect, memo } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";

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
  const [pinchStart, setPinchStart] = useState(0);
  const [lastZoom, setLastZoom] = useState(1);
  const [doubleTapTime, setDoubleTapTime] = useState(0);

  const maxThumbIndex = Math.max(0, images.length - visibleThumbs);
  const safeImages = images.length
    ? images
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];

  /** Responsive thumbnails */
  useEffect(() => {
    const updateVisibleThumbs = () => {
      setVisibleThumbs(window.innerWidth < 640 ? 3 : 4);
    };
    updateVisibleThumbs();
    window.addEventListener("resize", updateVisibleThumbs);
    return () => window.removeEventListener("resize", updateVisibleThumbs);
  }, []);

  /** Image change with animation */
  const changeImage = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= safeImages.length) return;
      setFade(false);
      setTimeout(() => {
        setSelectedImage(newIndex);
        setFade(true);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setLastZoom(1);

        if (newIndex < thumbIndex) {
          setThumbIndex(newIndex);
        } else if (newIndex >= thumbIndex + visibleThumbs) {
          setThumbIndex(newIndex - visibleThumbs + 1);
        }
      }, 150);
    },
    [safeImages.length, thumbIndex, visibleThumbs],
  );

  const nextImage = useCallback(() => {
    changeImage((selectedImage + 1) % safeImages.length);
  }, [selectedImage, safeImages.length, changeImage]);

  const prevImage = useCallback(() => {
    changeImage(
      selectedImage === 0 ? safeImages.length - 1 : selectedImage - 1,
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
      if (e.key === "Escape") {
        setIsZoomed(false);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(4, z + 0.5));
      }
      if (e.key === "-" || e.key === "_") {
        setZoom((z) => Math.max(1, z - 0.5));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isZoomed, nextImage, prevImage]);

  /** Desktop zoom & drag */
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((z) => {
      const newZoom = Math.max(1, Math.min(4, z + delta));
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && zoom > 1) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setDragging(false);

  /** Touch support for main image swipe */
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

  /** Touch support for zoom modal - pinch to zoom and drag */
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleModalTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getDistance(e.touches[0], e.touches[1]);
      setPinchStart(distance);
      setLastZoom(zoom);
    } else if (e.touches.length === 1) {
      if (zoom > 1) {
        // Drag when zoomed
        setDragging(true);
        setStartPos({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y,
        });
      }

      // Double tap to zoom
      const now = Date.now();
      if (now - doubleTapTime < 300) {
        if (zoom === 1) {
          setZoom(2.5);
        } else {
          setZoom(1);
          setPosition({ x: 0, y: 0 });
        }
      }
      setDoubleTapTime(now);
    }
  };

  const handleModalTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart > 0) {
      // Pinch zoom
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchStart;
      const newZoom = Math.max(1, Math.min(4, lastZoom * scale));
      setZoom(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && dragging && zoom > 1) {
      // Drag
      e.preventDefault();
      const maxX = (zoom - 1) * 200;
      const maxY = (zoom - 1) * 200;
      const newX = e.touches[0].clientX - startPos.x;
      const newY = e.touches[0].clientY - startPos.y;
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleModalTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setPinchStart(0);
      setDragging(false);
    }
  };

  /** Zoom controls */
  const handleZoomIn = () => {
    setZoom((z) => Math.min(4, z + 0.5));
  };

  const handleZoomOut = () => {
    setZoom((z) => {
      const newZoom = Math.max(1, z - 0.5);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  /** Thumbnails slide */
  const handleNextThumbs = () =>
    setThumbIndex((prev) => Math.min(prev + 1, maxThumbIndex));
  const handlePrevThumbs = () => setThumbIndex((prev) => Math.max(prev - 1, 0));

  const visibleImages = safeImages.slice(
    thumbIndex,
    thumbIndex + visibleThumbs,
  );

  /** Render */
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main image */}
      <div className="relative group">
        <div
          className="relative aspect-[3/4] sm:aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-zoom-in"
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
              src={safeImages[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              loading="lazy"
              className="w-full h-full object-cover object-center select-none"
            />
          </div>

          {/* Prev/Next buttons */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-3 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm p-3 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Counter */}
          {safeImages.length > 1 && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-medium">
              {selectedImage + 1} / {safeImages.length}
            </div>
          )}

          {/* Zoom icon */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg transition-all hover:scale-110 active:scale-95 z-10 pointer-events-none">
            <FiMaximize2 className="w-5 h-5 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="relative px-8 sm:px-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Prev button */}
            <button
              onClick={handlePrevThumbs}
              disabled={thumbIndex === 0}
              className={`absolute left-0 z-10 p-2 rounded-xl border shadow-md transition-all ${
                thumbIndex === 0
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-white hover:bg-gray-50 border-gray-200 active:scale-95"
              }`}
              aria-label="Previous thumbnails"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {/* Thumbnails list */}
            <div className="flex justify-center gap-2 sm:gap-3 overflow-hidden">
              {visibleImages.map((img, idx) => {
                const actualIndex = thumbIndex + idx;
                const isActive = selectedImage === actualIndex;

                return (
                  <button
                    key={actualIndex}
                    onClick={() => changeImage(actualIndex)}
                    className={`relative rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-orange-400 opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`View image ${actualIndex + 1}`}
                  >
                    <div className="aspect-[3/4] w-16 sm:w-20 bg-gray-100">
                      <img
                        src={img}
                        alt={`${title} thumbnail ${actualIndex + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={handleNextThumbs}
              disabled={thumbIndex === maxThumbIndex}
              className={`absolute right-0 z-10 p-2 rounded-xl border shadow-md transition-all ${
                thumbIndex === maxThumbIndex
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  : "bg-white hover:bg-gray-50 border-gray-200 active:scale-95"
              }`}
              aria-label="Next thumbnails"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsZoomed(false);
              handleResetZoom();
            }
          }}
        >
          {/* Close button */}
          <button
            onClick={() => {
              setIsZoomed(false);
              handleResetZoom();
            }}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-white transition-all hover:scale-110 active:scale-95 z-10"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Image counter */}
          {safeImages.length > 1 && (
            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium z-10">
              {selectedImage + 1} / {safeImages.length}
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3 z-10">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className={`p-2 rounded-xl transition-all ${
                zoom <= 1
                  ? "text-white/40 cursor-not-allowed"
                  : "text-white hover:bg-white/20 active:scale-95"
              }`}
              aria-label="Zoom out"
            >
              <FiZoomOut className="w-5 h-5" />
            </button>
            <span className="text-white text-sm font-medium min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 4}
              className={`p-2 rounded-xl transition-all ${
                zoom >= 4
                  ? "text-white/40 cursor-not-allowed"
                  : "text-white hover:bg-white/20 active:scale-95"
              }`}
              aria-label="Zoom in"
            >
              <FiZoomIn className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation arrows */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-white transition-all hover:scale-110 active:scale-95 z-10"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl text-white transition-all hover:scale-110 active:scale-95 z-10"
                aria-label="Next image"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image container */}
          <div
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleModalTouchStart}
            onTouchMove={handleModalTouchMove}
            onTouchEnd={handleModalTouchEnd}
            className="relative max-w-[90vw] sm:max-w-5xl max-h-[85vh] touch-none"
          >
            <img
              src={safeImages[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${
                  position.y / zoom
                }px)`,
                transition:
                  dragging || pinchStart > 0
                    ? "none"
                    : "transform 0.2s ease-out",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
              className="object-contain w-full h-full max-h-[85vh] select-none"
            />
          </div>

          {/* Hint text */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-xs text-center z-10 hidden sm:block">
            Scroll to zoom • Drag to pan • Arrow keys to navigate
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ProductGallery);
