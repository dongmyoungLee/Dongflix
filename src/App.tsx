import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import Movie from "./Routes/Movies/Movie";
import Tv from "./Routes/Tvs/Tv";
import Search from "./Routes/Search";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path={"/tv"}>
          <Tv />
        </Route>
        <Route path={"/search"}>
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Movie />
        </Route>
        {/* react-router가 두 개의 path에서 같은 component를 rendering 하도록 할 수 있음 */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
