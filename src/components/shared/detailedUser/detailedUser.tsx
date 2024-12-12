import React, { Suspense, useState, useEffect } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tab, Tabs, Switch, Button, Alert, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserDetailData } from '@/types/schema/user';
import InfoIcon from '@mui/icons-material/Info';
import { Logout } from '@mui/icons-material';
import Loader from '@/components/shared/loader/loader';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
const GoBack = React.lazy(() => import('@/components/shared/goBack/goBack'));
import styles from './detailedUser.module.scss';
import ProfilePassword from '../profilePassword/profilePassword';
import UserService from '@/service/user.service';
import { permission } from '@/auth/access.service';
import AuthService from '@/auth/auth.service';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'

const DetailedUserData: React.FC<{
    userId: string,
    data: UserDetailData,
    onSwitchChange: (id: string, isActive: boolean, tab: string, childId: string) => void,
    onInfoClick: (tab: string, id: string) => void,
    onDelete: (id: string, tab: string) => void,
    onRowSelect: (id: string) => void,
    editPermissions?: string,
    deletePermissions?: string,
    onEditClick: () => void;
    onDeleteClick: () => void;
    defaultCompanyId?: string, // Added prop for default company ID
}> = ({ userId, data, onSwitchChange, onDelete, onDeleteClick, onEditClick, onInfoClick, onRowSelect, editPermissions, deletePermissions, defaultCompanyId }) => {
    const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<'roles' | 'groups' | 'companies'>('roles');
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
    const userService: UserService = new UserService();
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [editPermission, setEditPermission] = useState<boolean>(false);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [showLogoutOfAllDevices, setShowLogoutOfAllDevices] = useState<boolean>(false);
    const auth: AuthService = new AuthService();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        try {
            setCanEdit(await permission("featurePermission.update.*"));
            setShowLogoutOfAllDevices(await permission("user.logout.*"));
            setEditPermission(await permission(editPermissions || ''));
            setDeletePermission(await permission(deletePermissions || ''));
        } catch (error) {
            console.error("Error checking permissions: ", error);
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutOfAllDevices = async () => {
        try {
            await auth.logoutUserOfAllDevices(userId);
            setFeedbackMessage('Logged Out Of All Devices successfully');
            setFeedbackType('success');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    const handleLogoutOfAllDevices = () => {
        logoutOfAllDevices();
    }


    const handleSwitchChange = (id: string, isActive: boolean, tab: string, childId: string) => {
        onSwitchChange(id, isActive, tab, childId);
    };

    const handleDelete = (id: string, tab: string) => {
        onDelete(id, tab);
    };

    const handlePasswordChange = () => {
        setShowChangePassword(!showChangePassword);
    };

    const handleInfoClick = (id: string, tab: string) => {
        onInfoClick(tab, id);
    };

    const updateUser = async (password: string) => {
        try {
            await userService.changeUserPassword(userId, password);
            setFeedbackMessage('Password changed successfully');
            setFeedbackType('success');
            setShowChangePassword(!showChangePassword);
        } catch (error) {
            setFeedbackMessage('Error changing password');
            setFeedbackType('error');
            console.error("Error changing password: ", error);
            setShowChangePassword(!showChangePassword);
        }
    };

    const handleTickClick = (id: string) => {
        onRowSelect(id);
    };

    return (
        <Box className={styles.userDetailsContainer}>
            <div className={styles.icons}>
                <Suspense fallback={<Loader />}>
                    <GoBack />
                </Suspense>
                {(editPermission || deletePermission) && <div>
                    <IconButton onClick={handleClick} className={styles.icon} color='primary'>
                        <MoreVertIcon />
                    </IconButton>
                
                </div>}
            </div>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {editPermission && (
                    <MenuItem onClick={() => { handleClose(); onEditClick(); }}>
                        <EditIcon onClick={onEditClick} className={styles.icon} color='secondary' />
                        Edit
                    </MenuItem>
                )}
                {deletePermission && (
                    <MenuItem onClick={() => { handleClose(); onDeleteClick(); }}>
                        <DeleteIcon onClick={onDeleteClick} className={styles.icon} color='error' />
                        Delete
                    </MenuItem>
                )}
            </Menu>
            <div className={styles.main}>
                <Typography variant="h4" className={styles.title}>{data.username}</Typography>
                <div className={styles.changePassword}>
                    <Button variant="contained" onClick={handlePasswordChange}>Change Password</Button>
                    <Button color="error" variant="contained" onClick={handleLogoutOfAllDevices}><Logout fontSize='small' />Logout of All devices</Button>

                </div>

            </div>
            {feedbackMessage && feedbackType && (
                <div className={styles.alert}>
                    <Alert severity={feedbackType} onClose={() => setFeedbackMessage(null)}>
                        {feedbackMessage}
                    </Alert>
                </div>
            )}
            <div>{showChangePassword && (
                <div className={styles.passwordContainer}>
                    <ProfilePassword showConfirmPassword={false} onSubmit={updateUser} onDiscard={handlePasswordChange} />
                </div>
            )}</div>
            <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
                <Tab label="Roles" value="roles" />
                <Tab label="Groups" value="groups" />
                {/* <Tab label="Companies" value="companies" /> */}
            </Tabs>
            {selectedTab === 'roles' && (
                <Box marginTop={2}>
                    {data.userRole.length === 0 ? (
                        <Typography>No role assigned</Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.headerCell}>Role</TableCell>

                                        {canEdit && (
                                            <>
                                                <TableCell className={styles.headerCell}>is Active</TableCell>
                                                <TableCell className={styles.headerCell}>Actions</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.userRole.map((role, index) => (
                                        <TableRow key={index} className={styles.tableRow}>
                                            <TableCell>{role.role.name}</TableCell>
                                            {canEdit && (
                                                <>
                                                    <TableCell>
                                                        <Switch
                                                            checked={role.active}
                                                            color="primary"
                                                            onChange={(event) => handleSwitchChange(role.id || '', event.target.checked, selectedTab, role.role.id || '')}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            color="secondary"
                                                            aria-label="info"
                                                            onClick={() => handleInfoClick('roles', role.role.id || '')}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(role.id || '', selectedTab)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}
            {selectedTab === 'groups' && (
                <Box marginTop={2}>
                    {data.userGroup.length === 0 ? (
                        <Typography>No group assigned</Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.headerCell}>Group</TableCell>
                                        {canEdit && (
                                            <>
                                                <TableCell className={styles.headerCell}>is Active</TableCell>
                                                <TableCell className={styles.headerCell}>Actions</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.userGroup.map((group, index) => (
                                        <TableRow key={index} className={styles.tableRow}>
                                            <TableCell>{group.group.name}</TableCell>
                                            {canEdit && (
                                                <>
                                                    <TableCell>
                                                        <Switch
                                                            checked={group.active}
                                                            color="primary"
                                                            onChange={(event) => handleSwitchChange(group.id || '', event.target.checked, selectedTab, group.group.id || '')}
                                                        />
                                                    </TableCell>
                                                    <TableCell>

                                                        <IconButton
                                                            color="secondary"
                                                            aria-label="info"
                                                            onClick={() => handleInfoClick('groups', group?.group.id || '')}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(group.id || '', selectedTab)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}
            {/* {selectedTab === 'companies' && (
                <Box marginTop={2}>
                    {data.companyUser.length === 0 ? (
                        <Typography>No company assigned</Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.headerCell}>Company</TableCell>

                                        {canEdit && (
                                            <> <TableCell className={styles.headerCell}>is Default</TableCell>
                                                <TableCell className={styles.headerCell}>is Active</TableCell>
                                                <TableCell className={styles.headerCell}>Actions</TableCell>
                                            </>
                                        )}


                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.companyUser.map((company, index) => (
                                        <TableRow key={index} className={styles.tableRow}>
                                            <TableCell>
                                                {company.company.name}
                                            </TableCell>

                                            {canEdit && (
                                                <>
                                                    <TableCell>
                                                        {company.company.id === defaultCompanyId && (
                                                            <>
                                                                <Chip label="Default" color="primary" className={styles.defaultChip} /></>
                                                        )}
                                                        {!(company.company.id === defaultCompanyId) && <IconButton
                                                            color="primary"
                                                            size='small'
                                                            onClick={() => handleTickClick(company.company.id || '')}
                                                            className={styles.tickButton}
                                                        >
                                                            <CheckIcon />
                                                        </IconButton>}
                                                    </TableCell>
                                                    <TableCell>
                                                        {!(company.company.id === defaultCompanyId) && <Switch
                                                            checked={company.active}
                                                            color="primary"
                                                            onChange={(event) => handleSwitchChange(company.id || '', event.target.checked, selectedTab, company.company.id || '')}
                                                        />}{(company.company.id === defaultCompanyId) &&
                                                            <Switch
                                                                checked={company.active}
                                                                color="primary"
                                                                contentEditable={false
                                                                } />}

                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            color="secondary"
                                                            aria-label="info"
                                                            onClick={() => handleInfoClick('companies', company?.company.id || '')}
                                                        >
                                                            <InfoIcon />
                                                        </IconButton>
                                                        {!(company.company.id === defaultCompanyId) && <><IconButton
                                                            color="error"
                                                            onClick={() => handleDelete(company.id || '', selectedTab)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton></>}

                                                    </TableCell>

                                                </>
                                            )}

                                        </TableRow>

                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )} */}
        </Box>
    );
};

export default DetailedUserData;
