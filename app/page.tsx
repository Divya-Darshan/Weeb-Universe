// app/page.tsx
import Image from "next/image";
import Bg from '@/components/ui/bg'
import Products  from '@/components/product/product'
import ProductOver from '@/components/product/productover'
import Drop from '@/components/product/drop'
import Foot from '@/components/footer/footer'

export default function Home() {
  return (
          <>
          <Bg/>
          <Products/>
          <Drop/>
          <Foot/>
          {/* <ProductOver/> */}
          



          
          </>
  );
}
