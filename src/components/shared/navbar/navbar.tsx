"use client";
import Logo from '../logo/logo';
import Link from 'next/link';
import React, { useState, Suspense, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../sidebar/hamburger';
import styles from './navbar.module.scss';
import Loader from '@/components/shared/loader/loader';
import { usePathname, useRouter } from 'next/navigation';
import AuthService from '@/auth/auth.service';
import { permission } from '@/auth/access.service';
import UserService from '@/modules/rbac/services/user.service';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WorkIcon from '@mui/icons-material/Work';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Navbar: React.FC = () => {
  const [showHeader, setShowHeader] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showUser, setShowUser] = useState<boolean>(false);
  const [showGroup, setShowGroup] = useState<boolean>(false);
  const [showAMS, setShowAMS] = useState<boolean>(false);
  const [showRole, setShowRole] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [showAMSSubmenu, setShowAMSSubmenu] = useState(false);
  const [hoveringLink, setHoveringLink] = useState<string | null>(null);
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
    setShowProfile(await permission("profile.*"));
    setShowAMS(await permission('ams.*'));
    setShowUser(await permission("user.*"));
    setShowRole(await permission("role.*"));
    setShowAnalytics(await permission("analytics.*"))
    setShowGroup(await permission("group.*"));
    getUserName();
  };

  const pathname = usePathname();
  const router = useRouter();

  const getUserName = async () => {
    try {
      const user = await userService.getLoggedInUserDetial();
      setUserName(user);
    } catch (error) {
      console.error(error);
    }
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfile = () => {
    router.push("/admin/profile");
  }

  const getLinkContent = (link: string) => {
    switch (link) {
      case 'analytics':
        return { title: 'Analytics Dashboard', description: '' };
      case 'user':
        return { title: 'User Management', description: '' };
      case 'role':
        return { title: 'Role Management', description: '' };
      case 'group':
        return { title: 'Group Management', description: '' };
      case 'ams':
        return { title: 'AMS Overview', description: 'Access the Asset Management System' };
      case 'employee':
        return { title: 'Employee Management', description: 'Manage employee information and records' };
      case 'leave':
        return { title: 'Leaves Management', description: 'Manage leaves information and records' };
      case 'attendance':
        return { title: 'Attendance Management', description: 'Manage attendance information and records' };
      default:
        return { title: '', description: '' };
    }
  };

  return (
    <>
      {showHeader && (
        <nav className={styles.navbar}>

          <div className={styles.container}>
            {showHeader && <li className={styles.logo}><Suspense fallback={<Loader />}><Logo /></Suspense></li>}
            <ul className={`${styles.menu} ${isSidebarOpen ? styles.hideMenu : ''}`}>
              {showHeader && <li className={styles.liLogo}><Suspense fallback={<Loader />}><Logo /></Suspense></li>}
              {showAnalytics && (
                <li
                  onMouseEnter={() => setHoveringLink('analytics')}
                  onMouseLeave={() => setHoveringLink(null)}
                >
                  <Link className={`${styles.links} ${pathname?.startsWith('/admin/analytics') ? styles.active : ''}`} href="/admin/analytics">
                    <BarChartIcon />
                    <span>Analytics</span>
                  </Link>
                </li>
              )}
              {showUser && (
                <li
                  onMouseEnter={() => setHoveringLink('user')}
                  onMouseLeave={() => setHoveringLink(null)}
                >
                  <Link className={`${styles.links} ${pathname?.startsWith('/admin/user') ? styles.active : ''}`} href="/admin/user">
                    <PeopleIcon />
                    <span>User</span>
                  </Link>
                </li>
              )}
              {showRole && (
                <li
                  onMouseEnter={() => setHoveringLink('role')}
                  onMouseLeave={() => setHoveringLink(null)}
                >
                  <Link className={`${styles.links} ${pathname?.startsWith('/admin/role') ? styles.active : ''}`} href="/admin/role">
                    <PersonAddIcon />
                    <span>Role</span>
                  </Link>
                </li>
              )}
              {showGroup && (
                <li
                  onMouseEnter={() => setHoveringLink('group')}
                  onMouseLeave={() => setHoveringLink(null)}
                >
                  <Link className={`${styles.links} ${pathname?.startsWith('/admin/group') ? styles.active : ''}`} href="/admin/group">
                    <PeopleIcon />
                    <span>Group</span>
                  </Link>
                </li>
              )}
              {showAMS && (
                <li
                  onMouseEnter={() => { setShowAMSSubmenu(true); setHoveringLink('ams'); }}
                  onMouseLeave={() => { setShowAMSSubmenu(false); setHoveringLink(null); }}
                >
                  <div className={styles.amsContainer}>
                    <Link
                      className={`${styles.links} ${pathname?.startsWith('/admin/ams') ? styles.active : ''}`}
                      href="/admin/ams"
                    >
                      <WorkIcon />
                      <span>AMS</span>
                    </Link>
                    {showAMSSubmenu && (
                      <div className={styles.amsSubmenu}>
                        <div className={styles.amsCompleteContainer}>
                          <div>
                            <Link
                              className={`${styles.links} ${pathname?.startsWith('/admin/ams/employee') ? styles.active : ''}`}
                              href="/admin/ams/employee"
                              onMouseEnter={() => setHoveringLink('employee')}
                            >
                              <span>Employee</span>
                              <span
                                className={styles.addIcon}
                                onClick={() => router.push('/admin/ams/employee/new')}
                              >
                                <AddCircleIcon onClick={() => router.push('/admin/ams/employee/new')} />
                              </span>
                            </Link>

                            <Link
                              className={`${styles.links} ${pathname?.startsWith('/admin/ams/attendance') ? styles.active : ''}`}
                              href="/admin/ams/attendance"
                              onMouseEnter={() => setHoveringLink('attendance')}
                            >
                              <span>Attendance</span>
                              <span
                                className={styles.addIcon}
                                onClick={() => router.push('/admin/ams/attendance/new')}
                              >
                                <AddCircleIcon />
                              </span>
                            </Link>

                            <Link
                              className={`${styles.links} ${pathname?.startsWith('/admin/ams/leave') ? styles.active : ''}`}
                              href="/admin/ams/leave"
                              onMouseEnter={() => setHoveringLink('leave')}
                            >
                              <span>Leave</span>
                              <span
                                className={styles.addIcon}
                                onClick={() => router.push('/admin/ams/leave/new')}
                              >
                                <AddCircleIcon />
                              </span>
                            </Link>
                          </div>
                          <div className={styles.leftContainer}>
                            {hoveringLink && (
                              <div className={styles.hoverContent}>
                                <h3>{getLinkContent(hoveringLink).title}</h3>
                                <p>{getLinkContent(hoveringLink).description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                    )}
                  </div>
                </li>
              )}

            </ul>

            <div className={styles.user}>
              <span
                className={styles.account_circle}
                onClick={handleProfile}
                aria-controls="account-menu"
                aria-haspopup="true"
              >
                <AccountCircleIcon />
                <span>{userName}</span>
              </span>
              <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <span className={styles.hamburgerIcon} onClick={toggleSidebar}><MenuIcon /></span>
            </div>

          </div>

        </nav>
      )}
    </>
  );
}

export default Navbar;
