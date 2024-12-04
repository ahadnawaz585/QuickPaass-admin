"use client";
import Logo from '../logo/logo';
import Link from 'next/link';
import React, { useState, Suspense, useEffect } from 'react';
// import CompanyDialogue from '../shared/companyDialogue/companyDialogue';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../sidebar/hamburger';
import styles from './navbar.module.scss';
import Loader from '../loader/Loader';
import { People, Groups, Person, Business, HighlightOff } from '@mui/icons-material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { usePathname, useRouter } from 'next/navigation';
import AuthService from '@/auth/auth.service';
import { permission } from '@/auth/access.service';
import { Settings } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
// import CompanyService from '@/frontend/services/company.service';
const DialogueComponent = React.lazy(() => import('@/components/shared/dialogue/dialogue'));
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UserService from '@/service/user.service';

const Navbar: React.FC = () => {
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const [showCa, setShowCa] = useState<boolean>(false);
  const [showUser, setShowUser] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [showRole, setShowRole] = useState<boolean>(false);
  const [showCompany, setShowCompany] = useState<boolean>(false);
  const [showVoucher, setShowVoucher] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);
  const [showLedger, setShowLedger] = useState<boolean>(false);
  const [openCompanyDialogue, setOpenCompanyDialogue] = useState(false);
  const [openChangeCompanyDialogue, setOpenChangeCompanyDialogue] = useState(false);
