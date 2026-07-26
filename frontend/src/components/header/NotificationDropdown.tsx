import { useState } from 'react';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Link } from 'react-router';
import { Bell, X } from 'lucide-react';
import { IconMenu } from '../ui/IconMenu';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };
  return (
    <div className="relative">
      <IconMenu onClick={handleClick}>
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-betano-green ${
            !notifying ? 'hidden' : 'flex'
          }`}
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-betano-green opacity-75"></span>
        </span>
        <Bell size={20} />
      </IconMenu>
      {/* <button */}
      {/*   className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white" */}
      {/*   onClick={handleClick} */}
      {/* > */}
      {/*   <span */}
      {/*     className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${ */}
      {/*       !notifying ? "hidden" : "flex" */}
      {/*     }`} */}
      {/*   > */}
      {/*     <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span> */}
      {/*   </span> */}
      {/*   <Bell size={20} className="text-gray-900 dark:text-gray-400"/> */}
      {/**/}
      {/* </button> */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -left-12 mt-[17px] flex h-auto max-h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[361px] md:right-0 lg:right-0"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notification
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        <ul className="custom-scrollbar flex h-auto flex-col overflow-y-auto">
          {/* Example notification items */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="px-4.5 flex gap-3 rounded-lg border-b border-gray-100 p-3 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="z-1 relative block h-10 w-full max-w-10 rounded-full">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-02.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="bg-success-500 absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Project</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>5 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="px-4.5 flex gap-3 rounded-lg border-b border-gray-100 p-3 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="z-1 relative block h-10 w-full max-w-10 rounded-full">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-03.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="bg-success-500 absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span>requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Project</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>8 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="px-4.5 flex gap-3 rounded-lg border-b border-gray-100 p-3 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="z-1 relative block h-10 w-full max-w-10 rounded-full">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-04.jpg"
                  alt="User"
                  className="w-full overflow-hidden rounded-full"
                />
                <span className="bg-success-500 absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span> requests permission to change</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>Project</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>15 min ago</span>
                </span>
              </span>
            </DropdownItem>
          </li>
          {/* Add more items as needed */}
        </ul>
        <Link
          to="/"
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
