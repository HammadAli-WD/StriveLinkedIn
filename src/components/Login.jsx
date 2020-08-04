import React, { Component } from "react";
import {
  Container,
  FormControl,
  Button,
  FormGroup,
  Image,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

import { FiUpload } from "react-icons/fi";

const apiKey = process.env.REACT_APP_API;

class Login extends Component {
  state = {
    photo: null,
    user: {
      username: "",
      password: "",
    },
    signup: false,
    login: true,
    newUser: {
      username: "",
      email: "",
      password: "",
    },
    profile: {
      name: "",
      surname: "",
      email: "",
      bio: "",
      title: "",
      about: "",
      area: "",
      image: "",
      username: "",
    },
    token: "",
    fromLogin: false,
  };

  setName = (e) => {
    const user = this.state.user;
    user.username = e;
    this.setState({
      user,
    });
  };

  handleUpload = async () => {
    const photo = new FormData();
    photo.append("profile", this.state.photo);

    const resp = await fetch(
      apiKey + "/api/profile/" + this.state.profile.username + "/upload",
      {
        method: "POST",
        body: photo,
        headers: new Headers({
          Authorization: "Bearer " + this.state.token,
        }),
      }
    );
  };

  setPassword = (e) => {
    const user = this.state.user;
    user.password = e;
    this.setState({
      user,
    });
  };

  handleChange = (e) => {
    const newUser = this.state.newUser;
    newUser[e.currentTarget.id] = e.currentTarget.value;
    this.setState({
      newUser,
    });
  };

  handleChangeProfile = (e) => {
    const profile = this.state.profile;
    profile[e.currentTarget.id] = e.currentTarget.value;
    this.setState({
      profile,
    });
  };

  fetchUser = async () => {
    let resp = await fetch(apiKey + "/user/login", {
      method: "POST",
      body: JSON.stringify(this.state.user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (resp.ok) {
      const data = await resp.json();
      this.props.getAuthorization(data.token, data.username);
      this.props.history.push("/profiles/" + data.username);
      this.props.showApp();
    } else {
      this.setState({ signup: true, fromLogin: true });
    }
  };

  componentDidMount = () => {
    localStorage.removeItem("authorizationKey");
    localStorage.removeItem("username");
    this.props.resetAuthorization();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchUser();
  };

  addNewUser = async (e) => {
    e.preventDefault();
    const resp = await fetch(apiKey + "/user/signup", {
      method: "POST",
      body: JSON.stringify(this.state.newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.ok) {
      const data = await resp.json();
      const profile = this.state.profile;
      profile.email = data.addUser.email;
      profile.username = data.addUser.username;
      this.setState({
        token: data.token,
        profile,
        signup: false,
      });
    }
  };

  addPhoto = (e) => {
    const photo = e.target.files[0];

    this.setState({
      photo,
    });
  };

  addNewProfile = async (e) => {
    e.preventDefault();
    const resp = await fetch(apiKey + "/api/profile", {
      method: "POST",
      body: JSON.stringify(this.state.profile),
      headers: new Headers({
        "Authorization": "Bearer " + this.state.token,
        "Content-Type": "application/json",
      }),
    });
    const photo = new FormData();
    photo.append("profile", this.state.photo);
    const user = await resp.json();

    const resp2 = await fetch(
      apiKey + "/api/profile/" + user.username + "/upload",
      {
        method: "POST",
        body: photo,
        headers: new Headers({
          Authorization: "Bearer " + this.state.token,
        }),
      }
    );
    if (resp2.ok) {
      this.props.getAuthorization(
        this.state.token,
        this.state.profile.username
      );
      this.props.history.push("/profiles/" + this.state.profile.username);
      this.props.showApp();
    }
  };

  render() {
    return (
      <Container id='logingPage' className='d-flex justify-content-center '>
        {this.state.login ? (
          <div className='Login'>
            <Image
              className='mb-3'
              src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
            />
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId='name' bsSize='large'>
                <label>Email</label>
                <FormControl
                  autoFocus
                  type='name'
                  value={this.state.name}
                  onChange={(e) => this.setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup controlId='password' bsSize='large'>
                <label>Password</label>
                <FormControl
                  value={this.state.password}
                  onChange={(e) => this.setPassword(e.target.value)}
                  type='password'
                />
              </FormGroup>
              <Button block bsSize='large' type='submit'>
                Login
              </Button>
              <div className='d-flex justify-content-center mt-2'>
                <Button
                  id='createAccLink'
                  onClick={() =>
                    this.setState({
                      signup: !this.state.signup,
                      fromLogin: false,
                    })
                  }
                >
                  Create an account
                </Button>
              </div>
              {this.state.signup ? (
                <>
                  <div className='mt-5'>
                    {this.state.fromLogin ? (
                      <Alert variant='warning'>
                        "We cannot find users with this credentials"
                      </Alert>
                    ) : (
                      <div className='d-flex justify-content-center'>
                        <Button
                          variant='info'
                          onClick={() =>
                            this.setState({ login: false, signup: true })
                          }
                        >
                          Create a new User
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </form>
          </div>
        ) : (
          <>
            {this.state.signup ? (
              <div className='Login'>
                <Image
                  className='mb-3'
                  src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
                />
                <form onSubmit={this.addNewUser}>
                  <FormGroup controlId='username' bsSize='large'>
                    <label>Username</label>
                    <FormControl
                      autoFocus
                      id='username'
                      type='text'
                      value={this.state.newUser.username}
                      onChange={(e) => this.handleChange(e)}
                    />
                  </FormGroup>
                  <FormGroup controlId='email' bsSize='large'>
                    <label>Email</label>
                    <FormControl
                      value={this.state.newUser.email}
                      onChange={(e) => this.handleChange(e)}
                      type='text'
                      id='email'
                    />
                  </FormGroup>
                  <FormGroup controlId='password' bsSize='large'>
                    <label>Password</label>
                    <FormControl
                      value={this.state.newUser.password}
                      onChange={(e) => this.handleChange(e)}
                      type='password'
                      id='password'
                    />
                  </FormGroup>
                  <Button block bsSize='large' type='submit'>
                    Sign Up
                  </Button>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: "35vh" }}>
                <Container className='d-flex justify-content-center'>
                  <Row>
                    <Col className='d-flex align-items-center mr-5'>
                      <label htmlFor='profilePhoto'>
                        <FiUpload
                          style={{ fontSize: "55px", color: "#0073B1" }}
                        />
                      </label>
                    </Col>
                    <form onSubmit={this.addNewProfile}>
                      <input
                        style={{ display: "none" }}
                        type='file'
                        id='profilePhoto'
                        profile='file'
                        onChange={(e) => this.addPhoto(e)}
                        accept='image/*'
                      />
                      <Container>
                        <Image
                          src='https://cdn.worldvectorlogo.com/logos/linkedin.svg'
                          className='mb-3'
                          style={{ width: "150px" }}
                        />
                        <Row>
                          <Col>
                            <FormGroup controlId='name' bsSize='large'>
                              <label>Name</label>
                              <FormControl
                                autoFocus
                                id='name'
                                type='text'
                                value={this.state.profile.name}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup controlId='surname' bsSize='large'>
                              <label>Surname</label>
                              <FormControl
                                autoFocus
                                id='surname'
                                type='text'
                                value={this.state.profile.surname}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup controlId='about' bsSize='large'>
                              <label>About You</label>
                              <FormControl
                                autoFocus
                                id='about'
                                type='text'
                                value={this.state.profile.about}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                          </Col>
                          <Col>
                            <FormGroup controlId='bio' bsSize='large'>
                              <label>Bio</label>
                              <FormControl
                                autoFocus
                                id='bio'
                                type='text'
                                value={this.state.profile.bio}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup controlId='title' bsSize='large'>
                              <label>Title</label>
                              <FormControl
                                autoFocus
                                id='title'
                                type='text'
                                value={this.state.profile.title}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                            <FormGroup controlId='area' bsSize='large'>
                              <label>Area</label>
                              <FormControl
                                autoFocus
                                id='area'
                                type='text'
                                value={this.state.profile.area}
                                onChange={(e) => this.handleChangeProfile(e)}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button block bsSize='small' type='submit'>
                          Add Info
                        </Button>
                      </Container>
                    </form>
                  </Row>
                </Container>
              </div>
            )}
          </>
        )}
      </Container>
    );
  }
}

export default Login;
