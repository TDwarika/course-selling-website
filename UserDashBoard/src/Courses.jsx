import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
function Courses() {

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("http://localhost:3000/users/courses", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then((res) => {
                // No need to call res.json() for Axios, as it's automatically parsed
                setCourses(res.data.courses);
            })

    }, []);


    return (
        <>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                <Typography variant="h3" style={{ margin: '20px', color: '#132043' }}><b>All Courses</b></Typography>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: 40 }} >
                {courses.map((item) => {
                    return <>
                        <div style={{ margin: '10px', cursor: 'pointer' }} onClick={() => navigate("/courseDetails/" + item._id)}>
                            <Item key={item._id} courses={courses} course={item} setCourses={setCourses} />
                        </div>
                    </>
                })}
            </div>

        </>

    );

}
function Item(props) {
    const navigate = useNavigate();
    return (
        <div >
            <Card variant="outlined" style={{
                margin: 10,
                width: 300,
                minHeight: 200
            }}>
                <img src={props.course.imageLink} style={{ width: 330, height: 170 }}>
                </img>
                <Typography textAlign={"center"} style={{ padding: 3 }} variant="h5"><b>{props.course.title}</b></Typography>
                <Typography textAlign={"center"}>{props.course.description}</Typography>
                <Typography style={{ fontSize: 20, padding: 5 }} textAlign={"center"}>
                    <b>₹{props.course.price}/-</b>
                </Typography>

            </Card>
        </div>
    );
}
export default Courses;
