import React, { Suspense, useState, useEffect } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tab, Tabs, Switch, Chip, Modal, Button, IconButton, colors } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import styles from './roleGroupTable.module.scss';
import Loader from '../loader/loader';
import { permission } from '@/auth/access.service';
import { detailedRole } from '@/types/schema/role';
import { RoleGroup } from '@/types/schema/group';
import { Menu, MenuItem } from '@mui/material';
const GoBack = React.lazy(() => import('@/components/shared/goBack/goBack'));

interface Props {
    role: detailedRole | RoleGroup;
    onSwitchChange: (id: string, isActive: boolean, tab: string, childId: string) => void;
    onDelete: (id: string, tab: string) => void;
    shortName?: string;
    onInfoClick: (tab: string, id: string) => void;
    showDefault?: boolean;
    logo?: string;
    showLogo?: boolean;
    editPermissions?: string;
    deletePermissions?: string;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onTickClick?: (userId: string) => void;
    onImageChange?: (newImage: string) => void;
}

const RoleDetailsTable: React.FC<Props> = ({ role, onSwitchChange, onDelete, shortName, editPermissions, deletePermissions, onDeleteClick, showLogo, onEditClick, onInfoClick, showDefault, onTickClick, logo, onImageChange }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [activeTabName, setActiveTabName] = useState("Users");
    const [modalOpen, setModalOpen] = useState(false);
    const [editPermission, setEditPermission] = useState<boolean>(false);
    const [deletePermission, setDeletePermission] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        setCanEdit(await permission("featurePermission.update.*"));
        setEditPermission(await permission(editPermissions || ''));
        setDeletePermission(await permission(deletePermissions || ''));
    };

    const isDetailedRole = (role: detailedRole | RoleGroup): role is detailedRole => {
        return (role as detailedRole).userRoles !== undefined;
    };

    const handleInfoClick = (id: string) => {
        onInfoClick(activeTabName, id);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (onImageChange && e.target?.result) {
                    onImageChange(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const roleName = role.name;
    const userRoles = isDetailedRole(role) ? role.userRoles : role.userGroups;
    const otherRoles = isDetailedRole(role) ? role.groupRoles : role.groupRoles;
    const companies = isDetailedRole(role) ? [] : role.companyGroups;
    const otherTabLabel = isDetailedRole(role) ? "Groups" : "Roles";

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
        const tabNames = ["Users", otherTabLabel, "Companies"];
        setActiveTabName(tabNames[newValue]);
    };

    const handleSwitchChange = (id: string, name: string, isActive: boolean, typeId: string) => {
        onSwitchChange(id, isActive, activeTabName, typeId);
    };

    const handleTickClick = (userId: string) => {
        if (onTickClick) {
            onTickClick(userId);
        }
    };

    return (
        <div className={styles.box}>
            <div className={styles.icons}>
                <Suspense fallback={<Loader />}>
                    <GoBack />
                </Suspense>
                {(editPermission || deletePermission) && <div>
                    <IconButton onClick={handleClick} className={styles.icon} color='primary'>
                        <MoreVertIcon />
                    </IconButton>
                </div>}
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
                            <EditIcon color='secondary' style={{ marginRight: 8 }} />
                            Edit
                        </MenuItem>
                    )}
                    {deletePermission && (
                        <MenuItem onClick={() => { handleClose(); onDeleteClick(); }}>
                            <DeleteIcon color='error' style={{ marginRight: 8 }} />
                            Delete
                        </MenuItem>
                    )}
                </Menu>
            </div>
            <div className={styles.main}>
                <h1 className={styles.textHeading}>
                    {role.name}
                    {shortName && <p className={styles.shortName}>({shortName})</p>}
                </h1>

                {showLogo &&
                    <>
                        {(logo === '' || !logo) && (
                            <div
                                className={styles.logoContainer}
                                onClick={handleModalOpen}
                            >
                                <BusinessIcon className={styles.logo} />
                            </div>
                        )
                        }
                        {(logo && logo !== '') && (
                            <div
                                className={styles.logoContainer}
                                onClick={handleModalOpen}
                            >
                                <img src={logo} alt="Company Logo" className={styles.logoImage} />
                                <div className={styles.overlay}></div>
                                <div className={styles.editIcon}>
                                    <>  <EditIcon /></> {/* Example with FontAwesome */}
                                </div>
                            </div>
                        )}</>}
            </div>

            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="role details tabs">
                <Tab label="Users" />
                <Tab label={otherTabLabel} />
                {/* {!isDetailedRole(role) && <Tab label="Companies" />} */}
            </Tabs>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                aria-labelledby="logo-modal-title"
                aria-describedby="logo-modal-description"
            >
                <Box className={styles.modalBox}>
                    <IconButton className={styles.closeButton} onClick={handleModalClose}>
                        <CloseIcon />
                    </IconButton>
                    {(logo === '' || !logo) && <BusinessIcon className={styles.logo} />}
                    {(logo && logo !== '') && <img src={logo} alt="Enlarged Logo" className={styles.modalImage} />}
                    {canEdit && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            component="label"
                        >
                            Edit Logo
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageUpload}
                            />
                        </Button>
                    )}
                </Box>
            </Modal>
            <TabPanel value={tabIndex} index={0}>
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.heading}>Name</TableCell>
                                {/* <TableCell className={styles.heading}>{showDefault && <>is Default</>}</TableCell> */}
                                <TableCell className={styles.heading}>{<>is Active</>}</TableCell>
                                {canEdit && <TableCell className={styles.heading}>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userRoles.length > 0 ? (
                                userRoles.map(userRole => (
                                    <TableRow key={userRole.id}>
                                        <TableCell>{userRole.user.username}</TableCell>
                                        {/* <TableCell>
                                            {showDefault && companyId && (
                                                userRole.user?.defaultCompanyId === companyId ? (
                                                    <Chip label="Default" color="primary" />
                                                ) : (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleTickClick(userRole.user?.id || '')}
                                                        className={styles.tickButton}
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                )
                                            )}
                                        </TableCell> */}
                                        <TableCell>
                                            {<Switch
                                                checked={userRole.active}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                onChange={(e) => handleSwitchChange(userRole.id || '', isDetailedRole(role) ? 'group' : 'role', e.target.checked, userRole.userId)}
                                            />}
                                            {/* { <Switch
                                                checked={userRole.active}
                                                color="primary"
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />} */}
                                        </TableCell>
                                        {canEdit && (
                                            <TableCell>

                                                <IconButton
                                                    color="secondary"
                                                    aria-label="info"
                                                    onClick={() => handleInfoClick(userRole.user?.id || '')}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                                {<IconButton
                                                    color="error"
                                                    aria-label="delete"
                                                    onClick={() => onDelete(userRole?.id || '', 'Users')}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                }

                                            </TableCell>

                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className={styles.noUsers}>
                                        No users with this role
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className={styles.heading}>{otherTabLabel === "Groups" ? "Name" : "Name"}</TableCell>
                                <TableCell className={styles.heading}>{<>is Active</>}</TableCell>
                                {canEdit && <TableCell className={styles.heading}>Action</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {otherRoles.length > 0 ? (
                                otherRoles.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{isDetailedRole(role) ? item.group.name : item.role.name}</TableCell>
                                        {canEdit && (
                                            <>
                                                <TableCell>
                                                    <Switch
                                                        checked={item.active}
                                                        color="primary"
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        onChange={(e) => handleSwitchChange(item.id || '', isDetailedRole(role) ? 'group' : 'role', e.target.checked, isDetailedRole(role) ? item.group.id || '' : item.role.id || '')}
                                                    />
                                                </TableCell>
                                                <TableCell>

                                                    <IconButton
                                                        color="primary"
                                                        aria-label="info"
                                                        onClick={() => handleInfoClick(isDetailedRole(role) ? item.group.id : item.role.id)}
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        aria-label="delete"
                                                        onClick={() => onDelete(item?.id || '', otherTabLabel === "Groups" ? 'Groups' : 'Roles')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className={styles.noUsers}>
                                        {otherTabLabel === "Groups" ? "No groups with this role" : "No roles with this group"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            {!isDetailedRole(role) && (
                <TabPanel value={tabIndex} index={2}>
                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={styles.heading}>Name</TableCell>
                                    {canEdit && <TableCell className={styles.heading}>Action</TableCell>}
                                </TableRow>
                            </TableHead>
                            {/* <TableBody>
                                {companies.length > 0 ? (
                                    companies.map((company: any) => (
                                        <TableRow key={company.id}>
                                            <TableCell>{company.company.name}</TableCell>
                                            {canEdit && (
                                                <TableCell>
                                                    <Switch
                                                        checked={company.active}
                                                        color="primary"
                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                        onChange={(e) => handleSwitchChange(company.id || '', 'company', e.target.checked, company.company.id || '')}
                                                    />
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="info"
                                                        onClick={() => handleInfoClick(company.company.id)}
                                                    >
                                                        <InfoIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        aria-label="delete"
                                                        onClick={() => onDelete(company?.id || '', 'Companies')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className={styles.noUsers}>
                                            No companies with this role
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody> */}
                        </Table>
                    </TableContainer>
                </TabPanel>
            )}
        </div>
    );
};


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box >
                    {children}
                </Box>
            )}
        </div>
    );
}

export default RoleDetailsTable;
