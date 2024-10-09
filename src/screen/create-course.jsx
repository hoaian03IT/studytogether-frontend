import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { Input, Textarea } from "@nextui-org/input";
import { Image } from "@nextui-org/image";

const CreateCourse = () => {
  const [formValue, setFormValue] = useState({
    spokenLanguage: " ",
    linguistics: " ",
    level: " ",
    vocabularySet: " ",
    keywords: " ",
    shortDescription: "",
    detailedDescription: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log("FormValue", formValue);
  };

  const handleCancel = () => {
    console.log("Profile edit canceled");
  };

  return (
    <div className="bg-white p-8 rounded w-full">
      <h1 className="text-gray-700 mb p-6 b bg-gradient-to-r from-blue-300 to-red-100 rounded-lg text-center text-3xl">
        TẠO KHÓA HỌC CHO RIÊNG BẠN
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-5 mt-6">
        <Select
          label="Ngôn ngữ nói"
          placeholder="Khóa học"
          labelPlacement="outside"
          radius="sm"
          name="spokenLanguage"
          onChange={handleInputChange}
        >
          <SelectItem className="max-w-xs" key="vn">
            Tiếng Việt
          </SelectItem>
          <SelectItem className="max-w-xs" key="en">
            Tiếng Anh
          </SelectItem>
        </Select>
        <Select
          label="Ngôn ngữ học"
          placeholder="Ngôn ngữ"
          labelPlacement="outside"
          radius="sm"
          name="linguistics"
          onChange={handleInputChange}
        >
          <SelectItem className="max-w-xs" key="vn">
            Tiếng Việt
          </SelectItem>
          <SelectItem className="max-w-xs" key="en">
            Tiếng Anh
          </SelectItem>
        </Select>
        <Select
          label="Cấp độ"
          placeholder="Cấp độ"
          labelPlacement="outside"
          radius="sm"
          onChange={handleInputChange}
          name="level"
        >
          <SelectItem className="max-w-xs" key={400}>
            Toeic 400
          </SelectItem>
          <SelectItem className="max-w-xs" key={600}>
            Toeic 600
          </SelectItem>
          <SelectItem className="max-w-xs" key={800}>
            Toeic 800
          </SelectItem>
        </Select>

        <Input
          name="vocabularySet"
          type="text"
          label="Tên bộ từ vựng"
          labelPlacement="outside"
          radius="sm"
          placeholder=" "
          value={formValue.vocabularySet}
          onChange={handleInputChange}
          className="col-span-2 row-start-2 border-spacing-2"
        />
        <Input
          name="keywords"
          type="text"
          label="Từ khóa"
          labelPlacement="outside"
          radius="sm"
          className="col-span-2 col-start-1 row-start-3"
          value={formValue.keywords}
          onChange={handleInputChange}
        />
        <div className="row-span-2 col-start-3 row-start-2 overflow-hidden mt-5">
          <Image
            alt="NextUI hero Image"
            src="https://nextui.org/images/hero-card-complete.jpeg"
          />
        </div>
        <Input
          name="shortDescription"
          type="text"
          label="Mô tả ngắn"
          labelPlacement="outside"
          radius="sm"
          placeholder=" "
          className="col-span-3 row-start-4"
          value={formValue.shortDescription}
          onChange={handleInputChange}
        />
        <Textarea
          label="Mô tả chi tiết"
          labelPlacement="outside"
          radius="sm"
          placeholder="Enter your description"
          className="col-span-3 row-start-5"
          value={formValue.detailedDescription}
          onChange={handleInputChange}
        />
        <div className="row-start-6 flex gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-orange-500 px-4 py-2 rounded"
          >
            Lưu
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
