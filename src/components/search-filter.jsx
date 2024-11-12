import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

const SearchnFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseOption, setPurchaseOption] = useState('all');
  const [priceRange, setPriceRange] = useState('');
  const [level, setLevel] = useState([]);
  const [category, setCategory] = useState([]);
  const [showPriceFilter, setShowPriceFilter] = useState(true);

  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const priceOptions = ['Under 500$', '500$ - 1000$', 'Over 1000$'];
  const levelOptions = ['Basic', 'Advanced', 'Elementary', 'Master'];
  const categoryOptions = ['Movies', 'Historic', 'Cuisine', 'Educate'];

  const purchaseRef = useRef(null);
  const priceRef = useRef(null);
  const levelRef = useRef(null);
  const categoryRef = useRef(null);

  const handlePurchaseChange = (option) => {
    setPurchaseOption(option);
    setShowPriceFilter(option !== 'free');
  };

  const handleToggleLevel = (option) => {
    setLevel(level.includes(option) ? level.filter(item => item !== option) : [...level, option]);
  };

  const handleToggleCategory = (option) => {
    setCategory(category.includes(option) ? category.filter(item => item !== option) : [...category, option]);
  };

  const handlePriceChange = (option) => {
    setPriceRange(option);
  };

  const handleClickOutside = (event) => {
    if (
      purchaseRef.current && !purchaseRef.current.contains(event.target) &&
      priceRef.current && !priceRef.current.contains(event.target) &&
      levelRef.current && !levelRef.current.contains(event.target) &&
      categoryRef.current && !categoryRef.current.contains(event.target)
    ) {
      setIsPurchaseOpen(false);
      setIsPriceOpen(false);
      setIsLevelOpen(false);
      setIsCategoryOpen(false);
    }
  };

  const handlePurchaseClick = () => {
    setIsPurchaseOpen(!isPurchaseOpen);
    setIsPriceOpen(false);
    setIsLevelOpen(false);
    setIsCategoryOpen(false);
  };

  const handlePriceClick = () => {
    setIsPriceOpen(!isPriceOpen);
    setIsPurchaseOpen(false);
    setIsLevelOpen(false);
    setIsCategoryOpen(false);
  };

  const handleLevelClick = () => {
    setIsLevelOpen(!isLevelOpen);
    setIsPurchaseOpen(false);
    setIsPriceOpen(false);
    setIsCategoryOpen(false);
  };

  const handleCategoryClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setIsPurchaseOpen(false);
    setIsPriceOpen(false);
    setIsLevelOpen(false);
  };

  const handleApply = (filterType) => {
    if (filterType === 'price') {
      setIsPriceOpen(false);
    } else if (filterType === 'level') {
      setIsLevelOpen(false);
    } else if (filterType === 'purchase') {
      setIsPurchaseOpen(false);
    } else if (filterType === 'category') {
      setIsCategoryOpen(false);
    }
  };

  const handleReset = (filterType) => {
    if (filterType === 'price') {
      setPriceRange('');
    } else if (filterType === 'level') {
      setLevel([]);
    } else if (filterType === 'category') {
      setCategory([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-1/2 bg-gray-200 mb-40">
      <div className="flex space-x-4 mt-4">
        {/* Purchase Dropdown */}
        <div className="relative" ref={purchaseRef}>
          <button className="flex px-4 py-2 bg-white rounded" onClick={handlePurchaseClick} > 
            {purchaseOption.charAt(0).toUpperCase() + purchaseOption.slice(1)} <IoIosArrowDown className='ml-2 mt-1'/>
          </button>
          {isPurchaseOpen && (
            <div className="absolute mt-2 bg-white rounded shadow-lg p-4 w-48">
              <label className="block">
                <input type="radio" name="purchase" checked={purchaseOption === 'free'} onChange={() => handlePurchaseChange('free')} />
                <span className="ml-2">Free</span>
              </label>
              <label className="block">
                <input type="radio" name="purchase" checked={purchaseOption === 'all'} onChange={() => handlePurchaseChange('all')} />
                <span className="ml-2">All</span>
              </label>
              <label className="block">
                <input type="radio" name="purchase" checked={purchaseOption === 'purchase'} onChange={() => handlePurchaseChange('purchase')} />
                <span className="ml-2">Purchase</span>
              </label>
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleApply('purchase')}>Apply</button>
              </div>
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        {showPriceFilter && (
          <div className="relative" ref={priceRef}>
            <button className="flex px-4 py-2 bg-white rounded" onClick={handlePriceClick}>
              Price <IoIosArrowDown className='ml-2 mt-1'/>
            </button>
            {isPriceOpen && (
              <div className="absolute mt-2 bg-white rounded shadow-lg p-4 w-48">
                {priceOptions.map((option) => (
                  <label className="block" key={option}>
                    <input type="radio" name="price" checked={priceRange === option} onChange={() => handlePriceChange(option)} />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
                <div className="flex justify-between mt-4">
                  <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleApply('price')}>Apply</button>
                  <button className="text-gray-500" onClick={() => handleReset('price')}>Reset</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Levels Dropdown */}
        <div className="relative" ref={levelRef}>
          <button className="flex px-4 py-2 bg-white rounded" onClick={handleLevelClick}>
            Levels <IoIosArrowDown className='ml-2 mt-1'/>
          </button>
          {isLevelOpen && (
            <div className="absolute mt-2 bg-white rounded shadow-lg p-4 w-48">
              {levelOptions.map((option) => (
                <label className="block" key={option}>
                  <input type="checkbox" checked={level.includes(option)} onChange={() => handleToggleLevel(option)} />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleApply('level')}>Apply</button>
                <button className="text-gray-500" onClick={() => handleReset('level')}>Reset</button>
              </div>
            </div>
          )}
        </div>

        {/* Categorical Dropdown */}
        <div className="relative" ref={categoryRef}>
          <button className="flex px-4 py-2 bg-white rounded" onClick={handleCategoryClick}>
            Categorical <IoIosArrowDown className='ml-2 mt-1'/>
          </button>
          {isCategoryOpen && (
            <div className="absolute mt-2 bg-white rounded shadow-lg p-4 w-48">
              {categoryOptions.map((option) => (
                <label className="block" key={option}>
                  <input type="checkbox" checked={category.includes(option)} onChange={() => handleToggleCategory(option)} />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
              <div className="flex justify-between mt-4">
                <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleApply('category')}>Apply</button>
                <button className="text-gray-500" onClick={() => handleReset('category')}>Reset</button>
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-100">Filter</button>
        </div>
      </div>
    </div>
  );
};

export default SearchnFilter;
