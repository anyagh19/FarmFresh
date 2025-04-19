import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { PiUserCircleLight } from "react-icons/pi";
import Input from '../ui/Input';
import { IoMdMenu } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import farmerService from '../../Appwrite/Farmer';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/AuthSlice';
import { ImCancelCircle } from "react-icons/im";
import productService from '../../Appwrite/Product';
import LeafletLocationMap from '../ui/LeafletLocationMap';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState({});
  const [villages, setVillages] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const logoref = useRef();
  const logoref1 = useRef();

  const menuref = useRef();
  const menuref1 = useRef();

  const [searchedProducts, setSearchedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSearchDropdown, setOpenSearchDropdown] = useState(false);

  const [showMap, setShowMap] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState('');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuref.current &&
        !menuref.current.contains(e.target) &&
        !logoref.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside1 = (e) => {
      if (
        menuref1.current &&
        !menuref1.current.contains(e.target) &&
        !logoref1.current.contains(e.target)
      ) {
        setOpen1(false);
      }
    };
    window.addEventListener('click', handleClickOutside1);
    return () => window.removeEventListener('click', handleClickOutside1);
  }, []);

  // Check login on mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await farmerService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setRole(user.prefs.role);
        };
        const farmer = await farmerService.getFarmerById(user.$id);
        setAddress(JSON.parse(farmer.address));
      } catch (error) {
        console.error('Not logged in');
      }
    };
    checkLogin();
  }, []);

  const menus = [
    { name: 'Profile', link: '/profile', active: isLoggedIn, },
    { name: 'Orders', link: '/orders', active: isLoggedIn, },
    { name: 'Cart', link: '/cart', active: isLoggedIn, },
    { name: 'Add Product', link: '/add-product', active: isLoggedIn && role === 'Farmer', },
    { name: "My Products", link: '/my-products', active: isLoggedIn && role === 'Farmer' },
    { name: "Weather", link: '/weather', active: isLoggedIn && role === 'Farmer' },
    { name: "Market", link: 'https://agmarknet.gov.in/', active: isLoggedIn && role === 'Farmer', external: true },
    { name: 'Logout', link: '/', active: isLoggedIn, logout: true },
    { name: 'Login', link: '/login', active: !isLoggedIn, },
  ];

  const handleLogout = async () => {
    try {
      await farmerService.logout();
      setIsLoggedIn(false);
      setOpen(false);
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        productService.searchProduct(searchQuery.trim()).then((res) => {
          setSearchedProducts(res);
          setOpenSearchDropdown(true); // You can toggle a dropdown of results
        });
      } else {
        setSearchedProducts([]);
        setOpenSearchDropdown(false);
      }
    }, 400); // debounce input for better UX

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <header className="bg-gradient-to-b from-green-500 via-green-300 to-green-300 px-4 py-3 relative">
      <div className="flex flex-wrap flex-col items-start justify-between gap-2 md:flex-row md:gap-1">
        {/* Logo */}
        <Link to='/'>
          <div className='flex flex-col gap-3 md:flex-row md:gap-4 md:w-[20%]'>
            <h1 className="text-2xl text-center md:text-3xl font-bold bg-gradient-to-r from-violet-700 via-violet-500 to-violet-400 bg-clip-text text-transparent">FarmFresh</h1>
          </div>
        </Link>

        {/* Location */}
        <div
          className="flex items-center gap-1 cursor-pointer text-sm md:text-base"
          onClick={() => setOpen2(!open2)}
        >
          <PiUserCircleLight className="text-xl md:text-2xl" />
          <span className="font-medium">
            {address.village
              ? `${address.village}, ${address.state} - ${address.pincode}`
              : 'Select Location'}
          </span>
          <IoIosArrowDown className="text-lg md:text-xl" />
        </div>

        {open2 && (
          <div className='bg-gray-200 h-fit p-5 w-[90%] md:w-[40%] absolute top-[120%] left-1/2 transform -translate-x-1/2 rounded-lg shadow-md z-50'>
            <div className='flex justify-between items-center border-b pb-2 mb-4 relative'>
              <h1 className=' text-center text-xl font-semibold'>Your Location</h1>
              <ImCancelCircle onClick={() => setOpen2(false)} className='text-xl cursor-pointer absolute ml-[90%]' />
            </div>

            {/* Address Form */}
            <div className='flex flex-col gap-3'>
              <input
                type='text'
                placeholder='Enter Pincode'
                className='px-3 py-2 border rounded'
                onChange={async (e) => {
                  const pin = e.target.value;
                  setAddress((prev) => ({ ...prev, pincode: pin }));

                  if (pin.length === 6) {
                    try {
                      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                      const data = await res.json();
                      const postOffices = data[0]?.PostOffice || [];

                      if (postOffices.length > 0) {
                        const { State, District, Block } = postOffices[0];

                        const villageList = postOffices.map(po => po.Name);
                        setVillages(villageList);

                        setAddress((prev) => ({
                          ...prev,
                          state: State,
                          district: District,
                          taluka: Block
                        }));
                      } else {
                        setVillages([]);
                      }
                    } catch (err) {
                      console.error("Failed to fetch location:", err);
                    }
                  } else {
                    setVillages([]);
                  }
                }}
              />

              {/* Show fetched details */}
              {address.state && (
                <div className='text-sm bg-white p-2 rounded'>
                  <p><strong>State:</strong> {address.state}</p>
                  <p><strong>District:</strong> {address.district}</p>
                  <p><strong>Taluka:</strong> {address.taluka}</p>
                </div>
              )}

              {/* Village Dropdown */}
              {villages.length > 0 && (
                <select
                  className='px-3 py-2 border rounded'
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, village: e.target.value }))
                  }
                >
                  <option value="">Select Village</option>
                  {villages.map((village, idx) => (
                    <option key={idx} value={village}>{village}</option>
                  ))}
                </select>
              )}

              {/* Local Address */}
              <textarea
                placeholder='Enter Local Address'
                className='px-3 py-2 border rounded resize-none'
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, localAddress: e.target.value }))
                }
              />

              {/* Submit */}
              <button
                onClick={() => {
                  console.log("Final Address:", address);
                  setOpen2(false);
                }}
                className='bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-all mt-2'
              >
                Save Address
              </button>
              <button
                onClick={() => setShowMap(true)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all"
              >
                Use Current Location
              </button>
              {showMap && (
                <div className="mt-4">
                  <LeafletLocationMap
                    onLocationSelect={(latLng) => {
                      setAddress((prev) => ({
                        ...prev,
                        lat: latLng[0],
                        lng: latLng[1]
                      }));
                    }}
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* Search */}
        <div className='flex w-full gap-1 md:w-[40%] md:gap-5 relative'>
          <div className="flex items-center flex-grow bg-white border border-gray-300 rounded-lg shadow-sm px-3 py-2">
            <FaSearch className="text-gray-500 mr-2" />
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full outline-none text-sm placeholder-gray-400"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {openSearchDropdown && searchedProducts.length > 0 && (
              <div className="absolute bg-white shadow-md z-10 max-h-60 overflow-y-auto w-full rounded-b-md">
                {searchedProducts.map((product) => (
                  <Link
                    to={`/product/${product.$id}`}
                    key={product.$id}
                    className="block p-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setSearchQuery("");
                      setOpenSearchDropdown(false);
                    }}
                  >
                    {product.name} - <span className="text-gray-500">{product.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Menu icon for mobile */}
          <div ref={logoref1} onClick={() => setOpen1(!open1)} className="block md:hidden ">
            <IoMdMenu className='text-2xl' />
          </div>
          {open1 && (
            <div
              ref={menuref1}
              className="absolute top-12 right-0 py-3 px-6 bg-white shadow-lg rounded-lg w-40 z-50"
            >
              <ul>
                {isLoggedIn ? (
                  <>
                    {menus.map((menu, index) => (
                      menu.active && (
                        <li key={index} onClick={() => setOpen(false)} className="mt-2">
                          {menu.logout ? (
                            <button
                              className="bg-red-400 py-2 px-4 rounded-full w-full"
                              onClick={handleLogout}
                            >
                              Logout
                            </button>
                          ) : menu.external ? (
                            <a href={menu.link} target="_blank" rel="noopener noreferrer">
                              <span>{menu.name}</span>
                            </a>
                          ) : (
                            <Link to={menu.link}>
                              <span>{menu.name}</span>
                            </Link>
                          )}
                        </li>
                      )
                    ))}
                  </>
                ) : (
                  <li>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <button className="bg-purple-500 text-white py-2 px-4 rounded-full w-full">
                        Login
                      </button>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile & Cart */}
        <div className="items-center gap-6 text-sm text-black hidden md:flex">
          {/* Profile */}
          <div className="relative">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setOpen(!open)}
              ref={logoref}
            >
              <PiUserCircleLight className="text-2xl" />
              <span>Profile</span>
            </div>

            {open && (
              <div
                ref={menuref}
                className="absolute top-12 right-0 py-3 px-6 bg-white shadow-lg rounded-lg w-40 z-50"
              >
                <ul className='cursor-pointer'>
                  {isLoggedIn ? (
                    <>
                      {menus.map((menu, index) => (
                        menu.active && (
                          <li key={index} onClick={() => setOpen(false)} className="mt-2">
                            {menu.logout ? (
                              <button
                                className="bg-red-400 py-2 px-4 rounded-full w-full"
                                onClick={handleLogout}
                              >
                                Logout
                              </button>
                            ) : (
                              <Link to={menu.link}>
                                <span>{menu.name}</span>
                              </Link>
                            )}
                          </li>
                        )
                      ))}
                    </>
                  ) : (
                    <li>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <button className="bg-purple-500 text-white py-2 px-4 rounded-full w-full">
                          Login
                        </button>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to='/cart'>
            <div className="flex flex-col items-center cursor-pointer">
              <FiShoppingCart className="text-2xl" />
              <span>Cart</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
