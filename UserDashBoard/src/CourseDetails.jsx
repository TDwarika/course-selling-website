import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, TextField, Button, Typography, Grid, textFieldClasses } from "@mui/material";
import axios from 'axios';
import { courseState } from "./store/atoms/course";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { isCourseLoading } from "./store/selectors/isCourseLoading";
import Alert from '@mui/material/Alert';
function CourseDetails() {
    const setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);
    const { courseId } = useParams();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        axios.get("http://localhost:3000/users/courses/" + courseId, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((res) => {
                setCourse({ isLoading: false, course: res.data.course });
            })
    }, []);
    if (courseLoading) {
        return <div>Loading....</div>;
    }
    return (<>
        <div style={{ paddingBottom: "50px" }}> 

            <Grid container>
                <Grid item lg={8} md={12} sm={12}>
                    {/* <Update setOpen={setOpen} /> */}
                    <CoursePurchase setOpen={setOpen}></CoursePurchase>
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                    <CourseInfo ></CourseInfo>
                </Grid>
            </Grid>
            <ShowAlert open={open} setOpen={setOpen}></ShowAlert>
        </div>
    </>);
}
function CoursePurchase(props) {
    const [courseInfo, setCourse] = useRecoilState(courseState);
    //local variables needed to particular component we should use UseState to it.
    const [title, setTitle] = useState(courseInfo.course.title);
    const [description, setDescription] = useState(courseInfo.course.description);
    const [image, setImage] = useState(courseInfo.course.imageLink);
    const [price, setPrice] = useState(courseInfo.course.price);
    const { courseId } = useParams();
    return (
        <div style={{ marginTop: 60, color: '#132043', textAlign: "center" }}>
            <img src={image} style={{ height: 200, width: 290, borderRadius: 20 }} alt="Course" />
            <div style={{ margin: 10 }}>
                <Typography variant="h4" style={{ color: "#132043", margin: 5 }}><b>{title}</b></Typography>
                <Typography variant="h6" style={{ color: "#132043", margin: 5 }}>{description}</Typography>
                <Typography variant="h1" style={{ fontSize: 20, margin: 10 }}><b>₹{price}</b></Typography>
                <Button style={{
                    backgroundColor: "#132043",
                    marginTop: 5
                }} size='small' variant="contained" onClick={() => {
                    axios.post("http://localhost:3000/users/courses/" + courseId, {}, {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    }).then(res => {
                        console.log(res.data.message);
                        props.setOpen(true);
                    });
                }}>Purchase</Button>
            </div>
        </div>
    );
}
function CourseInfo() {
    return (<div>
        <Card variant="outlined" style={{ maxWidth: 270, height: 400, borderColor: "#132043", borderWidth: 2, marginTop: 50, color: '#132043', textAlign: "center", backgroundColor: '#132043' }}>
            <Typography variant="h5" sx={{ fontFamily: 'default', m: 1.5, color: 'white' }}>Course Overview</Typography>
            <div style={{ marginTop: 20, padding: 10, backgroundColor: 'white' }}>

                <div style={{ marginBottom: '20px', display: "flex", marginLeft: '30px' }}>
                    {/* <SignalCellularAltIcon color="disabled" sx={{ m: 1 }}></SignalCellularAltIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>Begineer To Pro</Typography>
                </div>

                <div style={{ marginBottom: '20px', display: "flex", marginLeft: '30px' }}>
                    {/* <OndemandVideoIcon color="disabled" sx={{ m: 1 }}></OndemandVideoIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>50+ Hours of HD Videos</Typography>
                </div>

                <div style={{ marginBottom: '20px', display: "flex", marginLeft: '30px' }}>
                    {/* <DownloadForOfflineIcon color="disabled" sx={{ m: 1 }}></DownloadForOfflineIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>Downloadable Content</Typography>
                </div>
                <div style={{ marginBottom: '20px', display: "flex", marginLeft: '30px' }}>
                    {/* <ClosedCaptionIcon color="disabled" sx={{ m: 1 }}></ClosedCaptionIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>English Captions</Typography>
                </div>

                <div style={{ marginBottom: '20px', display: "flex", marginLeft: '30px' }}>
                    {/* <CardMembershipIcon color="disabled" sx={{ m: 1 }}></CardMembershipIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>Certificate of Completion</Typography>
                </div>

                <div style={{ marginBottom: '30px', display: "flex", marginLeft: '30px' }}>
                    {/* <AllInclusiveIcon color="disabled" sx={{ m: 1 }}></AllInclusiveIcon> */}
                    <Typography variant="h7" sx={{ fontFamily: 'default', m: 1.5 }}>LifeTime access</Typography>
                </div>

            </div>
        </Card>
    </div>);
}
function ShowAlert(props) {

    if (props.open) {

        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            props.setOpen(false);
        };
        return (
            <div style={{ paddingLeft:20}} >
                <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "30%" }}>
                    Course Purchased Successfully!
                </Alert>
            </div>
        );
    }
    else {
        return <></>;
    }

}
export default CourseDetails;