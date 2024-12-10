import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, Tab, Box, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Input } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import UserService from '@/service/user.service';
import GroupService from '@/service/group.service';
import RoleService from '@/service/role.service';
import { User } from '@/types/schema/user';
import { Role } from '@/types/schema/role';
import Image from "next/image";
import { Group } from '@/types/schema/group';
import styles from './groupRoleForm.module.scss';
import { groupRole } from '@/types/schema/groupRoleForm';
// import CompanyService from '@/frontend/services/company.service';
// import { Company } from '@/types/company';

interface GroupRoleFormProps {
    heading: string;
    showRole: boolean;
    showGroup: boolean;
    // showCompany: boolean;
    showShortName?: boolean;
    showSelectImage?: boolean;
    onSelect: (selectedData: groupRole) => void;
    onImageSelect?: (image: File) => void;
    onDiscard: () => void;
    initialValues?: { name: string, users: string[], roles: string[], groups: string[], shortName?: string };
}

const GroupRoleFormComponent: React.FC<GroupRoleFormProps> = ({ heading, showRole, showSelectImage = false, showShortName = false, showGroup,  onImageSelect, onSelect, onDiscard, initialValues = { name: '', users: [], roles: [], groups: [] } }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    // const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    // const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [shortName, setShortName] = useState<string>(initialValues.shortName ?? '');
    const [name, setName] = useState<string>(initialValues.name);
    const [users, setUsers] = useState<string[]>(initialValues.users);
    const [roles, setRoles] = useState<string[]>(initialValues.roles ?? []);
    const [groups, setGroups] = useState<string[]>(initialValues.groups ?? []);
    // const [companies, setCompanies] = useState<string[]>(initialValues.companies ?? []);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [image, setImage] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, roles, groups] = await Promise.all([
                    new UserService().getAlluser(),
                    new RoleService().getAllRoles(),
                    new GroupService().getAllGroups(),
                    // new CompanyService().getAllCompany(),
                ]);
                setAllUsers(users);
                setAllRoles(roles);
                setAllGroups(groups);
                // setAllCompanies(company);
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUserSelect = useCallback((user: string) => setSelectedUser(user), []);
    const handleRoleSelect = useCallback((role: string) => setSelectedRole(role), []);
    const handleGroupSelect = useCallback((group: string) => setSelectedGroup(group), []);
    // const handleCompanySelect = useCallback((company: string) => setSelectedCompany(company), []);
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result as string);  // Store the base64 string in the state
                if (onImageSelect) {
                    onImageSelect(file);  // Pass the file to the parent component if needed
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleAddUser = useCallback(() => {
        if (selectedUser && !users.includes(selectedUser)) {
            setUsers([...users, selectedUser]);
            setSelectedUser('');
        }
    }, [selectedUser, users]);

    const handleAddRole = useCallback(() => {
        if (selectedRole && !roles.includes(selectedRole)) {
            setRoles([...roles, selectedRole]);
            setSelectedRole('');
        }
    }, [selectedRole, roles]);

    const handleAddGroup = useCallback(() => {
        if (selectedGroup && !groups.includes(selectedGroup)) {
            setGroups([...groups, selectedGroup]);
            setSelectedGroup('');
        }
    }, [selectedGroup, groups]);

    // const handleAddCompany = useCallback(() => {
    //     if (selectedCompany && !companies.includes(selectedCompany)) {
    //         setCompanies([...companies, selectedCompany]);
    //         setSelectedCompany('');
    //     }
    // }, [selectedCompany, companies]);

    const handleRemoveUser = useCallback((userId: string) => setUsers(users.filter(user => user !== userId)), [users]);
    const handleRemoveRole = useCallback((roleId: string) => setRoles(roles.filter(role => role !== roleId)), [roles]);
    const handleRemoveGroup = useCallback((groupId: string) => setGroups(groups.filter(group => group !== groupId)), [groups]);
    // const handleRemoveCompany = useCallback((companyId: string) => setCompanies(companies.filter(company => company !== companyId)), [companies]);

    const handleSubmit = useCallback(() => {
        const result = { 
            name, 
            users, 
            roles, 
            groups, 
            // companies, 
            ...(showShortName && { shortName }), 
            image  // Include the base64 image in the result
        };
        onSelect(result);
    }, [name, users, roles, groups, shortName, onSelect, showShortName, image]);  // Add 'image' as a dependency

    const handleDiscard = useCallback(() => {
        setName('');
        setUsers([]);
        setRoles([]);
        setGroups([]);
        // setCompanies([]);
        setShortName('');
        setSelectedImage(null);
        onDiscard();
    }, [onDiscard]);

    const userOptions = useMemo(() => allUsers.map(user => (
        <MenuItem key={user.id} value={user.id}>
            {user.username}
        </MenuItem>
    )), [allUsers]);

    const roleOptions = useMemo(() => allRoles.map(role => (
        <MenuItem key={role.id} value={role.id}>
            {role.name}
        </MenuItem>
    )), [allRoles]);

    const groupOptions = useMemo(() => allGroups.map(group => (
        <MenuItem key={group.id} value={group.id}>
            {group.name}
        </MenuItem>
    )), [allGroups]);

    // const companyOptions = useMemo(() => allCompanies.map(company => (
    //     <MenuItem key={company.id} value={company.id}>
    //         {company.name}
    //     </MenuItem>
    // )), [allCompanies]);

    const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    }, []);


    return (
        <div className={styles.roleFormContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.heading}>{heading}</h2>

                <TextField
                    className={styles.inputField}
                    label="Name"
                    value={name}
                    variant='standard'
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {showShortName && (
                    <TextField
                        className={styles.inputField}
                        label="Short Name"
                        value={shortName}
                        variant='standard'
                        onChange={(e) => setShortName(e.target.value.slice(0, 5))}
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 5 }}
                    />
                )}
                {showSelectImage && (
                    <div className={styles.imageInput}>
                        <label htmlFor="imageUpload" className={styles.label}>Upload Image <ImageIcon fontSize='small' /> </label>
                        <input
                            className={styles.input}
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <>
                            {image && (
                                <>

                                    <Image
                                        alt="logo"
                                        height="50"
                                        width="110"
                                        priority
                                        className={styles.image}
                                        src={image}
                                    /></>
                            )}
                        </>
                    </div>
                )}
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="group role form tabs">
                    <Tab label="User" />
                    {showRole && <Tab label="Role" />}
                    {showGroup && <Tab label="Group" />}
                    {/* {showCompany && <Tab label="Company" />} */}
                </Tabs>
                {tabIndex === 0 && (
                    <Box p={2}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className={styles.selectContainer}>
                                <TextField
                                    className={styles.inputField}
                                    select
                                    variant='standard'
                                    label="Select User"
                                    value={selectedUser}
                                    onChange={(e) => handleUserSelect(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    {userOptions}
                                </TextField>
                                <Button
                                    className={styles.addButton}
                                    onClick={handleAddUser}
                                    variant="contained"
                                    color="primary"
                                    disabled={!selectedUser}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableHead}>User</TableCell>
                                        <TableCell className={styles.tableHead}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((userId: string, index: number) => {
                                        const user = allUsers.find(user => user.id === userId);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{user?.username}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveUser(userId)}>
                                                        <DeleteIcon fontSize='small' sx={{ color: "red" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {showRole && tabIndex === 1 && (
                    <Box p={2}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className={styles.selectContainer}>
                                <TextField
                                    className={styles.inputField}
                                    select
                                    variant='standard'
                                    label="Select Role"
                                    value={selectedRole}
                                    onChange={(e) => handleRoleSelect(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    {roleOptions}
                                </TextField>
                                <Button
                                    className={styles.addButton}
                                    onClick={handleAddRole}
                                    variant="contained"
                                    color="primary"
                                    disabled={!selectedRole}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableHead}>Role</TableCell>
                                        <TableCell className={styles.tableHead}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roles.map((roleId: string, index: number) => {
                                        const role = allRoles.find(role => role.id === roleId);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{role?.name}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveRole(roleId)}>
                                                        <DeleteIcon fontSize='small' sx={{ color: "red" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {showGroup && tabIndex === (showRole ? 2 : 1) && (
                    <Box p={2}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className={styles.selectContainer}>
                                <TextField
                                    className={styles.inputField}
                                    select
                                    variant='standard'
                                    label="Select Group"
                                    value={selectedGroup}
                                    onChange={(e) => handleGroupSelect(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    {groupOptions}
                                </TextField>
                                <Button
                                    className={styles.addButton}
                                    onClick={handleAddGroup}
                                    variant="contained"
                                    color="primary"
                                    disabled={!selectedGroup}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableHead}>Group</TableCell>
                                        <TableCell className={styles.tableHead}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groups.map((groupId: string, index: number) => {
                                        const group = allGroups.find(group => group.id === groupId);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{group?.name}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveGroup(groupId)}>
                                                        <DeleteIcon fontSize='small' sx={{ color: "red" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {/* {showCompany && tabIndex === (showRole ? 2 : 1) && (
                    <Box p={2}>
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <div className={styles.selectContainer}>
                                <TextField
                                    className={styles.inputField}
                                    select
                                    variant='standard'
                                    label="Select Company"
                                    value={selectedCompany}
                                    onChange={(e) => handleCompanySelect(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                >
                                    {companyOptions}
                                </TextField>
                                <Button
                                    className={styles.addButton}
                                    onClick={handleAddCompany}
                                    variant="contained"
                                    color="primary"
                                    disabled={!selectedCompany}
                                >
                                    Add
                                </Button>
                            </div>
                        )}
                        <TableContainer component={Paper} className={styles.tableContainer}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles.tableHead}>Company</TableCell>
                                        <TableCell className={styles.tableHead}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {companies.map((companyId: string, index: number) => {
                                        const company = allCompanies.find(company => company.id === companyId);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{company?.name}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveCompany(companyId)}>
                                                        <DeleteIcon fontSize='small' sx={{ color: "red" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )} */}
                <Box mt={2} className={styles.buttonContainer}>
                    <Button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!name}
                    >
                        Submit
                    </Button>
                    <Button className={styles.discardButton} onClick={handleDiscard} variant="outlined" color="secondary">
                        Discard
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default GroupRoleFormComponent;
