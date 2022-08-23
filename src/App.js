import "./App.css";
import { Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";

function App() {
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
}

export default App;
