export const generateEmployeeCode = (employeeData: any): string => {
    const joiningDate = employeeData.joiningDate;
    const company = employeeData.company;

    // Format the date (e.g., '2024-12-22')
    const formattedDate = joiningDate.toISOString().split('T')[0];

    // You can customize the code pattern, for example: `EMP-yyyy-mm-dd-xxx`
    const code = `EMP-${formattedDate}-${generateRandomCode(3)}`;
    return code;
};


const generateRandomCode = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
