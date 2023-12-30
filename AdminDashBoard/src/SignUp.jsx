import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button'
import { Typography } from '@mui/material';
import { userState } from './store/atoms/user';
import axios from "axios";
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const setUser = useSetRecoilState(userState);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return <div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            margin: 80
        }}>
            <Card variant="outlined" style={{
                width: 400,
                height: 300,
                padding: 40,
                borderColor: '#132043',
                borderWidth: 2
            }}>

                <Typography variant='h5' style={{ color: '#132043', textAlign: "center" }}><b>SignUp below</b></Typography>
                <TextField style={{ marginTop: 40 }} onChange={(e) => {
                    setEmail(e.target.value);
                }} fullWidth={true} variant="outlined" label="Email" />

                <TextField style={{ marginTop: 30 }} onChange={(e) => {
                    setPassword(e.target.value);
                }} type="password" fullWidth={true} variant="outlined" label="Password" />

                {/* Here, we have added axios instead of fetch and async ,await instead of promise */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button size={"large"} style={{ marginTop: 40, backgroundColor: "#132043" }}
                        variant="contained" onClick={async () => {

                            const res = await axios.post("http://localhost:3000/admin/signup", {
                                username: email,
                                password: password
                            })
                            const data = res.data;
                            console.log(data);
                            localStorage.setItem("token", data.token);
                            setUser({ userEmail: email, isLoading: false })
                            navigate("/courses");
                        }}>SignUp</Button>
                </div>
            </Card>
        </div>
    </div>

}

export default SignUp;
