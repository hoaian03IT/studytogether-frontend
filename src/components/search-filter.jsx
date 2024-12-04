import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import { LanguageService } from "../apis/language.api.js";
import { CourseLevelService } from "../apis/courseLevel.api.js";
import { CourseService } from "../apis/course.api.js";
import { queryKeys } from "../react-query/query-keys.js";
import { Pagination } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce.jsx";
import { CgSortAz } from "react-icons/cg";
import { pathname } from "../routes";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";


export default function Filter({ onFilter }) {

  const navigate = useNavigate();
  
  const [formValue, setFormValue] = useState({
    targetLanguageId: "",
    sourceLanguageId: "",
    levels: [],
    searchTerm: "",
    price: "all",
    nPage: 1,
    nLimit: 15,
    t: "normal",
  });


  const searchTextDebounced = useDebounce(formValue.searchTerm, 800)

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const priceOptions = [
    { label: "All", key: "all" },
    { label: "Free", key: "free" },
    { label: "Under 50$", key: "low" },
    { label: "Over 50$", key: "high" },
  ];

  // Fetch all languages
  const languageQuery = useQuery({
    queryKey: [queryKeys.languages],
    queryFn: async () => {
      try {
        const data = await LanguageService.fetchAllLanguages();
        return data.languages;
      } catch (error) {
        console.error("Error fetching languages:", error);
        return [];
      }
    },
  });

  // Fetch levels based on selected target language
  const levelQuery = useQuery({
    queryKey: [queryKeys.levelCourse, formValue.targetLanguageId.currentKey],
    queryFn: async ({ queryKey }) => {
      if (!queryKey[1]) return [];
      try {
        const data = await CourseLevelService.fetchCourseLevelByLanguage(queryKey[1]);
        return data.levelCourses;
      } catch (error) {
        console.error("Error fetching levels:", error);
        return [];
      }
    },
    enabled: !!formValue.targetLanguageId,
  });

  // Fetch courses
  const courseQuery = useMutation({
    mutationFn: async (formValue) => {

      const response = await CourseService.searchCourses({
        ts: formValue.searchTerm,
        t: formValue.t,
        tli: formValue.targetLanguageId?.currentKey,
        sli: formValue.sourceLanguageId?.currentKey,
        cli: formValue.levels.length > 0 ? formValue.levels.join(",") : null,
        mip: formValue.price === "low" ? 0 : formValue.price === "high" ? 50 : 0,
        map: formValue.price === "low" ? 50 : formValue.price === "high" ? 99999 : 99999,
        nlm: formValue.nLimit,
        np: formValue.nPage,
      })

      return response.courses;
    },
    onSuccess: (data) => {
      onFilter(data || []);
    },
    onError: (error) => {
      console.error("Error in searchCourses:", error);
      toast.error(translation(error.response.data?.errorCode))
    },
  });

  useEffect(() => {

    courseQuery.mutate({ ...formValue, searchTerm: searchTextDebounced })
  }, [formValue.levels, formValue.nLimit, formValue.nPage, formValue.price, formValue.sourceLanguageId, formValue.targetLanguageId, searchTextDebounced]);


  const handleInputChange = (name, value) => {
    setFormValue((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (name !== "nPage") {
      setFormValue((prev) => ({
        ...prev,
        nPage: 1,
      }));
    }
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev);
    handleInputChange("t", showAdvancedFilters ? "normal" : "advance");
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="flex py-3 gap-2 my-8 justify-end ml-auto">
        <Button
          className="px-2 py-1 flex justify-end mr-auto bg-green-500 text-white text-sm font-bold rounded-lg shadow-md hover:bg-blue-600"
          onClick={() => navigate(pathname.createCourse)}
        >
          <GoPlus className="text-xl" />
          Create
        </Button>

        <Button
          color="primary"
          disabled={!formValue.searchTerm.trim()}
          onClick={toggleAdvancedFilters}
        >
          <CgSortAz className="text-2xl font-bold" />
          {showAdvancedFilters ? "Advanced filtering off" : "Advanced filtering"}
        </Button>
        <div className="flex items-center bg-white border-1 rounded-[80%]">
          <Input
            type="text"
            radius="sm"
            placeholder="Search"
            value={formValue.searchTerm}
            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
            className="col-span-2 row-start-2 border-spacing-2"
            endContent={
              <RxMagnifyingGlass className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6" />
            }
          />
        </div>
      </div>

      {/* Filters */}
      {showAdvancedFilters && (
        <div className="flex gap-3 my-8 justify-items-center items-center">
          {/* Price Filter */}
          <div>
            <Select
              items={priceOptions}
              label="Price"
              placeholder=""
              className="min-w-[150px]"
              selectedKey={formValue.price}
              onSelectionChange={(key) => handleInputChange("price", key)}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>

          {/* Source Language */}
          <div>
            <Select
              label="Ngôn ngữ gốc"
              placeholder="Chọn ngôn ngữ"
              className="min-w-[200px]"
              selectedKey={formValue.sourceLanguageId}
              onSelectionChange={(key) => handleInputChange("sourceLanguageId", key)}
            >
              {languageQuery.data?.map((lang) => (
                <SelectItem key={lang["language id"]} value={lang["language id"]}>
                  {lang["language name"]}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label="Ngôn ngữ học"
              placeholder="Chọn ngôn ngữ cần học"
              className="min-w-[200px]"
              selectedKey={formValue.targetLanguageId}
              onSelectionChange={(key) => handleInputChange("targetLanguageId", key)}
            >
              {languageQuery.data?.map((lang) => (
                <SelectItem key={lang["language id"]} value={lang["language id"]}>
                  {lang["language name"]}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label="Cấp độ"
              placeholder="Chọn cấp độ"
              className="min-w-[200px]"
              selectedKeys={formValue.levels}
              onSelectionChange={(keys) => handleInputChange("levels", Array.from(keys))}
            >
              {levelQuery.data?.map((level) => (
                <SelectItem key={level["course level id"]} value={level["course level id"]}>
                  {level["course level name"]}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      )}



      {/* Pagination */}
      <div className="flex justify-center my-4">
        <Pagination
          total={Math.ceil(courseQuery?.data?.length / formValue.nLimit) || 10}
          initialPage={formValue.nPage}
          onChange={(page) => handleInputChange("nPage", page)}
        />
      </div>
    </div>
  );
} 