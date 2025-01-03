"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    TextField,
    Button,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    Typography,
    Paper,
    Grid,
    Box,
    Autocomplete,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Company } from "../../enums/company";
import styles from "./employeeForm.module.scss";
import dayjs, { Dayjs } from "dayjs";
import DynamicSnackbar from "@/components/shared/snackbar/snackbar";
import UserService from "@/modules/rbac/services/user.service";
import { User } from "@/types/schema/user";
import { Employee as schema } from "@/types/AMS/employee";

interface EmployeeFormProps {
    employee?: schema | null;
    onSubmit: (formData: Employee) => void;
    onDiscard?: () => void;
}

interface Employee {
    id?: string;
    name: string;
    surname: string;
    address: string;
    cnic: string;
    joiningDate: null | Dayjs | undefined;
    bloodGroup: string;
    dob: null | Dayjs | undefined;
    contactNo: string;
    emergencyContactNo?: string;
    designation: string;
    department: string;
    martialStatus: string;
    noOfChildrens?: number;
    company: Company;
    image?: string;
    code?: string;
    userId?: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onDiscard }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState<Employee>({
        name: employee?.name || "",
        surname: employee?.surname || "",
        address: employee?.address || "",
        cnic: employee?.cnic || "",
        joiningDate: employee?.joiningDate ? dayjs(employee?.joiningDate) : null,
        bloodGroup: employee?.bloodGroup || "",
        company: employee?.company || Company.SOLARMAX,
        image: employee?.image || "",
        userId: employee?.userId || undefined,
        dob: employee?.dob ? dayjs(employee.dob) : null,
        contactNo: employee?.contactNo || "",
        emergencyContactNo: employee?.emergencyContactNo || '',
        designation: employee?.designation || "",
        department: employee?.department || "",
        martialStatus: employee?.martialStatus || "",
        noOfChildrens: employee?.noOfChildrens || undefined,
    });

    const userService: UserService = new UserService()
    const [imagePreview, setImagePreview] = useState<string | null>(formData.image || null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => { fetchUsers() }, [])

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchUsers = async () => {
        if (employee) {
            const data = await userService.getAlluser();
            console.log(data)
            setUsers(data);
        }
        else {
            const data = await userService.getNonAssociatedUsers();
            console.log(data)
            setUsers(data);
        }
    }

    const handleImageChange = async (e: any) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                setSnackbarMessage("Image size must not exceed 5MB");
                setSnackbarOpen(true);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setFormData({ ...formData, image: base64 });
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCompanyChange = (e: any) => {
        setFormData({ ...formData, company: e.target.value as Company });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleDateChange = (key: "dob" | "joiningDate") => (date: Dayjs | null) => {
        setFormData({ ...formData, [key]: date });
    };

    return (
        <Box className={styles.formContainer}>
            <Paper elevation={3} className={styles.formPaper}>
                <Typography variant="h4" component="h1" gutterBottom className={styles.formTitle}>
                    {employee ? "Edit Employee" : "New Employee"}
                </Typography>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Personal Information Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Personal Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Grid>



                        <Grid item xs={12} md={4}>
                            <TextField
                                label="Contact Number"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Grid>

                    </Grid>
                    {/* Date Information */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                label="CNIC"
                                name="cnic"
                                value={formData.cnic}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                                    if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5)}`;
                                    if (value.length > 13) value = `${value.slice(0, 13)}-${value.slice(13)}`;
                                    if (value.length > 15) value = value.slice(0, 15); // Limit length to 15 characters
                                    handleInputChange({ target: { name: "cnic", value } });
                                }}
                                fullWidth
                                required
                                inputProps={{
                                    maxLength: 15, // Enforce maximum length
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                label=" Emergency Contact Number"
                                name="emergencyContactNo"
                                value={formData.emergencyContactNo}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>

                            <DatePicker
                                views={['day', 'month', 'year']}
                                label="Date of Birth"
                                value={formData.dob}
                                onChange={handleDateChange("dob")}
                                //    inputFormat="dd.MM.yyyy"
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: { fullWidth: true, required: true },
                                }}
                            />

                        </Grid>



                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Blood Group</InputLabel>
                                <Select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {bloodGroups.map((group) => (
                                        <MenuItem key={group} value={group}>
                                            {group}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Employment Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Employment Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>

                            <DatePicker
                                label="Joining Date"
                                views={['day', 'month', 'year']}
                                format="DD/MM/YYYY"
                                value={formData.joiningDate}
                                onChange={handleDateChange("joiningDate")}
                                slotProps={{
                                    textField: { fullWidth: true, required: true },
                                }}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Company</InputLabel>
                                <Select
                                    name="company"
                                    value={formData.company}
                                    onChange={handleCompanyChange}
                                    required
                                >
                                    {Object.values(Company).map((company) => (
                                        <MenuItem key={company} value={company}>
                                            {company}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => option.username || ""}
                                value={users.find((user) => user.id === formData.userId) || null}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, userId: newValue ? newValue.id : undefined });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select User"
                                        placeholder="Type to search users"
                                        fullWidth
                                    />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                noOptionsText="No users found"
                            />
                        </Grid>

                        {/* Personal Details */}
                        <Grid item xs={12}>
                            <Typography variant="h6" className={styles.sectionTitle}>
                                Additional Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Marital Status</InputLabel>
                                <Select
                                    name="martialStatus"
                                    value={formData.martialStatus}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <MenuItem value="single">Single</MenuItem>
                                    <MenuItem value="married">Married</MenuItem>
                                    <MenuItem value="divorced">Divorced</MenuItem>
                                    <MenuItem value="widowed">Widowed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Number of Children"
                                name="noOfChildrens"
                                type="number"
                                value={formData.noOfChildrens || ""}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                multiline
                                rows={3}
                            />
                        </Grid>

                        {/* Image Upload Section */}
                        <Grid item xs={12}>
                            <Box className={styles.imageUploadSection}>
                                <Box className={styles.imageUploadContainer}>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        className={styles.uploadButton}
                                    >
                                        Upload Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                    {imagePreview && (
                                        <Box className={styles.imagePreviewContainer}>
                                            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12}>
                            <Box className={styles.actionButtons}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className={styles.submitButton}
                                >
                                    {employee ? "Update Employee" : "Create Employee"}
                                </Button>
                                {onDiscard && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={onDiscard}
                                        className={styles.discardButton}
                                    >
                                        Discard
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {snackbarOpen && <DynamicSnackbar text={snackbarMessage} />}
        </Box>
    );
};

export default EmployeeForm;