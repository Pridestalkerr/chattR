import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';


export default () => {
  return (
    <Router>
      <div className='h-100 w-100'>
        <Switch>
          {/* <Route path='/friends'>friends</Route> */}
          {/* <Route path='/channel/:id'>channel</Route> */}
          <Route path='/login'><Login></Login></Route>
          <Route path='/register'><Register></Register></Route>
          <Route path='/'><Home></Home></Route>
        </Switch>
      </div>
    </Router>
  );
};
