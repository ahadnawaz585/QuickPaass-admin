'use client';
import local from 'next/font/local';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export function StyledRoot({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}

const TitilliumWeb = local({
    src: [{
        path: '../../../public/fonts/Titillium_Web/TitilliumWeb-Light.ttf',
        weight: "300",
    }
    ],
    variable: "--TitilliumWeb",
});

// const TitilliumWeb = Titillium_Web({
//     subsets: ["latin"],
//     weight: "300"
//   });

export const theme = createTheme({
    typography: {
        fontFamily: TitilliumWeb.style.fontFamily, // Set the fontFamily to TitilliumWeb
    },

    // components:{
    //     MuiMenu: {
    //         styleOverrides: {
    //             root: {
    //                boxShadow:"none"
    //         }
    //       }
    // }
    // components: {
    //     MuiCheckbox: {
    //         styleOverrides: {
    //             root: {
    //                 fontFamily: TitilliumWeb.style.fontFamily,
    //               // Apply the font family to Checkbox
    //             },
    //         },
    //     },
    //     MuiFormControlLabel: {
    //         styleOverrides: {
    //             root: {
    //                 fontFamily: TitilliumWeb.style.fontFamily, // Apply the font family to FormControlLabel
    //             },
    //         },
    //     },
    // },
})