import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

interface Props {
  reviews?: Review[];
}

export default function ProductReviews({ reviews = [] }: Props) {
  const sampleReviews: Review[] = [
    {
      id: "1",
      name: "John Doe",
      rating: 5,
      comment: "Excellent product! Highly recommended.",
      date: "10/11/2025",
    },
    {
      id: "2",
      name: "Jane Smith",
      rating: 4,
      comment: "Very good quality, fast shipping.",
      date: "09/11/2025",
    },
    {
      id: "3",
      name: "Alice Johnson",
      rating: 3,
      comment: "Product is okay, packaging could be better.",
      date: "08/11/2025",
    },
    {
      id: "4",
      name: "Bob Williams",
      rating: 2,
      comment: "Not satisfied, color was different than advertised.",
      date: "07/11/2025",
    },
    {
      id: "5",
      name: "Emily Davis",
      rating: 1,
      comment: "Poor quality, broke after one use.",
      date: "06/11/2025",
    },
  ];

  const [allReviews, setAllReviews] = useState<Review[]>(
    reviews.length ? reviews : sampleReviews
  );
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY
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
        Customer Reviews
      </h3>

      {/* --- Review List --- */}
      {allReviews.length > 0 && (
        <div className="space-y-4 mb-8">
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-xl bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <strong>{review.name}</strong>
                <span className="text-orange-400 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300"
                      }`}
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

      {/* --- Review Form --- */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border-2 border-dashed border-gray-300">
        <h4 className="font-bold text-gray-800 mb-3">Write Your Review</h4>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Star Rating */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-orange-400 fill-orange-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating ? `${rating}/5` : "Select stars"}
            </span>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {/* Comment */}
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
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
