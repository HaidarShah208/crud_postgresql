import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
<>
<div className="flex flex-col  items-center justify-center min-h-screen p-8 pb-20  ">
    <div className="text-3xl">
    Insert Student Data
    </div>
     <div className="bg-blue-500 my-10 text-right hover:bg-blue-700 text-white font-bold py-2 px-4  rounded-full">
          <Link href={"/student/create"}>Add Now</Link>
        </div>  
    </div>
</>
  );
}
