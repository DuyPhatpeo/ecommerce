import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const initialProducts = [
  {
    id: "prod-ultraboost-solar",
    title: "Adidas Ultraboost Solar Yellow",
    brand: "Adidas",
    category: "Running",
    price: 2400000,
    regularPrice: 3200000,
    salePrice: 2400000,
    rating: 5,
    colors: ["Vàng Neon", "Trắng", "Đen"],
    img: "/images/hero_ultraboost.png",
    description: "Bộ sưu tập mùa hè 2025 - Tinh thần năng động, êm ái, bứt phá năng lượng vượt trội.",
    featured: true,
  },
  {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1",
    brand: "Nike",
    category: "Giày Nam",
    price: 3829000,
    regularPrice: 4200000,
    salePrice: 3829000,
    rating: 5,
    img: "/images/lebron_tr1.jpg",
    description: "Giày thể thao nam cao cấp LeBron TR 1 tối ưu bám sân và hỗ trợ vận động cường độ cao.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train",
    brand: "Nike",
    category: "Giày Nam",
    price: 2059000,
    regularPrice: 2600000,
    salePrice: 2059000,
    rating: 4.8,
    colors: ["#1e293b", "#f8fafc"],
    img: "/images/hero_ultraboost.png",
    description: "Thiết kế linh hoạt, êm ái, hỗ trợ tập gym và chạy bộ nhẹ nhàng.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10",
    brand: "Nike",
    category: "Giày Nam",
    price: 1959000,
    regularPrice: 2490000,
    salePrice: 1959000,
    rating: 4.9,
    colors: ["#ffffff", "#94a3b8"],
    img: "/images/hero_ultraboost.png",
    description: "Dòng giày luyện tập đỉnh cao với đế bám vững chãi, siêu bền cho bài tập tạ.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-free-metcon-6",
    title: "Nike Free Metcon 6",
    brand: "Nike",
    category: "Giày Nam",
    price: 2279000,
    regularPrice: 2890000,
    salePrice: 2279000,
    rating: 4.8,
    colors: ["#2563eb", "#0f172a", "#1e3a8a"],
    img: "/images/hero_ultraboost.png",
    description: "Sự kết hợp hoàn hảo giữa độ linh hoạt tự nhiên của Nike Free và độ vững chắc của Metcon.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro",
    brand: "Nike",
    category: "Giày Nam",
    price: 5279000,
    regularPrice: 5800000,
    salePrice: 5279000,
    rating: 5,
    colors: ["#0284c7", "#0f172a", "#fef3c7"],
    img: "/images/hero_ultraboost.png",
    description: "Biểu tượng thời trang đường phố bất hủ với chất da cao cấp và phối màu Retro tinh tế.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-air-max-dn8",
    title: "Nike Air Max Dn8 Leather",
    brand: "Nike",
    category: "Giày Nam",
    price: 6179000,
    regularPrice: 6900000,
    salePrice: 6179000,
    rating: 5,
    colors: ["#2563eb", "#0f172a", "#78350f"],
    img: "/images/hero_ultraboost.png",
    description: "Thế hệ đệm khí Dynamic Air đột phá mang lại cảm giác êm ái trên từng bước chuyển động.",
    isSaleTet: true,
  },
  {
    id: "prod-nike-reax-8",
    title: "Nike Reax 8",
    brand: "Nike",
    category: "Top Sneaker",
    price: 1000000,
    regularPrice: 1800000,
    salePrice: 1000000,
    rating: 4.7,
    img: "/images/hero_ultraboost.png",
    description: "Hệ thống lò xo Reax ở gót chân giúp giảm chấn tối đa cho runner.",
    isTopSneaker: true,
  },
  {
    id: "prod-nike-air-max-97",
    title: "Nike Shoes Air Max 97",
    brand: "Nike",
    category: "Top Sneaker",
    price: 1000000,
    regularPrice: 2200000,
    salePrice: 1000000,
    rating: 4.9,
    img: "/images/hero_ultraboost.png",
    description: "Thiết kế gợn sóng mang tính biểu tượng kết hợp đệm Air Max toàn chiều dài.",
    isTopSneaker: true,
  },
  {
    id: "prod-nike-terra-manta",
    title: "Nike Terra Manta - Đỏ",
    brand: "Nike",
    category: "Top Sneaker",
    price: 1000000,
    regularPrice: 1950000,
    salePrice: 1000000,
    rating: 4.8,
    img: "/images/hero_ultraboost.png",
    description: "Đậm chất thể thao cá tính với phối màu đỏ rực lửa nổi bật.",
    isTopSneaker: true,
  },
  {
    id: "prod-nike-air-zoom",
    title: "Nike Air Zoom",
    brand: "Nike",
    category: "Top Sneaker",
    price: 1000000,
    regularPrice: 2100000,
    salePrice: 1000000,
    rating: 4.8,
    img: "/images/hero_ultraboost.png",
    description: "Phản hồi lực tức thì với túi đệm Zoom Air nhạy bén.",
    isTopSneaker: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isSaleTet = searchParams.get("saleTet");
    const isTopSneaker = searchParams.get("topSneaker");

    const db = await getDatabase();
    const collection = db.collection("products");

    // Check if products collection is empty, then seed initial data
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(initialProducts);
    }

    const query: any = {};
    if (category) query.category = category;
    if (isSaleTet === "true") query.isSaleTet = true;
    if (isTopSneaker === "true") query.isTopSneaker = true;

    const products = await collection.find(query).toArray();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("MongoDB API error:", error);
    // Fallback to static data if MongoDB is unreachable
    return NextResponse.json({ success: true, data: initialProducts, fallback: true });
  }
}
