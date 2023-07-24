import Link from "next/link";


export default function SidebarLink({ svg, text, href }) {


  return (
    <Link href={href}>
    <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
      {svg}
      <span className="text-[15px] ml-4 text-gray-200 font-bold">{text}</span>
    </div>
    </Link>
  )
}