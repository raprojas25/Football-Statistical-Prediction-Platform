import { useState } from 'react';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { Link } from 'react-router';
import {
  ChevronDown,
  CircleUserRound,
  Info,
  LogOut,
  Settings,
} from 'lucide-react';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle flex items-center text-white"
      >
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        <span className="mr-1 block text-sm font-medium">Musharof</span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Musharof Chowdhury
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-500">
            randomuser@pimjo.com
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-1 border-y border-gray-200 pt-4 pb-3 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <CircleUserRound size={24} className="stroke-1" />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Settings size={24} className="stroke-1" />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <Info size={24} className="stroke-1" />
              Support
            </DropdownItem>
          </li>
        </ul>
        <Link
          to="/signin"
          className="group mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <LogOut size={20} className="stroke-1" />
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
