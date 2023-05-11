import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				id: '',
				password: '',
				userSe: 'USR'
			}
		};
	}

	handleChange(e) {
		const {name, value} = e.target;
		this.setState({ ...this.state.form, [name]: value });
	};

	handleSubmit(e) {
		console.log("this.state.form > ", this.state.form);


		// const SERVER_URL = "http://192.168.0.123:8080" //전역변수로 바꾸기
		const SERVER_URL = "http://localhost:8080"
		const loginUrl = "/uat/uia/actionLoginJWT.do"
		const requestOptions = {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(...this.state.form)
		}

		fetch(SERVER_URL + loginUrl, requestOptions)
			.then(res => {
				return res.json();
			})
			.then((resp) => {
				if (Number(resp.resultCode) === 200) {
					alert("Login Alert🌞");
					//라우터파일에 /admin/으로 시작하는 URL은 모두 인증없이 접근 할 때 경고창이 나오도록 조치했기 때문에 제외했음.
					// sessionStorage.setItem('loginUser', JSON.stringify({"id":""}));
					// window.location.href = URL.LOGIN;
					return false;
				} else {
					return resp;
				}
			})
			.catch(error => {
				console.error("login error!", error);
			})

	};

	render() {
		return (
			<div id="extr-page">
				<header id="header" className="animated fadeInDown">
					<div id="logo-group">
						<span id="logo">
							{" "}
							<img src="assets/img/logo.png" alt="SmartAdmin" />{" "}
						</span>
					</div>

					<span id="extr-page-header-space">
						{" "}
						<span className="hidden-mobile hiddex-xs">Need an account?</span>
						&nbsp;
						<a href="#/register" className="btn btn-danger">
							Create account
						</a>{" "}
					</span>
				</header>
				<div id="main" role="main" className="animated fadeInDown">
					<div id="content" className="container">
						<div className="row">
							<div className="col-xs-12 col-sm-12 col-md-5 col-lg-5" style={{ margin: "0 auto", float: 'unset'}}>
								<div className="well no-padding">
										<form
											// action="#/dashboard"
											action="#/tables/easy-tables"
											id="login-form"
											className="smart-form client-form"
											onSubmit={this.handleSubmit.bind(this)}
										>
											<header>Sign In</header>
											<fieldset>
												<section>
													<label className="label">아이디</label>
													<label className="input">
														{" "}
														<i className="icon-append fa fa-user" />
														<input
															type="text"
															name="id"
															data-smart-validate-input=""
															data-required=""
															data-message-required="Please enter your id"
															data-message-id="Please enter a VALID id" //형식이 틀릴때 나오는 메세지
															onChange={this.handleChange.bind(this)}
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
														{" "}
														<i className="icon-append fa fa-lock" />
														<input
															type="password"
															name="password"
															data-smart-validate-input=""
															data-required=""
															data-minlength="3"
															data-maxnlength="20"
															data-message="Please enter your password"
															onChange={this.handleChange.bind(this)}
														/>
														<b className="tooltip tooltip-top-right">
															<i className="fa fa-lock txt-color-teal" />
															Enter your password
														</b>{" "}
													</label>

												</section>
												<section style={{ display: "flex", width: "100%" }}>
												{/* <section> */}
													{/* <div className="note"> */}
													<div className="" style={{flex: 1}}>
														<a href="#/forgot">Forgot password?</a>
													</div>
													<div>
														<label className="checkbox" style={{ border: "none", width: "100%", margin: 0, float: "left", flex: 1}}>
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
						{/* row */}
						</div>
						{/* container */}
					</div>
				{/* main */}
				</div>
			{/* extr-page */}
			</div>
			
		);
	}
}