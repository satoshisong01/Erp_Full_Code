import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loginActive } from '../LoginActions';
import store from '../../../store/configureStore'; //store

const Login = (props) => {
	const [userInfo, setUserInfo] = useState({ id: '',  pw: '' }); //rhdxhd12

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserInfo((prevForm) => ({ ...prevForm, [name]: value }));
	};

  	const handleSubmit = (e) => {
		e.preventDefault();

		const loginUrl = '/api/actionLoginJWT.do';
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(userInfo)
		};

		console.log("id: ", userInfo.id , " pw:", userInfo.pw);

		fetch(loginUrl, requestOptions)
			.then((res) => res.json())
			.then((resp) => {
				let resultVO = resp.resultVO; //없음
				let jToken = resp.jToken; //resp?.jToken;

				localStorage.setItem('jToken', jToken);

				if (Number(resp.resultCode) === 200) {
					console.log(" login 완료 ");
					sessionStorage.setItem('loginUser', JSON.stringify(resultVO)); //아직 resultVO 없음
					store.dispatch(loginActive(true)) //login

					props.loginCheck(true); //login

				} else {
					return alert('로그인 실패');
				}
		})
		.catch((error) => {
			console.error('login error!', error);
		});
  	};

  return (
    <div id="extr-page">
      <header id="header" className="animated fadeInDown">
        <div id="logo-group">
          <span id="logo">
            {' '}
            <img src="assets/img/logo.png" alt="SmartAdmin" />{' '}
          </span>
        </div>

        <span id="extr-page-header-space">
          {' '}
          <span className="hidden-mobile hiddex-xs">Need an account?</span>
          &nbsp;
          <a href="#/register" className="btn btn-danger">
            Create account
          </a>{' '}
        </span>
      </header>
      <div id="main" role="main" className="animated fadeInDown">
        <div id="content" className="container">
          <div className="row">
            <div
              className="col-xs-12 col-sm-12 col-md-5 col-lg-5"
              style={{ margin: '0 auto', float: 'unset' }}
            >
              <div className="well no-padding">
                <form
				// action="#/tables/easy-tables"
                  id="login-form"
                  className="smart-form client-form"
                  onSubmit={handleSubmit}
                >
                  <header>Sign In</header>
                  <fieldset>
						<section>
							<label className="label">아이디</label>
							<label className="input">
								{' '}
								<i className="icon-append fa fa-user" />
								<input
									type="text"
									name="id"
									data-smart-validate-input=""
									data-required=""
									data-message-required="Please enter your id"
									data-message-id="Please enter a VALID id"
									onChange={handleChange}
								/>
								{/* tooltip 안됨 */}
								<b className="tooltip tooltip-top-right">
									<i className="fa fa-user txt-color-teal" />
									Please enter id/username
								</b>
							</label>
						</section>
                    <section>
						<label className="label">비밀번호</label>
						<label className="input">
							{' '}
							<i className="icon-append fa fa-lock" />
							<input
								type="password"
								name="pw"
								data-smart-validate-input=""
								data-required=""
								data-minlength="3"
								data-maxnlength="20"
								data-message="Please enter your password"
								onChange={handleChange}
							/>
							<b className="tooltip tooltip-top-right">
							<i className="fa fa-lock txt-color-teal" />
								Enter your password
							</b>{' '}
						</label>
                    </section>
                    <section style={{ display: 'flex', width: '100%' }}>
                      <div className="" style={{ flex: 1 }}>
                        <a href="#/forgot">Forgot password?</a>
                      </div>
                      <div>
                        <label
                          className="checkbox"
                          style={{
							border: 'none',
							width: '100%',
							margin: 0,
							float: 'left',
							flex: 1,
                          }}
                        >
                          <input
							type="checkbox"
							name="remember"
							defaultChecked={true}
                          />
                          <i /> Remember me
                        </label>
                      </div>
                    </section>
                  </fieldset>
                  <footer>
                    <button type="submit" className="btn btn-primary">
                      Sign in
                    </button>
                  </footer>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;