import React, { Component } from "react";
import { Modal, Image, Form, Button, Row, Col } from "react-bootstrap";
import { RiPencilLine, RiDownloadLine } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import "./MainCss.css";

const apiKey = process.env.REACT_APP_API;

class Experiences extends Component {
  state = {
    userExperiences: "",
    userID: this.props.userID,
    showModal: false,
    addExperience: false,
    editExperience: false,
    editElementId: "",
    newExperience: {
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      area: "",
      username: this.props.userID,
    },
    image: "",
  };

  handleChange = (event) => {
    const newExperience = this.state.newExperience;

    newExperience[event.currentTarget.id] = event.currentTarget.value;
    this.setState({
      newExperience,
    });
  };
  saveImg = (event) => {
    let photo = new FormData();
    photo.append("picture", event.target.files[0]);
    this.setState({
      image: photo,
    });
  };

  fetchUserExp = async () => {
    let resp = await fetch(
      apiKey + "/api/profile/" + this.props.userID + "/experiences/",
      {
        headers: new Headers({
          "Authorization": "Basic " + this.props.authoKey,
          "Content-Type": "application/json",
        }),
      }
    )
      .then((resp) => resp.json())
      .then((respObj) =>
        respObj.filter((exp) => exp._id === this.state.editElementId)
      )
      .then((data) => {
        const newExperience = this.state.newExperience;
        newExperience.role = data[0].role;
        newExperience.company = data[0].company;
        newExperience.description = data[0].description;
        newExperience.startDate = data[0].startDate.slice(0, 10);
        newExperience.endDate = data[0].endDate;
        newExperience.area = data[0].area;
        newExperience.username = data[0].username;
        this.setState({
          newExperience,
        });
      });
  };

  editTheExperience = async (e) => {
    e.preventDefault();
    let resp = await fetch(
      apiKey +
        "/api/profile/" +
        this.props.userID +
        "/experiences/" +
        this.state.editElementId,
      {
        method: "PUT",
        body: JSON.stringify(this.state.newExperience),
        headers: new Headers({
          "Authorization": "Basic " + this.props.authoKey,
          "Content-Type": "application/json",
        }),
      }
    );

    if (resp.ok) {
      this.setState({
        showModal: false,
        addExperience: false,
        editExperience: false,
      });
    }
    let resp2 = await fetch(
      apiKey +
        "/api/profile/" +
        this.props.userID +
        "/experiences/" +
        this.state.editElementId +
        "/picture",
      {
        method: "POST",
        body: this.state.image,
        headers: new Headers({
          Authorization: "Basic " + this.props.authoKey,
        }),
      }
    );

    if (resp2.ok) {
      this.fetchuserExperiences();
    }
  };

