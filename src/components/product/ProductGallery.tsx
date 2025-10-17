import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={title}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            {/* Nút Prev */}
            <Button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              icon={<ChevronLeft className="w-5 h-5" />}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            />

            {/* Nút Next */}
            <Button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              icon={<ChevronRight className="w-5 h-5" />}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            />
          </>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === idx
                ? "border-orange-500 scale-105"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <img
              src={img}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
