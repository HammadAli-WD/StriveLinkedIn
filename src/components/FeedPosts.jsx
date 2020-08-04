import React, { Component } from "react";
import { Image, ListGroup, Dropdown, Accordion, Button } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { FaShare } from "react-icons/fa";

const apiKey = process.env.REACT_APP_API;

class FeedPosts extends Component {
		state = {
				clicked: false,
				showDropdown: false,
				comments: [],
				newComment: {
						comment: "",
						user: this.props.userImage[0]._id,
						postid: this.props.info._id,
				},
		};

		deletePost = async (id) => {
				const resp = await fetch(apiKey + "/api/posts/" + id, {
						method: "DELETE",
						headers: new Headers({
								Authorization: "Bearer " + this.props.authoKey,
						}),
				});
				if (resp.ok) {
						this.setState({
								showDropdown: false,
						});
						this.props.reFetchData();
				} else {
						this.setState({
								showDropdown: false,
						});
				}
		};

		deleteComment = async (id) => {
				const resp = await fetch(apiKey + "/api/comments/" + id, {
						method: "DELETE",
						headers: new Headers({
								Authorization: "Bearer " + this.props.authoKey,
						}),
				});
				if (resp.ok) {
						this.fetchComments();
				}
		};

		addComment = (event) => {
				const newComment = this.state.newComment;
				newComment[event.currentTarget.className] = event.currentTarget.value;
				this.setState({
						newComment,
				});
		};
		keyPressed = async (event) => {
				if (event.key === "Enter") {
						if (this.state.newComment._id) {
								const commentsUrl =
										apiKey + "/api/comments/" + this.state.newComment._id;
								const response = await fetch(commentsUrl, {
										method: "PUT",
										body: JSON.stringify(this.state.newComment),
										headers: new Headers({
												"Authorization": "Bearer " + this.props.authoKey,
												"Content-Type": "application/json",
										}),
								});
								if (response.ok) {
										this.setState({
												newComment: {
														comment: "",
														user: this.props.userImage[0]._id,
														postid: this.props.info._id,
												},
										});
										this.fetchComments();
								} else {
										alert("An error has occurred");
								}
						} else {
								const commentsUrl = apiKey + "/api/comments/";
								const response = await fetch(commentsUrl, {
										method: "POST",
										body: JSON.stringify(this.state.newComment),
										headers: new Headers({
												"Authorization": "Bearer " + this.props.authoKey,
												"Content-Type": "application/json",
										}),
								});
								if (response.ok) {
										this.setState({
												newComment: {
														comment: "",
														user: this.props.userImage[0]._id,
														postid: this.props.info._id,
												},
										});
										this.fetchComments();
								} else {
										alert("An error has occurred");
								}
						}
				}
		};

		getSingleComment = async (id) => {
				const commentsUrl = apiKey + "/api/comments/" + id;
				let resp = await fetch(commentsUrl);
				if (resp.ok) {
						const comment = await resp.json();
						this.setState({ newComment: comment });
				}
		};

		editComment = (id) => {
				this.getSingleComment(id);
		};

		fetchComments = async () => {
				const commentsUrl = apiKey + "/api/comments/posts/";
				const resp = await fetch(commentsUrl + this.props.info._id, {
						headers: new Headers({
								Authorization: "Bearer " + this.props.authoKey,
						}),
				});
				if (resp.ok) {
						const comments = await resp.json();
						this.setState({ comments });
				}
		};

		addLike = async (id) => {
				let resp = await fetch(
						apiKey + "/api/posts/add/" + this.props.info._id + "/like/" + id,
						{
								method: "POST",
								headers: new Headers({
										Authorization: "Bearer " + this.props.authoKey,
								}),
						}
				);
				if (resp.ok) {
						this.setState({ clicked: !this.state.clicked });
						this.props.reFetchData();
				}
		};

		componentDidMount = async () => {
				this.fetchComments();
		};

		componentDidUpdate = (prevProps, prevState) => {
				if (prevState.comments !== this.state.comments) {
						this.setState({
								comments: this.state.comments,
						});
				} else if (prevProps !== this.props) {
						this.setState({
								showDropdown: false,
						});
				}
		};

