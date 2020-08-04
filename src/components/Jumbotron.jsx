import React, { Component } from "react";
import { Button, Col, Image, Row, Modal, Form } from "react-bootstrap";
import { RiPencilLine } from "react-icons/ri";
import { FaRegBuilding, FaUniversity } from "react-icons/fa";
import { TiCameraOutline } from "react-icons/ti";
import { GiCancel } from "react-icons/gi";
import { MdAddAPhoto } from "react-icons/md";

const apiKey = process.env.REACT_APP_API;

class JumBotron extends Component {
  state = {
    profile: null,
    cover: null,
    profileInfo: {
      name: this.props.profileInfo.name,
      surname: this.props.profileInfo.surname,
      email: this.props.profileInfo.email,
      bio: this.props.profileInfo.bio,
      title: this.props.profileInfo.title,
      about: this.props.profileInfo.about,
      area: this.props.profileInfo.area,
    },
    editProfile: false,
  };
  handleUpload = async () => {
    const photo = new FormData();
    photo.append("profile", this.state.profile);

    const resp = await fetch(
      apiKey + "/api/profile/" + this.props.username + "/upload",
      {
        method: "POST",
        body: photo,
        headers: new Headers({
          Authorization: "Bearer " + this.props.authoKey,
        }),
      }
    );
    if (resp.ok) this.props.refetch();
  };
  handleCoverUpload = async () => {
    const photo = new FormData();
    photo.append("cover", this.state.cover);

    const resp = await fetch(
      apiKey + "/api/profile/" + this.props.username + "/upload/cover",
      {
        method: "POST",
        body: photo,
        headers: new Headers({
          Authorization: "Bearer " + this.props.authoKey,
        }),
      }
    );
    if (resp.ok) this.props.refetch();
  };

  editProfileInfo = async (e) => {
    e.preventDefault();
    let resp = await fetch(apiKey + "/api/profile/" + this.props.username, {
      method: "PUT",
      body: JSON.stringify(this.state.profileInfo),
      headers: new Headers({
        "Authorization": "Bearer " + this.props.authoKey,
        "Content-Type": "application/json",
      }),
    });

    if (resp.ok) {
      this.setState({ editProfile: false });
      this.handleUpload();
      this.props.refetch();
    }
  };

  addData = (event) => {
    const profileInfo = this.state.profileInfo;
    profileInfo[event.currentTarget.id] = event.currentTarget.value;
    this.setState({
      profileInfo,
    });
  };

  saveImg = (e) => {
    const profile = e.target.files[0];

    this.setState({
      profile,
    });
  };

  handleChange = (e) => {
    const profile = e.target.files[0];

    this.setState({
      profile,
    });
    setTimeout(() => this.handleUpload(), 200);
  };

  addCover = (e) => {
    const cover = e.target.files[0];

    this.setState({
      cover,
    });
    setTimeout(() => this.handleCoverUpload(), 200);
  };

