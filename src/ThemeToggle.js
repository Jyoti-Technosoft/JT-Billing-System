import React from 'react';
import { useTheme } from './ThemeContext';
import { IconButton } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <IconButton onClick={toggleTheme} style={{ margin: '10px' }} size="small">
            {theme === 'light' ? <DarkIcon /> : <LightIcon />}
            <span style={{ marginLeft: '5px' }}>
            </span>
        </IconButton>
    );
};

export default ThemeToggle;
