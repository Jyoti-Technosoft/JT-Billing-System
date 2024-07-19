import React from 'react';
import { useTheme } from './ThemeContext';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon, WbSunny as SunIcon, NightsStay as MoonIcon } from '@mui/icons-material';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const tooltipText = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    const iconColor = theme === 'light' ? 'gray' : 'orange';

    return (
        <Tooltip title={<Typography variant="body1">{tooltipText}</Typography>} arrow>
            <IconButton onClick={toggleTheme} style={{ margin: '10px', color: iconColor }} size="small">
                {theme === 'light' ? <MoonIcon style={{ marginLeft: '5px' }} /> : <SunIcon style={{ marginLeft: '5px' }} />}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;
