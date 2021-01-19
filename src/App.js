//Styles
import "./App.css";

//Components
import Main from "./Main/Main";
import Register from "./Register/Register";
import Login from "./Login/Login";
import LandingPage from "./LandingPage/LandingPage";

//NPMs
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

//Declared
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import PrivateRoute from "./private-route/PrivateRoute";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser);
    window.location.href = "/";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/register">
            <Register />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <PrivateRoute exact path="/app/profile" component={Main} />

          <PrivateRoute exact path="/app/messages/:id" component={Main} />

          <PrivateRoute exact path="/app" component={Main} />

          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
