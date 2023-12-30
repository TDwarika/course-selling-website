import { Typography } from "@mui/material";
import { Grid, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
function Landing() {
    const navigate = useNavigate();
    
    return (
        <Grid container>
        <Grid item lg={7} md={12} sm={12}>
                <Typography variant="h3" style={{ marginTop: 160, marginLeft: 70, color: '#132043', textAlign: "center" }}>Welcome to CourseElite Admin.</Typography>
                <Typography variant="h5" style={{ marginTop: 30, marginLeft: 30, color: '#132043', textAlign: "center" }}>Inspiring Minds, Shaping Futures: Your Journey Begins !</Typography>
                <div style={{ display: "flex", justifyContent: "center", margin: 40 }}>
                    <Button variant="contained" size='large' style={{ marginRight: 30, backgroundColor: "#132043" }}
                        onClick={() => {
                            navigate("/signup");
                        }}>Sign Up</Button>
                    <Button style={{
                        backgroundColor: "#132043",
                    }} size='medium' variant="contained" onClick={() => {
                        navigate("/signin");
                    }}>Sign In</Button>
                </div>
            </Grid>
            <Grid item lg={5} md={12} sm={12}>
                <img
                    src="src\assets\AdminLandingImage.jpg"
                    style={{  height: 450, width: 420, margin: 40 }}
                    alt="Course Image"
                />
            </Grid>
            
        </Grid>
    );
}

export default Landing;