  getPdf = async () => {
    const name = this.props.profileInfo.name;
    fetch(apiKey + "/api/profile/" + this.props.profileInfo.username + "/pdf", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.props.authoKey,
      },
    })
      .then(function (response) {
        return response.arrayBuffer();
      })
      .then(function (data) {
        // create a blob url representing the data
        var blob = new Blob([data]);
        var url = window.URL.createObjectURL(blob);
        // attach blob url to anchor element with download attribute
        var anchor = document.createElement("a");
        anchor.setAttribute("href", url);
        anchor.setAttribute("download", `${name}CV.pdf`);
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
  };

  render() {
    return (
      <div id='jumbotronMain' className='contentCol box-shadow '>
        <div id='cameraIcon'>
          {this.props.profileInfo.username === this.props.username && (
            <label htmlFor='coverUpload'>
              <TiCameraOutline />
            </label>
          )}
        </div>
        <div id='jumbotron'>
          {this.props.profileInfo.cover ? (
            <Image fluid className='w-100' src={this.props.profileInfo.cover} />
          ) : (
            <Image fluid className='w-100' src='/assets/jumbotronCover.jpeg' />
          )}
        </div>
        <div id='profilePhoto'>
          {this.props.profileInfo.username === this.props.username && (
            <label htmlFor='upload' id='editPhoto'>
              <MdAddAPhoto />
            </label>
          )}
          {this.props.profileInfo.image ? (
            <Image src={this.props.profileInfo.image} />
          ) : (
            <Image src='https://img.icons8.com/officel/2x/user.png' />
          )}
        </div>
        <div>
          <Row className='d-flex justify-content-between'>
            <Col md={6} className='pl-5' id='firstCol'>
              <h4>
                {this.props.profileInfo.name} {this.props.profileInfo.surname}
              </h4>
              <h5>
                {this.props.profileInfo.bio.length > 29
                  ? this.props.profileInfo.bio.slice(0, 29) + "..."
                  : this.props.profileInfo.bio}
              </h5>
              <div className='d-flex'>
                <h6 className='mr-4'>{this.props.profileInfo.area}</h6>
                <h6 className='mr-4'>
                  <p> 97 connections </p>
                </h6>
                <h6 className='mr-4'>
                  <p>Contact info</p>
                </h6>
              </div>
            </Col>
            <Col md={6} className='mt-4 d-flex flex-column'>
              <div className='align-self-end mr-4'>
                {this.props.profileInfo.username === this.props.username ? (
                  <>
                    <div className='d-flex'>
                      <Button>Add profile section</Button>
                      <Button id='secondButton' onClick={() => this.getPdf()}>
                        More ...
                      </Button>
                      <div
                        onClick={() =>
                          this.setState({
                            editProfile: !this.state.editProfile,
                          })
                        }
                      >
                        <RiPencilLine />
                      </div>
                    </div>
                    <input
                      style={{ display: "none" }}
                      type='file'
                      id='upload'
                      profile='file'
                      onChange={(e) => this.handleChange(e)}
                      accept='image/*'
                    />
                    <input
                      style={{ display: "none" }}
                      type='file'
                      id='coverUpload'
                      profile='file'
                      onChange={(e) => this.addCover(e)}
                      accept='image/*'
                    />
                  </>
                ) : (
                  <>
                    <Button>Message</Button>
                    <Button id='secondButton' onClick={() => this.getPdf()}>
                      More ...
                    </Button>
                  </>
                )}
              </div>
              <div id='status'>
                <div className='d-flex mt-4'>
                  <FaRegBuilding />
                  <p>{this.props.profileInfo.title}</p>
                </div>
                <div className='d-flex'>
                  <FaUniversity />
                  <p>--School--</p>
                </div>
              </div>
            </Col>

            <div id='moreInfo' className='ml-5 mr-5 mb-3'>
              <div id='xbutton'>
                {this.props.profileInfo.username === this.props.username && (
                  <GiCancel />
                )}
              </div>
              <p>
                <span>Show recruiters you’re open</span> to job
                opportunities—you control who sees this.
                <br></br>
                Get started
              </p>
            </div>
          </Row>
        </div>
        <Modal
          show={this.state.editProfile}
          onHide={() => this.setState({ editProfile: false })}
        >
          <>
            <Modal.Header>
              <Modal.Title>Edit this Experience</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form
                className='d-flex flex-column'
                onSubmit={this.editProfileInfo}
              >
                <Row>
                  <Col md={5}>
                    <Form.Group controlId='name'>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Name'
                        value={this.state.profileInfo.name}
                        onChange={this.addData}
                      />
                    </Form.Group>
                    <Form.Group controlId='surname'>
                      <Form.Label>Surname</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Surname'
                        value={this.state.profileInfo.surname}
                        onChange={this.addData}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={7}>
                    <Form.Group controlId='title'>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Title'
                        value={this.state.profileInfo.title}
                        onChange={this.addData}
                      />
                    </Form.Group>
                    <Form.Group controlId='area'>
                      <Form.Label>Area</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Area'
                        value={this.state.profileInfo.area}
                        onChange={this.addData}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group controlId='bio'>
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Bio'
                        value={this.state.profileInfo.bio}
                        onChange={this.addData}
                      />
                    </Form.Group>
                    <label>Image</label>
                    <input
                      style={{ color: "transparent" }}
                      type='file'
                      id='image'
                      profile='file'
                      onChange={this.saveImg}
                      accept='image/*'
                    />
                  </Col>
                  <Col md={7}>
                    <Form.Group controlId='email'>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Email'
                        value={this.state.profileInfo.email}
                        onChange={this.addData}
                      />
                    </Form.Group>
                    <Form.Group controlId='about'>
                      <Form.Label>About</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='About'
                        value={this.state.profileInfo.about}
                        onChange={this.addData}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br></br>
                <div className='d-flex justify-content-center'>
                  <Button
                    className='align-self-center mr-4'
                    variant='warning'
                    type='submit'
                  >
                    Edit
                  </Button>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </>
        </Modal>
      </div>
    );
  }
}

export default JumBotron;
