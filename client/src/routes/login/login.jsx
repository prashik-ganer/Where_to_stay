import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiRequests from "../../lib/apiRequests";
import { AuthContext } from "../../context/AuthContext";

function Login() {

  const [err, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);
  // console.log(updateUser);

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    console.log(username,password)

    // TO MAKE REQUEST TO AN API
    try{

      const res = await apiRequests.post("/auth/login",{
        username,
        password
      })

      // localStorage.setItem("user", JSON.stringify(res.data));
      updateUser(res.data)


      console.log(res)
    navigate("/");
    }catch(err){
      console.log(err)
      // setEerror
      setError(err.response.data.message)
  }finally{
    setIsLoading(false);
  }

}

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required type="password"  placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {err && <span className="error">{err}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