  deleteExperience = async (id) => {
    let resp = await fetch(
      apiKey + "/api/profile/" + this.props.userID + "/experiences/" + id,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: "Basic " + this.props.authoKey,
        }),
      }
    );

    if (resp.ok) {
      this.setState({
        showModal: false,
        addExperience: false,
        editExperience: false,
        newExperience: {
          role: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
          area: "",
          username: this.props.userID,
        },
      });
      await this.fetchuserExperiences();
    }
  };

  handleSubimt = async (e) => {
    e.preventDefault();

    let resp = await fetch(
      apiKey + "/api/profile/" + this.props.userID + "/experiences",
      {
        method: "POST",
        body: JSON.stringify(this.state.newExperience),
        headers: new Headers({
          "Authorization": "Basic " + this.props.authoKey,
          "Content-Type": "application/json",
        }),
      }
    );

    if (resp.ok) {
      this.setState({
        showModal: false,
        addExperience: false,
        editExperience: false,
      });
    }

    const id = await resp.json();

    let resp2 = await fetch(
      apiKey +
        "/api/profile/" +
        this.props.userID +
        "/experiences/" +
        id +
        "/picture",
      {
        method: "POST",
        body: this.state.image,
        headers: new Headers({
          Authorization: "Basic " + this.props.authoKey,
        }),
      }
    );

    if (resp2.ok) {
      this.fetchuserExperiences();
    }
  };

  fetchuserExperiences = async () => {
    await fetch(apiKey + "/api/profile/" + this.props.userID + "/experiences", {
      headers: new Headers({
        "Authorization": "Basic " + this.props.authoKey,
        "Content-Type": "application/json",
      }),
    })
      .then((resp) => resp.json())
      .then((respObj) =>
        this.setState({
          userExperiences: respObj,
        })
      );
  };

  componentDidMount = async () => {
    this.fetchuserExperiences();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.state.userID !== this.props.userID) {
      this.setState({ userID: this.props.userID }, async () => {
        await fetch(
          apiKey + "/api/profile/" + this.props.userID + "/experiences",
          {
            headers: new Headers({
              "Authorization": "Basic " + this.props.authoKey,
              "Content-Type": "application/json",
            }),
          }
        )
          .then((resp) => resp.json())
          .then((respObj) =>
            this.setState({
              userExperiences: respObj,
            })
          );
      });
    } else if (prevState.userExperiences !== this.state.userExperiences) {
      this.setState({
        userExperiences: this.state.userExperiences,
      });
    }
  };

  getExpCsv = () => {
    const username = this.props.userID;
    fetch(apiKey + "/api/profile/" + this.props.userID + "/experiences/CSV", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.props.authoKey,
      },
    })
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then(function (data) {
        var blob = new Blob([data]);
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.setAttribute("href", url);
        anchor.setAttribute("download", `${username}Experiences.csv`);
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
  };

  render() {
    return (
      <>
        <div className='mainContent p-4 mb-3 box-shadow '>
          <div className='d-flex justify-content-between'>
            <h4>Experiences</h4>
            <div className='d-flex justify-content-between'>
              {this.props.userID === this.props.username && (
                <div
                  onClick={() =>
                    this.setState({
                      showModal: true,
                      addExperience: true,
                    })
                  }
                >
                  <AiOutlinePlus />
                </div>
              )}
              <div onClick={() => this.getExpCsv()}>
                <RiDownloadLine />
              </div>
            </div>
          </div>
          {this.state.userExperiences &&
            this.state.userExperiences.map((user, i) => (
              <div key={i} className='pt-4'>
                <div
                  id='experienceContent'
                  className='d-flex justify-content-between'
                >
                  <div className='d-flex align-items-center '>
                    <div id='iconDiv'>
                      {user.image ? (
                        <Image src={user.image}></Image>
                      ) : (
                        <Image src='https://lunawood.com/wp-content/uploads/2018/02/placeholder-image.png'></Image>
                      )}
                    </div>
                    <div className='ml-4'>
                      <h5>{user.role}</h5>
                      <p>{user.company}</p>
                      <p>{user.description}</p>
                      <p>{user.startDate.slice(0, 10)}</p>
                    </div>
                  </div>

                  <div>
                    {this.props.userID === this.props.username && (
                      <div
                        onClick={() => {
                          this.setState({
                            showModal: true,
                            editExperience: true,
                            editElementId: user._id,
                          });
                          this.fetchUserExp();
                        }}
                      >
                        <RiPencilLine />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          <Modal
            show={this.state.showModal}
            onHide={() =>
              this.setState({
                showModal: false,
                addExperience: false,
                editExperience: false,
                newExperience: {
                  role: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  area: "",
                  username: this.props.userID,
                },
              })
            }
          >
            {this.state.addExperience && (
              <>
                <Modal.Header>
                  <Modal.Title>Add a new Experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
                    className='d-flex flex-column'
                    onSubmit={this.handleSubimt}
                  >
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId='role'>
                          <Form.Label>Role</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='What is/was your role..'
                            value={this.state.newExperience.role}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='startDate'>
                          <Form.Label>Starting Date</Form.Label>
                          <Form.Control
                            type='date'
                            value={this.state.newExperience.startDate}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId='company'>
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Where did you work..'
                            value={this.state.newExperience.company}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='endDate'>
                          <Form.Label>Ending Date</Form.Label>
                          <Form.Control
                            type='date'
                            value={this.state.newExperience.endDate}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId='description'>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='What did you actually do..'
                            value={this.state.newExperience.description}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='area'>
                          <Form.Label>Area</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='State..'
                            value={this.state.newExperience.area}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <label>Image</label>
                    <input
                      type='file'
                      id='image'
                      profile='file'
                      onChange={this.saveImg}
                      accept='image/*'
                    />
                    <br></br>
                    <Button
                      className='align-self-center'
                      variant='primary'
                      type='submit'
                    >
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
              </>
            )}
            {this.state.editExperience && (
              <>
                <Modal.Header>
                  <Modal.Title>Edit this Experience</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form
                    className='d-flex flex-column'
                    onSubmit={this.editTheExperience}
                  >
                    <Row>
                      <Col md={6}>
                        <Form.Group controlId='role'>
                          <Form.Label>Role</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='What is/was your role..'
                            value={this.state.newExperience.role}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='startDate'>
                          <Form.Label>Starting Date</Form.Label>
                          <Form.Control
                            type='date'
                            value={this.state.newExperience.startDate}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId='company'>
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Where did you work..'
                            value={this.state.newExperience.company}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='endDate'>
                          <Form.Label>Ending Date</Form.Label>
                          <Form.Control
                            type='date'
                            value={this.state.newExperience.endDate}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group controlId='description'>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='What did you actually do..'
                            value={this.state.newExperience.description}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                        <Form.Group controlId='area'>
                          <Form.Label>Area</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='State..'
                            value={this.state.newExperience.area}
                            onChange={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <label>Image</label>
                    <input
                      type='file'
                      id='image'
                      profile='file'
                      onChange={this.saveImg}
                      accept='image/*'
                    />
                    <br></br>
                    <div className='d-flex justify-content-center'>
                      <Button
                        className='align-self-center mr-4'
                        variant='warning'
                        type='submit'
                      >
                        Edit
                      </Button>
                      <Button
                        className='align-self-center'
                        variant='danger'
                        onClick={() =>
                          this.deleteExperience(this.state.editElementId)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
              </>
            )}
          </Modal>
        </div>
      </>
    );
  }
}

export default Experiences;
