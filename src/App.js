import "./App.css";
import Header from "./Header";
import Profile from "./Profile/Profile";
import Register from './Register/Register';
import Login from './Login/Login';
import Messages from "./Messages/Messages";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TinderCards from "./TinderCards";
import SwipeButtons from "./SwipeButtons";

function App() {
  return (
    <Router>

      <Switch>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/profile">
          <Profile />
        </Route>

        <Route path="/messages">
          <Messages />
        </Route>

        <Route path="/">
          <div className="App">
            <Header />
            <TinderCards />
            <SwipeButtons />
          </div>
        </Route>

      </Switch>

    </Router>
  );
}

export default App;
