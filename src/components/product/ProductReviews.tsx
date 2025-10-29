import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Props {
  reviews?: Review[];
}

export default function ProductReviews({ reviews = [] }: Props) {
  const [allReviews, setAllReviews] = useState<Review[]>(reviews);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    setAllReviews([newReview, ...allReviews]);
    setName("");
    setComment("");
    setRating(0);
    setHoverRating(0);
  };

  return (
    <div className="animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-orange-500" />
        Customer reviews
      </h3>

      {/* --- Nếu chưa có review --- */}
      {allReviews.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Khối thông báo chưa có đánh giá */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-orange-400" />
            <p className="text-gray-600 font-medium mb-4">
              No reviews for this product yet.
            </p>
            <p className="text-sm text-gray-500">
              Be the first to leave a review!
            </p>
          </div>

          {/* Khối form đánh giá */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border-2 border-dashed border-gray-300">
            <h4 className="font-bold text-gray-800 mb-3">Write your review</h4>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Rating */}
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      (hoverRating || rating) >= star
                        ? "text-orange-400 fill-orange-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating ? `${rating}/5` : "Select stars"}
                </span>
              </div>

              {/* Tên */}
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              {/* Bình luận */}
              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />

              <button
                type="submit"
                className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Submit review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Nếu đã có review --- */}
      {allReviews.length > 0 && (
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-xl bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <strong>{review.name}</strong>
                <span className="text-orange-400 flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-gray-400 text-sm mt-1">{review.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
