import axios from "axios";

const signup = async()=>{
    try {
        const response = await axios.post('http://localhost:8080/api/signup',{
            name:"Smith Johnson",
            email:"smith@example.com",
            password:"password",
            address:"123 Main St",
            role:"normal_user"
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// signup();
const login = async()=>{
    try {
        const response =await axios.post("http://localhost:8080/api/login",{
            email:"smith@example.com",
            password:"password",
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

login();