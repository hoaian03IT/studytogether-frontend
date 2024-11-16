import { div } from "framer-motion/client";
import { RiExchangeBoxFill } from "react-icons/ri"
import {SidebaListexerciseItem} from "./sidebar-listexercise-item"


const SidebarListEx=[
    {
        label:"Điền vào chỗ trống",
        link:"/",
    },
    {
        label:"Animals",
        link:"/",
    },
    {
        label:"Nối cột",
        link:"/",
    },
    {
        label:"Đúng/sai",
        link:"/",
    },
    {
        label:"Sắp xếp",
        link:"/",
    },
    {
        label:"Câu hỏi ngắn",
        link:"/",
    },
    {
        label:"Animals",
        link:"/",
    },
]



const SidebarListExercise = () => { 
    return(
        <div className="h-full w-full flex flex-col gap-5 p-5 rounded-xl bg-white shadow-md">
            <div className="bg-light-blue-300 p-3 border rounded-lg">
                <p >Danh mục chủ đề</p>

            </div>
            <div className="flex flex-col gap-[10px] mb-auto">
                {SidebarListEx.map((item,index)=>{
                    return (
                        <SidebaListexerciseItem key={index} label={item.label} link={item.link}>
                        </SidebaListexerciseItem>
                    )
                })}

            </div>

        </div>

    );
    

}
export {SidebarListExercise};