//   const companyService: CompanyService = new CompanyService();
  const [showSubMenu, setShowSubMenu] = useState<boolean>(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null); // State for settings menu
  const [ShowChangeCompany, setShowChangeCompany] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const auth: AuthService = new AuthService();
  const userService: UserService = new UserService();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      setShowHeader(true);
      checkPermissions();
    } else {
      setShowHeader(false);
    }
  }, []);


  const checkPermissions = async () => {
    setShowCa(await permission("ca.*"));
    setShowProfile(await permission("profile.*"));
    setShowVoucher(await permission("voucher.*"));
    setShowContact(await permission("contact.*"));
    setShowLedger(await permission("ledger.*"));
    setShowSetting(await permission("setting.*"));
    setShowUser(await permission("user.*"));
    setShowRole(await permission("role.*"));
    setShowGroup(await permission("group.*"));
    setShowCompany(await permission("company.*"));
    setShowChangeCompany(await permission("profile.changeCompany.*"));
    getUserName();
  };

  const pathname = usePathname();
  const router = useRouter();

  const [openDialogue, setOpenDialogue] = useState(false);

  const getUserName = async () => {
    try {
      const user = await userService.getLoggedInUserDetial();
      setUserName(user);
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpenDialogue = () => {
    setOpenDialogue(true);
  };

  const toggleDialogue = () => {
    setOpenDialogue(!openDialogue);
  }

//   const handleSelectCompany = async (companyId: string) => {
//     try {
//       await companyService.changeUserCompany(companyId);
//       setOpenChangeCompanyDialogue(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

  const handleCloseChangeCompany = (response: boolean) => {
    if (response) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  }

  const handleCloseDialogue = (response: boolean) => {
    setOpenDialogue(false);
    if (response) {
      logout();
    } else {
      setOpenDialogue(false);
    }
  };

  const logout = async () => {
    console.log("logging out..");
    try {
      await auth.logout();
      console.log("Logout successful");
      window.location.assign("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdminClick = () => {
    setShowSubMenu(!showSubMenu);
  }

  const handleProfile = () => {
    router.push("/profile");
  }

  const handleSettingsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsAnchorEl(null);
  };

  return (
    <>
      {showHeader && (
        <nav className={styles.navbar}>
          <div className={styles.container}>
            {/* <div> */}
            {/* <Suspense fallback={<Loader />}><Logo /></Suspense> */}

            {/* </div> */}
            {showHeader && <li className={styles.logo}><Suspense fallback={<Loader />}><Logo /></Suspense></li>}
            {/* <Suspense fallback={<Loader />}><Logo /></Suspense> */}
            <ul className={`${styles.menu} ${isSidebarOpen ? styles.hideMenu : ''}`}>
              {showHeader && <li className={styles.liLogo}><Suspense fallback={<Loader />}><Logo /></Suspense></li>}
              <li><Link className={`${styles.links} ${pathname?.startsWith('/analytics') ? styles.active : ''}`} href="/analytics">Analytics</Link></li>
              <li>
                {showCa && (
                  <Link className={`${styles.links} ${pathname?.startsWith('/user') ? styles.active : ''}`} href="/user">
                    User
                  </Link>
                )}
              </li>
              <li>
                {showVoucher && (
                  <Link className={`${styles.links} ${pathname?.startsWith('/role') ? styles.active : ''}`} href="/role">
                    Role
                  </Link>
                )}
              </li>
              <li>
                {showContact && (
                  <Link className={`${styles.links} ${pathname?.startsWith('/group') ? styles.active : ''}`} href="/group">
                    Group
                  </Link>
                )}
              </li>
            </ul>
            {/* Navbar Menu */}

            {/* User Icons */}
            <div className={styles.user}>

              <span
                className={styles.account_circle}
                onClick={handleProfile}
                aria-controls="account-menu"
                aria-haspopup="true"
              >
                <AccountCircleIcon />
                <span >{userName}</span>
              </span>
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              {/* <Suspense fallback={<Loader />}> 
                {openDialogue && <DialogueComponent
                  heading="Confirmation"
                  question="Are you sure you want to proceed?"
                  onClose={handleCloseDialogue}
                />}
              </Suspense>
              <Suspense fallback={<Loader />}> 
                {openChangeCompanyDialogue && <DialogueComponent
                  heading="Alert !!"
                  question="Logging into a new company account. If you have signed in from another tab or window, please reload them to refresh your session."
                  onClose={handleCloseChangeCompany}
                  showYesOrNo={false}
                />}
              </Suspense>
              {openCompanyDialogue && (
                <Suspense fallback={<div>Loading...</div>}>
                  <CompanyDialogue
                    open={openCompanyDialogue}
                    onSelectCompany={handleSelectCompany}
                    onClose={() => setOpenCompanyDialogue(false)}
                  />
                </Suspense>
              )}
              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAccountMenuClose}
              >
                {[
                  showUser && <MenuItem key="profile" onClick={() => { handleAccountMenuClose(); handleProfile(); }}><PersonIcon fontSize='small' />Profile</MenuItem>,
                  (showSetting || showGroup || showCompany || showRole || showUser) && (
                    <div key="admin">
                      <MenuItem onClick={handleAdminClick}>
                        {showSubMenu ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                        Admin
                      </MenuItem>
                      {showSubMenu && [
                        <Divider key="divider1" />,
                        showSetting && <MenuItem key="setting" onClick={() => { handleAccountMenuClose(); router.push("/setting"); }}><Settings fontSize='small' />Setting</MenuItem>,
                        showUser && <MenuItem key="user" onClick={() => { handleAccountMenuClose(); router.push("/setting/user"); }}><Person fontSize='small' />Users</MenuItem>,
                        showRole && <MenuItem key="role" onClick={() => { handleAccountMenuClose(); router.push("/setting/role"); }}><People fontSize='small' />Roles</MenuItem>,
                        showGroup && <MenuItem key="group" onClick={() => { handleAccountMenuClose(); router.push("/setting/group"); }}><Groups />Groups</MenuItem>,
                        showCompany && <MenuItem key="company" onClick={() => { handleAccountMenuClose(); router.push("/setting/company"); }}><Business />Companies</MenuItem>,
                        <Divider key="divider2" />
                      ]}
                    </div>
                  ),
                  ShowChangeCompany && <MenuItem key="changeCompany" onClick={() => { setOpenCompanyDialogue(true); handleAccountMenuClose(); }}><ChangeCircleIcon fontSize='small' />Change Company</MenuItem>,
                  <MenuItem key="logout" onClick={() => { toggleDialogue(); handleAccountMenuClose(); }}><LogoutIcon fontSize='small' />Logout</MenuItem>
                ]}
              </Menu> */}


              <span className={styles.hamburgerIcon} onClick={toggleSidebar}><MenuIcon /></span>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
