import React from "react";
import { Button, Input } from "@nextui-org/react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { RxMagnifyingGlass, RxCross2, RxDotsVertical } from "react-icons/rx";
import { div, title } from "framer-motion/client";

const vocaData = [
  {
    voca: "appointment",
    type: "n",
    mean: ["cuộc hẹn", "bổ nhiệm"],
  },
  {
    voca: "apple",
    type: "n",
    mean: ["quả táo"],
  },
  {
    voca: "arrange",
    type: "v",
    mean: ["sắp xếp"],
  },
];

const VocaItem = ({ voca, type, mean }) => {
  return (
    <div className="w-full flex flex-col py-[10px] px-3 items-start gap-[5px] rounded border border-[#DBDBDB] bg-white ">
      <p className="text-base text-black font-medium ">
        {voca} <span>({type})</span>
      </p>
      <div className="flex items-center text-zinc-800 font-medium">
        {mean?.join(", ")}
      </div>
    </div>
  );
};

const list = [
  {
    title: "Appointment",
    examples: "She had to cancel her dental appointment.",
    explanation: "She had to cancel her dental appointment.",
  },
  {
    title: "Appointment",
    examples: "She had to cancel her dental appointment.",
    explanation: "She had to cancel her dental appointment.",
  },
];

const ExampleCard = ({ title, examples, explanation }) => {
  return (
    <div className="flex rounded border-[#DBDBDB] bg-white w-full p-3">
      <div className="flex flex-col gap-1 w-full">
        <div className="py-[10px] px-3 border rounded">
          <p>Tiêu đề</p>
          <p>{title}</p>
        </div>
        <div className="py-[10px] px-3 border rounded">
          <p>Ví dụ</p>
          <p>{examples}</p>
        </div>
        <div className="py-[10px] px-3 border rounded">
          <p>Giải thích</p>
          <p>{explanation}</p>
        </div>
      </div>
      <Button isIconOnly variant="light" className="flex-shrink-0">
        <RxDotsVertical />
      </Button>
    </div>
  );
};

const ListExamples = () => {
  return (
    <div className="flex items-start w-full p-4 bg-slate-100 gap-5">
      <div className="w-full">
        <div className="flex w-full gap-5 mb-5">
          <div className="flex items-center w-full justify-between">
            <p>Đang chọn từ</p>
            <Button color="warning" variant="faded" isIconOnly>
              <RxCross2 />
            </Button>
          </div>
          <Button>Thêm ví dụ</Button>
        </div>
        <div className="flex flex-col w-full rounded bg-slate-200 p-3">
          <div className="flex flex-col items-center gap-6">
            {list.map((item) => (
              <ExampleCard
                key={item.title}
                title={item.title}
                examples={item.examples}
                explanation={item.explanation}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center flex-shrink-0 self-stretch rounded-md bg-white  border-1 max-w-[400px] w-full px-5 py-4 gap-[30px]">
        <Input
          type="text"
          radius="sm"
          placeholder=" Tìm kiếm"
          className="col-span-2 row-start-2 border-spacing-2 "
          endContent={
            <RxMagnifyingGlass className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6" />
          }
        />
        <div className="flex flex-col w-full items-center gap-2">
          {vocaData.map((voca) => (
            <VocaItem
              key={voca.voca}
              voca={voca.voca}
              type={voca.type}
              mean={voca.mean}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListExamples;
