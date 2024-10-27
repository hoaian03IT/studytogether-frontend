import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiUserShared2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSortDown } from "react-icons/fa";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import englishFlag from "../assets/united-kingdom.png";
import VNFlag from "../assets/vietnam-flag.png"
import { TbTextPlus } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { ImBin } from "react-icons/im";
import { IoVolumeHigh } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { FcEditImage } from "react-icons/fc";
import { IoIosArrowDown } from "react-icons/io";


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

function AddVocab() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [vocabulary, setVocabulary] = useState('');
  const [definition, setDefinition] = useState('');
  const [vocabList, setVocabList] = useState([]);
  const [audio, setAudio] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null); 
  const [image, setImage] = useState(null);  
  const [showTextModal, setShowTextModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);
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
  const handleClickOutside = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      setShowPermissionModal(false);
    }
  };

  const handleAdd = () => {
    if (vocabulary && definition) {
      const newVocab = {
        vocabulary,
        definition,
        audio,
        image,
      };
      setVocabList([...vocabList, newVocab]);
      setVocabulary('');
      setDefinition('');
      setAudio(null);
      setImage(null);
    }
  };
  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudio(file);
    }
  };

  const toggleAudio = (audioFile) => {
    // Stop and reset the current audio if it exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }

    // Create a new Audio instance and play it if different
    const newAudio = new Audio(URL.createObjectURL(audioFile));
    newAudio.play();
    setCurrentAudio(newAudio);

    // Stop playback when the audio ends
    newAudio.onended = () => {
      setCurrentAudio(null);
    };
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Delete vocabulary 
  const DeleteConfirmation = (index) => {
    setSelectedItemToDelete(index);
    setShowDeleteModal(true);
  };

  // Confirm and delete the vocabulary item
  const handleConfirmDelete = () => {
    const updatedList = vocabList.filter((_, i) => i !== selectedItemToDelete);
    setVocabList(updatedList);
    setShowDeleteModal(false);
    setSelectedItemToDelete(null); 
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen" >     
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay z-50" onClick={handleClickOutside}>
          <div className= "relative bg-white p-6 rounded-lg shadow-lg w-1/3 z-60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">QUYỀN TRUY CẬP VÀ CHỈNH SỬA  </h2>
              <button onClick={() => setShowPermissionModal(false)}>
              <IoIosCloseCircle className=' right-4 size-6'/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className='relative' >
              <label className="block text-sm font-medium mb-2">Quyền truy cập</label>
                <select className="w-full px-3 py-2 mb-20 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
                 <option>Chỉ mình tôi</option>
                 <option>Mọi người</option>
                </select>
                <IoIosArrowDown className="absolute top-12 right-5 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className='relative'>
                <label className="block text-sm font-medium mb-2">Quyền chỉnh sửa</label>
                 <select className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2"> 
                 <option>Chỉ mình tôi</option>
                 <option>Mọi người</option>
                </select>
                <IoIosArrowDown className="absolute top-12 right-4  transform -translate-y-1/2 text-gray-400 pointer-events-none" />
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
            <div >
        <Link 
          to="/add-by-levels" 
          className='flex items-center px-4 py-2 bg-green-300 border rounded-md shadow-sm mr-2'>
          <LuPlus className='size-6 mr-1' />
          <span>Nhóm</span>
        </Link>
      </div>
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
                  className="p-2 border border-gray-300 rounded-md w-[75%]"
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
                  className="p-2 border border-gray-300 rounded-md w-[75%]"
                />
              </div>
          </div>
          </div>

          {/* Add audio */}  
          <div className=' flex gap-10 mt-6 '>      
          <div className="mt-4">
           <button
              onClick={() => document.getElementById('audioInput').click()}
              className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100  transition"
              >
              <FaMicrophone />
              <span>Thêm âm thanh</span>
          </button>
        <input
            type="file"
            accept=".mp3, .mp4"
            onChange={handleAudioChange}
            id="audioInput"
            className="hidden"
            />

            {audio && (
            <p className="mt-2 text-sm text-gray-600">
            {audio.name}
            </p>
                 )}
          </div>

          {/*add image */}
          <div className="mt-4">
           <button
              onClick={() => document.getElementById('imageInput').click()}
              className="relative flex items-center gap-2 p-7 text-4xl cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-100  transition"
              style={{ width: '100px', height: '100px' }}
              >
               {image ? (
            <img
              src={image}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover rounded-md"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <AiOutlinePicture />
          )}
          </button>
        <input
            type="file"
            accept=".jpg, .png"
            onChange={handleImageChange}
            id="imageInput"
            className="hidden"
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

     
        <div className="w-2/3 pl-6 border rounded-lg overflow-hidden ml-6">
        <div className="grid grid-cols-7 bg-blue-100 p-2 gap-x-1">
            <span className="font-bold text-blue-400 col-span-2 ">Từ vựng</span>
            <span className="font-bold text-blue-400 col-span-2 ml-4">Định nghĩa</span>
            <span className="font-bold text-blue-400 justify-self-end">Audio</span>
            <span className="font-bold text-blue-400 justify-self-end">Hình ảnh</span>
            <span className="font-bold text-blue-400 justify-self-end">Action</span>
          </div>
          {vocabList.length === 0 ? (
            <p className="text-gray-500">Chưa có từ vựng nào được thêm.</p>
          ) : (
            <ul className="space-y-2">
              {vocabList.map((item, index) => (
                <li key={index} className="grid grid-cols-7 bg-gray-100 p-3 rounded-md items-center gap-x-1">
                  <p className="font-bold col-span-2">{item.vocabulary}</p>
                  <p className='col-span-2 ml-4'>{item.definition}</p>
                    <div className='col-span-1 flex justify-center'>
                  {item.audio && (
                    <button
                      onClick={() => toggleAudio(item.audio)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <IoVolumeHigh size={24} />
                    </button>
                  )}
                  </div>
                <div className="col-span-1 flex justify-center ">
                  {item.image ? (
                    <FcEditImage size={24} />
                  ) : (
                    <span></span> 
                  )}
                </div>

          
          <div className="col-span-1 flex justify-center">
            <button
               onClick={() => DeleteConfirmation(index)}
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
                onClick={() => promptDeleteConfirmation(index)}
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

        {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Xác nhận xóa</h2>
              <button onClick={() => setShowDeleteModal(false)}>
                <IoIosCloseCircle className="size-6" />
              </button>
            </div>
            <p className="text-gray-500 mb-4">Bạn có chắc chắn muốn xóa từ vựng này không?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Hủy
              </button>
              <button
                  onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVocab;