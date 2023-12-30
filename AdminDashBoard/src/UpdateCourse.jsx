import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, TextField, Button, Typography, Grid } from "@mui/material";
import axios from 'axios';
import { courseState } from "./store/atoms/course";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { courseTitle } from "./store/selectors/courseTitle";
import { coursePrice } from "./store/selectors/coursePrice";
import { courseImage } from "./store/selectors/courseImage";
import { isCourseLoading } from "./store/selectors/isCourseLoading";
import Alert from '@mui/material/Alert';
function UpdateCourse() {
    const setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);
    //Loader should be used when you are working with variables which are async call.
    const { courseId } = useParams();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        axios.get("http://localhost:3000/admin/courses/" + courseId, {
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
    else {
        return (
            <div style={{ paddingBottom: "70px" }}>
                <GrayTopper />
                <Grid container>
                    <Grid item lg={8} md={12} sm={12}>
                        <Update setOpen={setOpen} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                        <CourseInfo />
                    </Grid>
                </Grid>
                <ShowAlert open={open} setOpen={setOpen} ></ShowAlert>
            </div>
        );
    }
}

function GrayTopper() {
    const title = useRecoilValue(courseTitle);

    return (
        <div style={{ height: 250, background: "#B4B4B3", top: 0, width: "100vw", zIndex: 0, marginBottom: -250 }}>
            <div style={{ height: 250, display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <div>
                    <Typography style={{ color: "black", fontWeight: 600 }} variant="h3" textAlign={"center"}>
                        {title}
                    </Typography>
                </div>
            </div>
        </div>
    );
}

function Update(props) {
    const [courseInfo, setCourse] = useRecoilState(courseState);
    //local variables needed to particular component we should use UseState to it.
    const [title, setTitle] = useState(courseInfo.course.title);
    const [description, setDescription] = useState(courseInfo.course.description);
    const [image, setImage] = useState(courseInfo.course.imageLink);
    const [price, setPrice] = useState(courseInfo.course.price);
    const [published, setPublished] = useState(courseInfo.course.published);

    const { courseId } = useParams();


    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 185 }}>
            <Card variant="outlined" style={{ maxWidth: 500, padding: 30, borderColor: "#132043", borderWidth: 2 }}>
                <div></div>
                <TextField
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    style={{ paddingBottom: 10 }}
                    fullWidth={true}
                    variant="outlined"
                    label="Title"
                />

                <TextField
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    style={{ paddingBottom: 10 }}
                    fullWidth={true}
                    variant="outlined"
                    label="Description"
                />

                <TextField
                    onChange={(e) => setImage(e.target.value)}
                    value={image}
                    style={{ paddingBottom: 10 }}
                    fullWidth={true}
                    variant="outlined"
                    label="Image"
                />

                <TextField
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    style={{ paddingBottom: 10 }}
                    fullWidth={true}
                    variant="outlined"
                    label="Price"
                />
                <TextField
                    onChange={(e) => setPublished(e.target.value)}
                    value={published}
                    style={{ paddingBottom: 20 }}
                    fullWidth={true}
                    variant="outlined"
                    label="Published"
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        size="large"
                        variant="contained"
                        style={{ backgroundColor: "#132043" }}
                        onClick={async () => {
                            const res = await axios.put(
                                "http://localhost:3000/admin/courses/" + courseId,
                                {
                                    title: title,
                                    description: description,
                                    imageLink: image,
                                    price: price,
                                    published: published
                                },
                                {
                                    headers: {
                                        Authorization: "Bearer " + localStorage.getItem("token")
                                    }
                                }
                            );
                            let updatedCourse = {
                                title: title,
                                description: description,
                                imageLink: image,
                                price,
                                _id: courseInfo.course._id,
                                published: published
                            };
                            setCourse({ isLoading: false, course: updatedCourse });
                            props.setOpen(true);
                            // Here,Course atom is changed so the componenet subscribed to it also re-renders, with that it also triggers the selectors which use
                            //      course value like courseImage selector uses course.imageLink prop of course atom so corresponding selector also changes which result in the component subscried
                            //      to it also changes overall,so we can say that component which subscibes to particular selector or atom changes on updation.
                        }}
                    >
                        Update Course
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function CourseInfo() {
    const infoTitle = useRecoilValue(courseTitle);
    const infoImage = useRecoilValue(courseImage);
    //if any one of these updates whole component re-renders.
    return (
        <div style={{ display: "flex", marginTop: 50, justifyContent: "center", width: "100%" }}>
            <Card style={{ margin: 10, width: 350, minHeight: 200, borderRadius: 20, marginRight: 50, paddingBottom: 5, zIndex: 2 }}>
                <img src={infoImage} style={{ width: 350 }} alt="Course" />
                <div style={{ margin: 10 }}>
                    <Typography variant="h5" style={{ color: "#132043" }}><b>{infoTitle}</b></Typography>
                    <Typography variant="subtitle2" style={{ color: "gray", fontSize: 15 }}>Price</Typography>
                    <Price></Price>
                </div>
            </Card>
        </div>
    );
}
function Price() {
    const infoPrice = useRecoilValue(coursePrice);
    return <Typography variant="subtitle1">
        <b>Rs. {infoPrice}</b>
    </Typography>
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
            <div style={{ padding: "13px" }} >
                <Alert onClose={handleClose} variant="filled" severity="success" sx={{ width: "30%" }}>
                    CourseDetails Edited Successfully!
                </Alert>
            </div>
        );

    }
    else {
        return <></>;
    }

}
export default UpdateCourse;
