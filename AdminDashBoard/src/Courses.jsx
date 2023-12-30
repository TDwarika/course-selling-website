import { useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Courses() {
    
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:3000/admin/courses", {
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
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", margin: 40 }}>
                {courses.map((item) => {
                    return <Item key={item._id} courses={courses} course={item} setCourses={setCourses}  />;
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
                <Typography style={{ fontSize: 20, paddingTop: 3 }} textAlign={"center"}>
                    <b>₹{props.course.price}/-</b>
                </Typography>
                <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
                    <Button style={{ backgroundColor: "#132043" }} variant="contained" size={"medium"} onClick={() => {
                        navigate("/courses/" + props.course._id)
                    }}>
                        Edit
                    </Button>
                    <Button style={{ marginLeft: 50, backgroundColor: "#132043" }} variant="contained" size={"medium"} onClick={async () => {
                        const res = await axios.delete("http://localhost:3000/admin/courses/" + props.course._id,
                            {
                                headers: {
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                }
                            });
                        props.setCourses(props.courses.filter(course => course._id !== props.course._id));
                    }}> Delete
                    </Button>
                </div>
            </Card>
        </div>
    );
}
export default Courses;
