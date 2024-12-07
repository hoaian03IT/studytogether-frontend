import React, { useState } from "react";
import OwnCourse from "../screen/mycourse-own";
import FinishedCourse from "../screen/mycourse-finished";
import UnfinishedCourse from "../screen/mycourse-unfinished";
import { Tabs, Tab } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const MyCourse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("own");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tabs container */}
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Tabs onSelectionChange={(key) => setActiveTab(key)}>
            <Tab key="own" title="Own Courses" />
            <Tab key="unfinished" title="Unfinished Courses" />
            <Tab key="finished" title="Finished Courses" />
          </Tabs>
        </div>
      </div>

      {/* Content container */}
      <div>
        {activeTab === "own" && <OwnCourse />}
        {activeTab === "unfinished" && <UnfinishedCourse />}
        {activeTab === "finished" && <FinishedCourse />}
      </div>
    </div>
  );
};

export default MyCourse;
