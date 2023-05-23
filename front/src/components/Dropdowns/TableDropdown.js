import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approveUser, authorizeUser } from "../../redux/actions/usersActions"
import { createPopper } from "@popperjs/core";

const NotificationDropdown = ({userId, approved, authorized}) => {
  const dispatch = useDispatch();

  const handleApprove = async (e) => {
    e.preventDefault();
    await dispatch(approveUser(userId));
    closeDropdownPopover()
  };

  const handleAuthorize = async (e) => {
    e.preventDefault();
    await dispatch(authorizeUser(userId));
    closeDropdownPopover()
  };

  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#adminMenu"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a href="#adminMenu" className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700" onClick={handleApprove}>
          {approved ?
            'Désactiver le compte' :
            'Activer le compte'
          }
        </a>
        <a href="#adminMenu" className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700" onClick={handleAuthorize}>
           {authorized ?
            'Refuser l\'accès' :
            'Autoriser l\'accès'
          }
        </a>
      </div>
    </>
  );
};

export default NotificationDropdown;
