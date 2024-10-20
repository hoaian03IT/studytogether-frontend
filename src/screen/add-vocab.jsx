import React, { useState } from 'react';
import { RiUserShared2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { PiPencilDuotone } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { LiaSellcast } from "react-icons/lia";
import { FaSortDown } from "react-icons/fa";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import englishFlag from "../assets/united-kingdom.png";
import VNFlag from "../assets/vietnam-flag.png"
import { TbTextPlus } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { ImBin } from "react-icons/im";c
import { FaImage } from "react-icons/fa";




const LanguageDropdown = ({ language, onSelectLanguage }) => {
  const [showLanguageOption, setShowLanguageOption] = useState(false);
  const languages = [
    { id: "en", name: "English", image: englishFlag },
    { id: "vi", name: "Tiếng Việt", image: VNFlag },
  ];

  return (
    <Popover
      placement="bottom-start"
      isOpen={showLanguageOption}
      onOpenChange={setShowLanguageOption}
    >
      <PopoverTrigger>
        <button className="flex items-center border-none outline-none">
          <img src={language.image} alt="" className="size-5 rounded-full" />
          <div className="ml-2 flex">
            <span>{language.id.toUpperCase()}</span>
            <FaSortDown className={showLanguageOption ? "rotate-180 translate-y-2" : ""} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-sm px-0">
        <div className="py-1 flex flex-col">
          {languages.map((lang) => (
            <button
              key={lang.id}
              className="px-4 py-3 flex items-center hover:bg-blue-50 transition-all"
              onClick={() => {
                onSelectLanguage(lang);
                setShowLanguageOption(false);
              }}
            >
              <img src={lang.image} alt="" className="size-5 rounded-full" />
              <div className="ml-3 flex items-center">
                <span>{lang.name} ({lang.id.toUpperCase()})</span>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

function VocabularyApp() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [vocabulary, setVocabulary] = useState('');
  const [definition, setDefinition] = useState('');
  const [vocabList, setVocabList] = useState([]);
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [languageVocab, setLanguageVocab] = useState({
    id: "en",
    name: "English",
    image: englishFlag,
  });
  const [languageDefinition, setLanguageDefinition] = useState({
    id: "vi",
    name: "Tiếng Việt",
    image: VNFlag,
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); 
  };

  const handleAdd = () => {
    if (vocabulary && definition) {
      const newVocab = {
        vocabulary,
        definition,
        audio,
        image,
        group: selectedGroup,
      };
      setVocabList([...vocabList, newVocab]);
      // Clear input fields
      setVocabulary('');
      setDefinition('');
      setAudio(null);
      setImage(null);
    }
  };

  // Delete vocabulary from the list
  const handleDelete = (index) => {
    const updatedList = vocabList.filter((_, i) => i !== index);
    setVocabList(updatedList);
  };

  // Add group
  const handleAddGroup = () => {
    if (groupName) {
      setGroups([...groups, groupName]);
      setGroupName('');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen" >
      <div className="flex gap-6 justify-center items-center bg-white  shadow-md rounded-lg ">
        <button className="px-6 py-4 bg-blue-100 border-b-4 border-blue-500 font-bold flex items-center gap-2" >
        <PiPencilDuotone className='size-6' />
          <span className="material-icons"> TỪ VỰNG</span>
        </button>
        <button className="px-6 py-4 text-gray-600 flex items-center gap-2">
        <FaBook className='size-6' />
          <span className="material-icons">VÍ DỤ VÀ BÀI TẬP</span>
        </button>
        <button className="px-6 py-4 text-gray-600 flex items-center gap-2">
        <MdLibraryBooks className='size-8' />
          <span className="material-icons">CHI TIẾT KHÓA</span>
        </button>
        <button className="px-6 py-4 text-gray-600 flex items-center gap-2">
        <LiaSellcast className='size-8'/>
          <span className="material-icons">KINH DOANH</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white p-6 rounded-lg shadow-md relative mt-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Tạo bộ từ vựng cho riêng bạn</h2>
        <p className="text-gray-400">Bộ từ vựng gia đình</p>

        {/* User icon for permission modal */}
        <button
          onClick={() => setShowPermissionModal(true)}  
        > <RiUserShared2Fill className='absolute top-4 right-6 size-5' />
        </button>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className= "relative bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">QUYỀN TRUY CẬP VÀ CHỈNH SỬA  </h2>
              <button onClick={() => setShowPermissionModal(false)}>
              <IoIosCloseCircle className=' right-4 size-6'/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quyền truy cập</label>
                <select className="block w-full p-2 border rounded">
                  <option>Chỉ mình tôi</option>
                  <option>Mọi người</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quyền chỉnh sửa</label>
                <select className="block w-full p-2 border rounded mb-16">
                  <option>Chỉ mình tôi</option>
                  <option>Mọi người</option>
                </select>
              </div>
              </div>
            <button
              onClick={() => setShowPermissionModal(false)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 mb-6 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
            >
              Lưu
            </button>
            
          </div>
        </div>
      )}


          <div className='flex mb-4'>
            <button onClick={() => setShowTextModal(true)}
             className='flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2'><TbTextPlus className='size-6 mr-1' />
            <span > Thêm từ văn bản</span></button>
            <button onClick={() => setShowFileModal(true)}
             className='flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2'><CgAttachment  className='size-6 mr-1' />
            <span > Thêm từ tệp</span></button>
            <button onClick={handleAddGroup} className='flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2'><LuPlus className='size-6 mr-1' />
            <span > Thêm nhóm/cấp độ</span></button>
          </div>
          


       <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex">    
        {/* Left Section - Inputs */}
        <div className="w-1/3  bg-gray-50 rounded-lg shadow p-6 pr-0 border-r  ">
      
          {/* Vocabulary and Definition Inputs */}
          <div className="flex-col gap-6">
            {/* Vocabulary Language Dropdown */}
            <div className="flex">
              <LanguageDropdown
                language={languageVocab}
                onSelectLanguage={setLanguageVocab}
              />
              <div className="ml-5">
                <label className="block text-sm font-medium">Từ vựng ({languageVocab.name})</label>
                <input
                  type="text"
                  value={vocabulary}
                  onChange={(e) => setVocabulary(e.target.value)}
                  placeholder="Nhập từ vựng"
                  className="p-2 border border-gray-300 rounded-md w-[60%]"
                />
              </div>
            </div>

            {/* Definition Language Dropdown */}
            <div className="flex mt-4">
              <LanguageDropdown
                language={languageDefinition}
                onSelectLanguage={setLanguageDefinition}
              />
              <div className="ml-7">
                <label className="block text-sm font-medium">Định nghĩa ({languageDefinition.name})</label>
                <input
                  type="text"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="Nhập định nghĩa"
                  className="p-2 border border-gray-300 rounded-md w-[60%]"
                />
              </div>
          </div>
          </div>

          {/* Group/Level Dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Nhóm/Cấp độ</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-1/2"
            >
              <option value="">Chọn nhóm</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <div className="w-1/2 flex mt-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nhập tên nhóm"
                className=" p-2 pr-0 mt-2 border border-gray-300 rounded-md flex-grow"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
          >
            Thêm
          </button>
        </div>

        {/* Right Section - Vocabulary List */}

<div className="w-2/3 pl-6 border rounded-lg overflow-hidden ml-6">
  <div className="grid grid-cols-4 bg-blue-100 p-2">
    <span className="font-bold text-blue-400">Từ vựng</span>
    <span className="font-bold text-blue-400">Định nghĩa</span>
  </div>
  {vocabList.length === 0 ? (
    <p className="text-gray-500">Chưa có từ vựng nào được thêm.</p>
  ) : (
    <ul className="space-y-2">
      {vocabList.map((item, index) => (
        <li key={index} className="grid grid-cols-4 bg-gray-100 p-3 rounded-md items-center gap-x-2">
          {/* Vocabulary Column */}
          <div className="flex items-center col-span-1">
            <p className="font-bold">{item.vocabulary}</p>
          </div>

          {/* Definition Column */}
          <div className="flex items-center col-span-1">
            <p>{item.definition}</p>
          </div>

          {/* Audio and Image Column */}
          <div className="flex items-center justify-center col-span-1 gap-2">
            {item.audio && (
              <audio controls className="h-8">
                <source src={URL.createObjectURL(item.audio)} type="audio/mpeg" />
              </audio>
            )}
             <div className="flex items-center justify-center col-span-1 gap-2"></div>
            {item.image && (
              <img
                src={URL.createObjectURL(item.image)}
                alt="Hình ảnh minh họa"
                className="h-12 w-12 object-cover"
              />
            )}
          </div>

          {/* Delete Button Column */}
          <div className="flex justify-end items-center col-span-1">
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <ImBin />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>


      </div>

      {showTextModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Thêm từ vựng từ văn bản</h2>
              <button onClick={() => setShowTextModal(false)}>
                <IoIosCloseCircle className="size-6" />
              </button>
            </div>
            <p className="text-gray-500 mb-4">Những từ quan trọng sẽ được thêm vào bộ từ vựng</p>
            <textarea
              className="w-full p-4 h-40 border border-gray-300 rounded-md mb-4"
              placeholder="Nhập hoặc dán ở đây..."
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTextModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md">Thêm</button>
            </div>
          </div>
        </div>
      )}

      {/* File Modal */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Thêm từ vựng từ tệp</h2>
              <button onClick={() => setShowFileModal(false)}>
                <IoIosCloseCircle className="size-6" />
              </button>
            </div>
            <p className="text-gray-500 mb-4">Những từ quan trọng sẽ được thêm vào bộ từ vựng</p>

            {/* Hidden file input */}
            <input
              type="file"
              id="fileInput"
              accept=".txt, .docx, .pdf, .jpg, .png"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border border-gray-300 bg-gray-200 rounded-md p-12 mb-4 text-center">
              <button
                className="bg-white text-gray-700 py-2 px-6 rounded-md mb-4"
                onClick={() => document.getElementById('fileInput').click()}
              >
                Chọn
              </button>
              {selectedFile && <p className="mt-4">Đã chọn: {selectedFile.name}</p>}
              <p>hoặc kéo thả ở đây...</p>
              <div className="mt-4 flex justify-center gap-6 text-gray-400">
                <span>(JPG, PNG)</span>
                <span>(TXT, DOCX, PDF)</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowFileModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">
                Hủy
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md">Thêm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VocabularyApp;