		render() {
				return (
					<>
						<div className='postContent box-shadow  mb-2'>
								<div className='postHeader d-flex align-items-center p-3'>
										<div className='imgSmall mr-3'>
												{this.props.info.user.image ? (
														<Link to={"/profiles/" + this.props.info.user.username}>
																<Image fluid src={this.props.info.user.image} />
														</Link>
												) : (
														<Link to={"/profiles/" + this.props.info.user.username}>
																<Image fluid src='https://img.icons8.com/officel/2x/user.png' />
														</Link>
												)}
										</div>
										<div className='d-flex flex-column'>
												<h6 className='m-0'>
														<Link to={"/profiles/" + this.props.info.user.username}>
																{this.props.info.user.name + " " + this.props.info.user.surname}
														</Link>
												</h6>
												<label className='m-0'>{this.props.info.user.title}</label>
												<label className='m-0'>
														{this.props.info.createdAt.slice(0, 10)}{" "}
														{this.props.info.createdAt.slice(11, 19)}
												</label>
										</div>
										{this.props.username === this.props.info.username && (
												<>
														<div className='postOptions'>
																<div
																		onClick={() =>
																				this.setState({ showDropdown: !this.state.showDropdown })
																		}
																>
																		<BsThreeDots />
																</div>
														</div>
														<div className='dropDownMenu'>
																<Dropdown.Menu show={this.state.showDropdown}>
																		<Dropdown.Item
																				onSelect={() =>
																						this.props.getSinglePost(this.props.info._id)
																				}
																		>
																				Edit
																		</Dropdown.Item>
																		<Dropdown.Item
																				onSelect={() => this.deletePost(this.props.info._id)}
																		>
																				Delete
																		</Dropdown.Item>
																</Dropdown.Menu>
														</div>
												</>
										)}
								</div>
								<div className='postImage p-3'>
										<p style={{ wordWrap: "break-word" }}>{this.props.info.text}</p>
										{this.props.info.image && <Image src={this.props.info.image} />}
								</div>
								<div className='p-3'>
										<hr></hr>
										<p>{this.props.info.likes.length} person likes this post</p>
										<Accordion defaultActiveKey=''>
												<div className='commentIcons d-flex'>
														{this.props.info.likes.find(
																(user) => user.username == this.props.username
														) !== undefined ? (
																<div onClick={() => this.addLike(this.props.userImage[0]._id)}>
																		<AiFillLike /> Liked
																</div>
														) : (
																<div onClick={() => this.addLike(this.props.userImage[0]._id)}>
																		<AiOutlineLike /> Like
																</div>
														)}
														<Accordion.Toggle
																style={{ color: "black", margin: "0", textDecoration: "none" }}
																as={Button}
																variant='link'
																eventKey='1'
														>
																<GoComment /> Comment
														</Accordion.Toggle>
														<FaShare /> Share
												</div>

												<Accordion.Collapse eventKey='1'>
														<div
																className='d-flex flex-column ml-3'
																style={{ display: "'" + this.state.showComments + "'" }}
														>
																<div className='commentImg d-flex'>
																		{this.props.userImage ? (
																				<Image src={this.props.userImage[0].image} />
																		) : (
																				<Image src='https://img.icons8.com/officel/2x/user.png' />
																		)}
																		<div className='inputComment'>
																				<input
																						className='comment'
																						onChange={this.addComment}
																						onKeyPress={this.keyPressed}
																						type='text'
																						value={this.state.newComment.comment}
																						placeholder='Write a new comment'
																				/>
																		</div>
																</div>
																<div className='mt-3 mr-3'>
																		{this.state.comments.length > 0 && this.props.users && (
																				<>
																						<div>
																								{this.state.comments.map((comment, i) => (
																										<>
																												<div key={i} className='commentImg d-flex'>
																														<div>
																																<Image
																																		src={
																																				this.props.users.find(
																																						(user) =>
																																								user.username === comment.user.username
																																				).image
																																		}
																																/>
																														</div>
																														<div className='inputComment ml-3'>
																																<h6>
																																		{this.props.users.find(
																																				(user) =>
																																						user.username === comment.user.username
																																		).name + " "}
																																		{
																																				this.props.users.find(
																																						(user) =>
																																								user.username === comment.user.username
																																				).surname
																																		}
																																</h6>
																																{comment.comment}
																														</div>
																														{this.props.username ===
																																comment.user.username && (
																																<>
																																		<div className=''>
																																				<Dropdown>
																																						<Dropdown.Toggle
																																								variant='warning'
																																								id='dropdown-basic'
																																						></Dropdown.Toggle>

																																						<Dropdown.Menu className='text-center'>
																																								<a
																																										className='dropdown-item'
																																										onClick={() =>
																																												this.editComment(comment._id)
																																										}
																																								>
																																										Edit
																																								</a>

																																								<a
																																										className='dropdown-item'
																																										onClick={() =>
																																												this.deleteComment(comment._id)
																																										}
																																								>
																																										Delete
																																								</a>
																																						</Dropdown.Menu>
																																				</Dropdown>
																																		</div>
																																</>
																														)}
																												</div>
																										</>
																								))}
																						</div>
																				</>
																		)}
																</div>
														</div>
												</Accordion.Collapse>
										</Accordion>
								</div>
								
								</div>
				
		</>										
				)
		}
}

export default FeedPosts;
