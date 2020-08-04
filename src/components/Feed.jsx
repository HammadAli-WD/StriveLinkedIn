import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Modal,
  FormControl,
  Button,
} from "react-bootstrap";
import FeedContent from "./FeedContent";
import FeedPosts from "./FeedPosts";
import RightSideFeed from "./RightSideFeed";
import LeftSideBar from "./LeftSideBar";
import { TiCameraOutline } from "react-icons/ti";
import { BsCameraVideo, BsPencilSquare } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

const apiKey = process.env.REACT_APP_API;

class Feed extends Component {
  state = {
    feeds: [],
    loading: true,
    showModal: false,
    newPost: {
      text: "",
      username: this.props.username,
    },
    image: "",
  };

  fetchPosts = async () => {
    await fetch(apiKey + "/api/posts/", {
      headers: new Headers({
        "Authorization": "Bearer " + this.props.authoKey,
        "Content-Type": "application/json",
      }),
    })
      .then((resp) => resp.json())
      .then((respObj) =>
        this.setState({
          feeds: respObj.reverse(),
          loading: false,
        })
      );
  };

  getSinglePost = async (id) => {
    let resp = await fetch(apiKey + "/api/posts/" + id);
    if (resp.ok) {
      const post = await resp.json();
      this.setState({ newPost: post, showModal: true });
    }
  };

  saveImg = (event) => {
    let photo = new FormData();
    photo.append("avatar", event.target.files[0]);
    this.setState({
      image: photo,
    });
  };

  componentDidMount() {
    this.fetchPosts();
  }

  reFetchData = () => {
    this.fetchPosts();
  };

  showModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  newPostHandler = (event) => {
    const newPost = this.state.newPost;
    newPost.text = event.currentTarget.value;
    this.setState({
      newPost,
    });
  };

  postNewPost = async () => {
    const id = this.state.newPost._id;

    if (this.state.newPost._id) {
      const resp = await fetch(apiKey + "/api/posts/" + id, {
        method: "PUT",
        body: JSON.stringify(this.state.newPost),
        headers: new Headers({
          "Authorization": "Bearer " + this.props.authoKey,
          "Content-Type": "application/json",
        }),
      });
      if (resp.ok) {
        this.setState({
          showModal: false,
          newPost: {
            text: "",
            username: this.props.username,
          },
        });
        this.fetchPosts();
      }

      const resp2 = await fetch(apiKey + "/api/posts/" + id + "/upload", {
        method: "POST",
        body: this.state.image,
        headers: new Headers({
          Authorization: "Bearer " + this.props.authoKey,
        }),
      });

      if (resp2.ok) this.fetchPosts();
    } else {
      const resp = await fetch(apiKey + "/api/posts/", {
        method: "POST",
        body: JSON.stringify(this.state.newPost),
        headers: new Headers({
          "Authorization": "Bearer " + this.props.authoKey,
          "Content-Type": "application/json",
        }),
      });

      if (resp.ok) this.setState({ showModal: false });
      const id = await resp.json();

      const resp2 = await fetch(apiKey + "/api/posts/" + id + "/upload", {
        method: "POST",
        body: this.state.image,
        headers: new Headers({
          Authorization: "Bearer " + this.props.authoKey,
        }),
      });

      if (resp2.ok) this.fetchPosts();
    }
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.feeds !== this.state.feeds) {
      this.setState({
        feeds: this.state.feeds,
      });
    }
  };

  render() {
    return (
      <Container className='content mt-4 mb-4'>
        {this.state.loading ? (
          <>
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ width: "100%", height: "100vh" }}
            >
              <Spinner
                style={{ fontSize: "200px" }}
                animation='grow'
                variant='secondary'
              />
            </div>
          </>
        ) : (
          <Row>
            {this.state.feeds && (
              <>
                <Col md={3} className='d-flex flex-column mb-3'>
                  {this.props.users &&
                    this.props.users
                      .filter((user) => user.username === this.props.username)
                      .map((user, i) => (
                        <LeftSideBar key={user._id} info={user} />
                      ))}
                </Col>
                <Col md={6} className='d-flex flex-column mb-3 '>
                  <FeedContent addNewPost={this.showModal} />
                  {this.state.feeds &&
                    this.props.users &&
                    this.state.feeds.map((post, i) => (
                      <>
                        <FeedPosts
                          username={this.props.username}
                          getSinglePost={this.getSinglePost}
                          key={post._id}
                          reFetchData={this.reFetchData}
                          users={this.props.users}
                          authoKey={this.props.authoKey}
                          loading={this.state.loading}
                          userImage={this.props.userImage}
                          info={post}
                        />
                      </>
                    ))}
                </Col>
                <Col md={3} className='sideContent'>
                  <RightSideFeed />
                </Col>
              </>
            )}
          </Row>
        )}
        <Modal
          show={this.state.showModal}
          onHide={() =>
            this.setState({
              showModal: false,
              newPost: {
                text: "",
                username: this.props.username,
              },
            })
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>Create a post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              type='text'
              onChange={this.newPostHandler}
              value={this.state.newPost.text}
              placeholder='What do you want to talk about?'
              className='mr-sm-2'
            />
          </Modal.Body>
          <div className='d-flex justify-content-between'>
            <div className='modalIcons p-3 d-flex'>
              <AiOutlinePlus />
              <div>
                <label htmlFor='upload'>
                  <TiCameraOutline />
                </label>
              </div>
              <input
                style={{ display: "none" }}
                type='file'
                id='upload'
                profile='file'
                onChange={this.saveImg}
                accept='image/*'
              />
              <BsCameraVideo />
              <FiFileText />
            </div>
            <div className='p-3 '>
              <Button onClick={this.postNewPost}>POST</Button>
            </div>
          </div>
        </Modal>
      </Container>
    );
  }
}

export default Feed;
