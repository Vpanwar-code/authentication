import { useState, useRef ,useContext} from 'react';
import AuthContext from '../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const AuthForm = () => {

  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext); 

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) =>{
      event.preventDefault();
      const enteredEmail = emailInputRef.current.value;
      const enteredPassword = passwordInputRef.current.value;

      setIsLoading(true);
      let url;
      if(isLogin){
url='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA6vI7zDzUjJTs0TdsrKZpnlnZz7kaRYMI'
      }else
      {
        url='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA6vI7zDzUjJTs0TdsrKZpnlnZz7kaRYMI'
       }
       fetch(url,
        {
          method : 'POST',
          body : JSON.stringify({
            email : enteredEmail,
            password : enteredPassword,
          }),
          headers : {
            'Content-Type': 'application/json',
          },

        }
      ).then((res)=>{
        setIsLoading(false);
        if(res.ok){
          return res.json();
        }
        else{
          return res.json().then((data)=>{
            let errorMessage = 'Authentication Falied';
            throw new Error(errorMessage);
          });
        }
      }).then(data =>{
        authCtx.login(data.idToken);
        history.replace('/')
      }).catch(err =>{
        alert(err.message);
      })
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
          ref = {passwordInputRef}/>
        </div>
        <div className={classes.actions}>
         {!isLoading && <button type='submit'>{isLogin ? 'Login' : 'Create Account'}</button>}
         {isLoading && <p>Sending Request...</p>} 
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
