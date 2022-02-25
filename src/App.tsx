import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path={["/", "/movies/:movieId"]}></Route>
        <Route path={"/tv"}></Route>
        <Route path={"/search"}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
