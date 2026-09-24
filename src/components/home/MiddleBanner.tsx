import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function MiddleBanner() {
  return (
    <section className="w-full my-12 relative overflow-hidden">
      <Link
        href="/shop?brand=Asics"
        className="block relative w-full h-[320px] sm:h-[420px] md:h-[500px] cursor-pointer"
        aria-label="Khám phá ASICS"
      >
        <Image
          src="/images/banners/asics-comfort.png"
          alt="ASICS - Thoải mái hơn để cơ thể và tâm trí cùng chuyển động"
          fill
          priority
          className="object-cover object-center"
        />
      </Link>
    </section>
  );
}
