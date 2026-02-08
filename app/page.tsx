
import Profile from '@/components/profile/profile'
import { ImageKitProvider, Image } from "@imagekit/next";



export default function Home() {
  return (
          <>

         
            <ImageKitProvider  urlEndpoint="https://ik.imagekit.io/weeb">
            
            <Image  src="a"      
             width={500}
             height={500}
             loading="lazy" 
             alt="Picture of the author" />
             
            </ImageKitProvider>
                      
          <Profile/>

          
          </>
  );
}
