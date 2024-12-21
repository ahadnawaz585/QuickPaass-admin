import React, { useEffect, useState, Suspense } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, IconButton } from '@mui/material';
import { Delete, Visibility, VisibilityOff } from '@mui/icons-material';
const GoBack = React.lazy(() => import('@/components/shared/goBack/goBack'));
import RoleService from '@/modules/rbac/services/role.service';
import GroupService from '@/modules/rbac/services/group.service';
import { Role } from '@/types/schema/role';
import { Group } from '@/types/schema/group';
import { SelectChangeEvent } from '@mui/material/Select';
import styles from './userForm.module.scss';
import { UserCreateData } from '@/types/schema/user';
import Loader from '@/components/shared/loader/loader';
// import CompanyService from '@/frontend/services/company.service';
// import { Company } from '@/types/company';

interface Props {
    heading: string;
    initialData?: UserCreateData;
    onSubmit: (data: UserCreateData) => void;
    onDiscard: () => void;
    type: 'new' | 'edit';
}

const UserForm: React.FC<Props> = ({ initialData, onSubmit, heading, onDiscard, type }) => {
    const [username, setUsername] = useState(initialData ? initialData.username : '');
    const [password, setPassword] = useState(initialData ? initialData.password : '');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    // const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    // const [companies, setCompanies] = useState<Company[]>([]);
    const [currentTab, setCurrentTab] = useState('roles');
    const [selectedRoleToAdd, setSelectedRoleToAdd] = useState<string>('');
    const [selectedGroupToAdd, setSelectedGroupToAdd] = useState<string>('');
    const [selectedCompanyToAdd, setSelectedCompanyToAdd] = useState<string>('');

    const roleService: RoleService = new RoleService();
    // const companyServcie: CompanyService = new CompanyService();
    const groupService: GroupService = new GroupService();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSubmitDisabled(username === '' || (type === 'new' && (password === '' || password !== confirmPassword)));
    }, [username, password, confirmPassword, type]);

    useEffect(() => {
        if (initialData) {

       
            const fetchRoleNames = async () => {
                const rolesData = await Promise.all(initialData.userRole.map(roleId => roleService.getRoleByName(roleId)));
                setSelectedRoles(rolesData);
            };

            const fetchGroupNames = async () => {
                const groupsData = await Promise.all(initialData.userGroup.map(groupId => groupService.getGroupByName(groupId)));
                setSelectedGroups(groupsData);
            };

            // const fetchCompanyNames = async () => {
            //     const companiesData = await Promise.all(initialData.companyUser.map(companyId => companyServcie.getCompanyByName(companyId)));
            //     setSelectedCompanies(companiesData);
            // };

            fetchRoleNames();
            fetchGroupNames();
            // fetchCompanyNames();
        }
    }, [initialData]);

    const fetchData = async () => {
        setRoles(await roleService.getAllRoles());
        setGroups(await groupService.getAllGroups());
        // setCompanies(await companyServcie.getAllCompany());
    };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        setSelectedRoleToAdd(event.target.value);
    };

    const handleGroupChange = (event: SelectChangeEvent<string>) => {
        setSelectedGroupToAdd(event.target.value);
    };

    const handleCompanyChange = (event: SelectChangeEvent<string>) => {
        setSelectedCompanyToAdd(event.target.value);
    };

    const handleRoleAdd = () => {
        const selectedRole = roles.find(role => role.id === selectedRoleToAdd);
        if (selectedRole && !selectedRoles.some(role => role.id === selectedRoleToAdd)) {
            setSelectedRoles(prevRoles => [...prevRoles, selectedRole]);
        }
        setSelectedRoleToAdd('');
    };

    const handleGroupAdd = () => {
        const selectedGroup = groups.find(group => group.id === selectedGroupToAdd);
        if (selectedGroup && !selectedGroups.some(group => group.id === selectedGroupToAdd)) {
            setSelectedGroups(prevGroups => [...prevGroups, selectedGroup]);
        }
        setSelectedGroupToAdd('');
    };

    // const handleCompanyAdd = () => {
    //     const selectedCompany = companies.find(company => company.id === selectedCompanyToAdd);
    //     if (selectedCompany && !selectedCompanies.some(company => company.id === selectedCompanyToAdd)) {
    //         setSelectedCompanies(prevCompanies => [...prevCompanies, selectedCompany]);
    //     }
    //     setSelectedCompanyToAdd('');
    // };

    const handleRoleDelete = (role: Role) => {
        setSelectedRoles(prevRoles => prevRoles.filter(selectedRole => selectedRole.id !== role.id));
    };

    const handleGroupDelete = (group: Group) => {
        setSelectedGroups(prevGroups => prevGroups.filter(selectedGroup => selectedGroup.id !== group.id));
    };

    // const handleCompanyDelete = (company: Company) => {
    //     setSelectedCompanies(prevCompanies => prevCompanies.filter(selectedCompany => selectedCompany.id !== company.id));
    // };

    const handleSubmit = () => {
        const userData: UserCreateData = {
            username,
            password: type === 'new' ? password : '',
            userRole: selectedRoles.map(role => role.id ?? ''),
            userGroup: selectedGroups.map(group => group.id ?? ''),
            // companyUser: selectedCompanies.map(company => company.id ?? '')
        };
        onSubmit(userData);
    };

    const handleDiscard = () => {
        setUsername(initialData ? initialData.username : '');
        setPassword(initialData ? initialData.password : '');
        setConfirmPassword('');
        setSelectedRoles([]);
        setSelectedGroups([]);
        // setSelectedCompanies([]);
        setSubmitDisabled(true);
        onDiscard();
    };

    return (
        <div className={styles['new-user-container']}>
            <div className={styles['new-user-form']}>
                <Suspense fallback={<Loader/>}><GoBack /></Suspense>
                <h2 className={styles['heading']}>{heading}</h2>

                <TextField
                    label="Username"
                    value={username}
                    size='small'
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    variant="standard"
                    fullWidth
                    margin="normal"
                />
                {type === 'new' && (
                    <>
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            size='small'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="standard"
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            required
                            size='small'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            variant="standard"
                            fullWidth
                            margin="normal"
                        />
                    </>
                )}
                <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                    <Tab label="Roles" value="roles" />
                    <Tab label="Groups" value="groups" />
                    {/* <Tab label="Companies" value="companies" /> */}
                </Tabs>
                {currentTab === 'roles' && (
                    <Box mt={2}>
                        <div className={styles.form}>
                            <FormControl fullWidth variant="standard" margin="normal">
                                <InputLabel id="role-select-label">Role</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="role-select"
                                    size='small'
                                    value={selectedRoleToAdd}
                                    onChange={handleRoleChange}
                                    label="Role"
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                className={styles.addButon}
                                variant="contained"
                                color="primary"
                                onClick={handleRoleAdd}
                                disabled={!selectedRoleToAdd}
                            >
                                Add
                            </Button>
                        </div>
                        <TableContainer component={Paper} className={
                            styles['table']}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles['tableHead']}>Role Name</TableCell>
                                        <TableCell className={styles['tableHead']}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedRoles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell>{role.name}</TableCell>
                                            <TableCell className={styles['delete']}>
                                                <Delete fontSize='small' sx={{ color: "red" }} onClick={() => handleRoleDelete(role)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {currentTab === 'groups' && (
                    <Box mt={2}>
                        <div className={styles.form}>
                            <FormControl fullWidth variant="standard" margin="normal">
                                <InputLabel id="group-select-label">Group</InputLabel>
                                <Select
                                    labelId="group-select-label"
                                    id="group-select"
                                    value={selectedGroupToAdd}
                                    onChange={handleGroupChange}
                                    label="Group"
                                >
                                    {groups.map((group) => (
                                        <MenuItem key={group.id} value={group.id}>
                                            {group.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleGroupAdd}
                                disabled={!selectedGroupToAdd}
                            >
                                Add
                            </Button>
                        </div>
                        <TableContainer component={Paper} className={styles['table']}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles['tableHead']}>Group Name</TableCell>
                                        <TableCell className={styles['tableHead']}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedGroups.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell>{group.name}</TableCell>
                                            <TableCell className={styles['delete']}>
                                                <Delete fontSize='small' sx={{ color: "red" }} onClick={() => handleGroupDelete(group)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
                {/* {currentTab === 'companies' && (
                    <Box mt={2}>
                        <div className={styles.form}>
                            <FormControl fullWidth variant="standard" margin="normal">
                                <InputLabel id="company-select-label">Company</InputLabel>
                                <Select
                                    labelId="company-select-label"
                                    id="company-select"
                                    value={selectedCompanyToAdd}
                                    onChange={handleCompanyChange}
                                    label="Company"
                                >
                                    {companies.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCompanyAdd}
                                disabled={!selectedCompanyToAdd}
                            >
                                Add
                            </Button>
                        </div>
                        <TableContainer component={Paper} className={styles['table']}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={styles['tableHead']}>Company Name</TableCell>
                                        <TableCell className={styles['tableHead']}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedCompanies.map((company) => (
                                        <TableRow key={company.id}>
                                            <TableCell>{company.name}</TableCell>
                                            <TableCell className={styles['delete']}>
                                                <Delete fontSize='small' sx={{ color: "red" }} onClick={() => handleCompanyDelete(company)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )} */}
                <Box mt={2} className={styles['buttonContainer']}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={submitDisabled}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleDiscard}
                    >
                        Discard
                    </Button>
                </Box>
            </div>
        </div>
    );
}

export default UserForm;