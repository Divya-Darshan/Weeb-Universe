// app/page.tsx
'use client'
import { useState } from "react";
import Image from "next/image";
import Bg from '@/components/ui/bg'
import Products  from '@/components/product/product'
import ProductOver from '@/components/product/productover'
import Drop from '@/components/product/drop'
import Foot from '@/components/footer/footer'


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <>
      <Bg/>
      <Drop selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

      <Products selectedCategory={selectedCategory} />
      <Drop selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />
      <Foot/>
    </>
  );
}
