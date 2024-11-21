import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

export default function Filter() {
  const [selectedStatus, setSelectedStatus] = useState(new Set(["all"]));

  const status = [
    { label: "Free", key: "free" },
    { label: "Purchase", key: "purchase" },
    { label: "All", key: "all" },
  ];
  const language = [
    { label: "Vietnamese", key: "vn" },
    { label: "English", key: "en" },
  ];
  const price = [
    { label: "Under 500$", key: "low" },
    { label: "500$ - 1000$", key: "md" },
    { label: "Over 1000$", key: "high" },
  ];
  const levels = [
    { label: "Beginner", key: "bg" },
    { label: "Elementary", key: "el" },
    { label: "Intermediate", key: "in" },
    { label: "Upper Intermediate", key: "up" },
    { label: "Advanced", key: "ad" },
    { label: "Proficient", key: "pro" },
  ];

  const getStatusValue = () => {
    return Array.from(selectedStatus).join("");
  };

  return (
    <div className="flex gap-3 my-8 justify-items-center items-center">
      <div>
        <Select
          items={status}
          label="Status"
          placeholder=""
          className="min-w-[150px]"
          selectedKeys={selectedStatus}
          onSelectionChange={(keys) => setSelectedStatus(keys)}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>

      <div>
        <Select
          items={language}
          label="Language to learn"
          placeholder=""
          className="min-w-[200px]"
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>

      {getStatusValue() !== "free" && (
        <div>
          <Select
            items={price}
            label="Price"
            placeholder=""
            className="min-w-[150px]"
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>
      )}

      <div>
        <Select
          label="Levels"
          placeholder=""
          selectionMode="multiple"
          className="min-w-[200px]"
        >
          {levels.map((level) => (
            <SelectItem key={level.key}>{level.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <Button className="bg-green-300 min-h-[52px] min-w-[100px] text-white font-bold hover:shadow-lg transition">
          FILTER
        </Button>
      </div>
    </div>
  );
}
