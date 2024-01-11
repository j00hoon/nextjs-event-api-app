import { useEffect, useState, useContext } from 'react';

import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';
import NotificationContext from '../../store/notification-context';


function Comments(props) {
  const { eventId } = props;

  const notificationContext = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      
        setIsFetchingComments(true);

        fetch(`/api/comment/${eventId}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }

            response.json().then(data => {
              throw new Error(data.message || "Something went wrong! GET");
            });
          })
          .then(data => {
            setComments(data.comments);
            setIsFetchingComments(false);
          })
          .catch(error => 
            notificationContext.showNotification({
              title: "Error!",
              message: error.message,
              status: "error"
            })
          )
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    // notificationContext.showNotification({
    //   title: "Comment",
    //   message: "Leave a comment!",
    //   status: "pending"
    // });

    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {

    notificationContext.showNotification({
      title: "Sending comment...",
      message: "Your comment is on-going!",
      status: "pending"
    });
    
    const email = commentData.email;
    const name = commentData.name;
    const text = commentData.text;


    const enteredComment = {
      email : email,
      name : name,
      text : text
    };

    
    fetch(`/api/comment/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(enteredComment),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }

        response.json().then(data => {
          throw new Error(data.message || "Something went wrong! POST");
        })
      })
      .then(data => {
        notificationContext.showNotification({
          title: "Success!",
          message: "Successfully left your comment!",
          status: "success"
        })
      })
      .catch(error =>
        notificationContext.showNotification({
          title: "Error!",
          message: error.message,
          status: "error"
        })
      );

  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && <CommentList items={comments} />}
      {showComments && isFetchingComments && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
