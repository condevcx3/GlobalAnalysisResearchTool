import React  from 'react';
import {Link} from 'react-router-dom';

const SignedOutLinks = () => {
  return (
    <nav className = "navbar navbar-expand-lg navbar-dark bg-primary">
      <div className = "container">
        <Link to = '/login' className = "navbar-brand">Login</Link>
      </div>
    </nav>
  );
}

export default SignedOutLinks
