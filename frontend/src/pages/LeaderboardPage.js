import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch leaderboard.");
      }
    };

    fetchLeaders();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          See the top performers and their max scores!
        </Typography>

        <List>
          {leaders.map((leader, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      index === 0
                        ? "gold"
                        : index === 1
                        ? "silver"
                        : index === 2
                        ? "#cd7f32"
                        : "grey",
                  }}
                >
                  {index === 0 || index === 1 || index === 2 ? (
                    <EmojiEventsIcon />
                  ) : (
                    <Typography variant="body2">{index + 1}</Typography>
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="h6">{leader.username}</Typography>}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Max Score: {leader.maxScore}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default LeaderboardPage;
