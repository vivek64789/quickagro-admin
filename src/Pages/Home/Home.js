import Categories from "./Categories";
import Chats from "./Chats";
import Coupons from "./Coupons";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Products from "./Products";
import Users from "./Users";
import "./Home.css";
import "./HomeContents.css";
import { Route } from "react-router-dom";
import NavButton from "../../Components/NavButton";
import NavBar from "../../Components/NavBar";
import Bundles from "./Bundles";
import { useHistory } from "react-router-dom";
import ProductRequests from "./ProductRequests";
import Notices from "./Notices";
import MailSettings from "./MailSettings";

function Home() {
  const history = useHistory();
  if (!localStorage.getItem("token")) {
    history.push("/login");
  }

  return (
    <div className="home-container">
      <NavBar />
      <div className="main">
        <div className="menu">
          <ul className="column">
            <div>
              <NavButton
                icon="dashboard"
                title="Dashboard"
                path="/"
              ></NavButton>
              <NavButton
                icon="cube"
                title="Products"
                path="/products"
              ></NavButton>
              <NavButton
                icon="cubes"
                title="Bundles"
                path="/bundles"
              ></NavButton>
              <NavButton
                icon="list"
                title="Categories"
                path="/categories"
              ></NavButton>
              <NavButton
                icon="ticket"
                title="Coupons"
                path="/coupons"
              ></NavButton>
              <NavButton
                icon="shopping-bag"
                title="Orders"
                path="/orders"
              ></NavButton>
              <NavButton
                icon="clipboard"
                title="Product Requests"
                path="/product-requests"
              ></NavButton>
              <NavButton icon="user" title="Users" path="/users"></NavButton>
              <NavButton
                icon="comments"
                title="Chats"
                path="/chats"
              ></NavButton>
              <NavButton
                icon="bell"
                title="Notices"
                path="/notices"
              ></NavButton>
              <NavButton
                icon="envelope"
                title="Mail Settings"
                path="/mail-settings"
              ></NavButton>
            </div>
            <NavButton icon="sign-out" title="Logout" path="/login"></NavButton>
          </ul>
        </div>
        <div className="content">
          <Route path="/" exact component={Dashboard} />
          <Route path="/products" component={Products} />
          <Route path="/categories" component={Categories} />
          <Route path="/bundles" component={Bundles} />
          <Route path="/orders" component={Orders} />
          <Route path="/coupons" component={Coupons} />
          <Route path="/product-requests" component={ProductRequests} />
          <Route path="/users" component={Users} />
          <Route path="/chats" component={Chats} />
          <Route path="/notices" component={Notices} />
          <Route path="/mail-settings" component={MailSettings} />
        </div>
      </div>
    </div>
  );
}

export default Home;
