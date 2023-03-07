

import React from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

const theme = createTheme();

export default function MSignIn(props) {
    const { t } = useTranslation();

    console.log("-------------------------MSignIn --------------------- : " + " , islocal: " + props.islocal);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    //console.log({  email: data.get('email'),   password: data.get('password'),  });
    props.mhandler(data.get('email'),data.get('password'));
   
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {props.islocal==true? t('LT_LOGINTITLE_LOCAL') : t('LT_LOGINTITLE')}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {props.islocal== true? null:<TextField  margin="normal"   required  fullWidth    id="id"   label="user id"    name="email"    autoFocus    />}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              LogIn
            </Button>
            <Typography component="h1" variant="h5">
            { t(props.loginfailmsg) }
          </Typography>

         
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
