import React, { useState, useEffect } from "react";
import {
  Avatar,
  Divider,
  Typography,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Profile.module.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState(""); // Added state for original email
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      setUserData(storedUserData);
    }

    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (registeredUser) {
      setNewEmail(registeredUser.email);
      setOriginalEmail(registeredUser.email); // Set original email
      setUserData({
        fname: registeredUser.fname,
        lname: registeredUser.lname,
      });
    }
  }, []);

  const handleEditEmail = () => {
    setOriginalEmail(newEmail); // Set original email when editing starts
    setEditEmail(true);
  };

  const handleSaveEmail = () => {
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));
    if (registeredUser) {
      registeredUser.email = newEmail;
      localStorage.setItem("registeredUser", JSON.stringify(registeredUser));
    }
    setEditEmail(false);
  };

  const handleCancelEdit = () => {
    setEditEmail(false);
    setNewEmail(originalEmail); // Revert to original email
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageUrl = reader.result;
      setProfilePic(imageUrl);
      localStorage.setItem("profilePic", imageUrl);
    };
  };

  const handleRemoveProfilePic = () => {
    setProfilePic("");
    localStorage.removeItem("profilePic");
  };

  const renderProfilePic = () => {
    if (profilePic) {
      return (
        <Avatar alt="Profile Picture" src={profilePic} className={styles.avatar} />
      );
    }
    if (newEmail) {
      const firstLetter = newEmail.charAt(0).toUpperCase();
      return <Avatar className={styles.avatar}>{firstLetter}</Avatar>;
    }
    return (
      <Avatar
        alt="Default Profile Picture"
        src="/default-profile-pic.jpg"
        className={styles.avatar}
      />
    );
  };

  return (
    <div className={styles.container}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        <label htmlFor="profile-pic-upload">
          {renderProfilePic()}
        </label>
        <input
          type="file"
          id="profile-pic-upload"
          accept="image/*"
          onChange={handleProfilePicChange}
          style={{ display: "none" }}
        />
        {profilePic && (
          <IconButton onClick={handleRemoveProfilePic} className={styles.deleteButton}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="h4" className={styles.heading}>
        Profile
      </Typography><br></br>
      <Divider className={styles.hr} />
      <div className={styles.profileForm}>
        <div className={styles.profileField}>
          <EmailIcon className={styles.icon} />
          <Typography className={`${styles.label} ${styles.emailLabel}`}>
            Email:
          </Typography>
          {editEmail ? (
            <>
              <TextField
                type="email"
                variant="outlined"
                className={styles.editEmailInput}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <IconButton
                onClick={handleSaveEmail}
                className={styles.editButton}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                onClick={handleCancelEdit}
                className={styles.editButton}
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Typography className={`${styles.value} ${styles.emailValue}`}>
                {newEmail}
              </Typography>
              <IconButton onClick={handleEditEmail} className={styles.editButton}>
                <EditIcon />
              </IconButton>
            </>
          )}
        </div>
        {userData && (
          <div className={styles.profileField}>
            <AccountCircleIcon className={styles.icon} />
            <Typography className={styles.label}>Name:</Typography>
            <Typography className={styles.value}>
              {`${userData.fname} ${userData.lname}`}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
