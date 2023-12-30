import Button from '@mui/material/Button'
import { Card, Typography } from '@mui/material';
import { TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
function AddCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [published, setPublished] = useState("");
    return (<div>
        <Typography textAlign={"center"} margin={"20px"} variant='h3' color={"#132043"} >
            Add Course
        </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <Card variant="outlined" style={{
                width: 400,
                borderColor: "#132043",
                borderWidth: 2,
                minheight: 360,
                padding: 50
            }}>
                <TextField style={{ marginBottom: 25 }} onChange={(e) => {
                    setTitle(e.target.value);
                }} fullWidth={true} variant="outlined" label="Title" />

                <TextField style={{ marginBottom: 25 }} onChange={(e) => {
                    setDescription(e.target.value);
                }} fullWidth={true} variant="outlined" label="Description" />

                <TextField style={{ marginBottom: 25 }} onChange={(e) => {
                    setImage(e.target.value);
                }} fullWidth={true} variant="outlined" label="Image" />

                <TextField style={{ marginBottom: 35 }} onChange={(e) => {
                    setPrice(e.target.value);
                }} fullWidth={true} variant="outlined" label="Price" />
                <TextField style={{ marginBottom: 25 }} onChange={(e) => {
                    setPublished(e.target.value);
                }} fullWidth={true} variant="outlined" label="Published (Yes or No)" />

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button size={"large"} style={{ backgroundColor: "#132043" }}
                        variant="contained"
                        onClick={async () => {
                            const res=await axios.post("http://localhost:3000/admin/courses", {

                                title: title,
                                description: description,
                                price: price,
                                imageLink: image,
                                published: published
                            },
                                {
                                    headers: {

                                        "Authorization": "Bearer " + localStorage.getItem("token")
                                    }
                                }

                            );
                            
                            alert("Added Course!")
                        }}>Add Course</Button>
                </div>

            </Card>
        </div>

    </div>);

}
export default AddCourse;