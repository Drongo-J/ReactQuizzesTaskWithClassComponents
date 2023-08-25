import React, { useState } from "react";
import "./Quizzes.css";
import { Button, Item, Message, Divider, Menu, Modal } from "semantic-ui-react";
import { quizzes } from "../../data/quizzes";
import shuffleArray from "../../utils/shuffleArray";
import getLetter from "../../utils/getLetter";
import checkResults from "../../utils/checkResults";
import QNA from "../QNA/QNA";

var questions = shuffleArray(quizzes).slice(0, 12);
// Shuffle the answers for each question
questions.forEach((question) => {
  question.options = shuffleArray(question.options);
});

export default function Quizzes() {
  const data = questions;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState(
    Array(data.length).fill(null)
  ); // Initialize an array to store user responses
  const [isFinishModalOpen, setFinishModalOpen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false); // Track quiz completion
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]); // State for questions and answers

  function openFinishModal() {
    setFinishModalOpen(true);
  }

  function closeFinishModal() {
    setFinishModalOpen(false);
  }

  function handleItemClick(answer) {
    // Update the user's response for the current question
    const updatedUserResponses = [...userResponses];
    updatedUserResponses[questionIndex] = answer;
    setUserResponses(updatedUserResponses);
  }

  function handleNext() {
    if (userResponses[questionIndex] !== null) {
      // Move to the next question or show confirmation dialog when finishing
      if (questionIndex < data.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        // Open the finish confirmation modal
        openFinishModal();
      }
    }
  }

  function handleFinish() {
    // Call the checkResults function to get the score and results
    const { score, results } = checkResults(userResponses, data);

    // Log or display the results
    console.log("Quiz completed!");
    console.log(`Score: ${score}/${data.length}`);
    console.log("Results:", results);

    // Set quizCompleted to true to render the Result component
    setQuizCompleted(true);

    setQuestionsAndAnswers(results); // Assuming that `results` contains questions and answers
  }

  function handlePrevious() {
    if (questionIndex > 0) {
      // Go back to the previous question
      setQuestionIndex(questionIndex - 1);
    }
  } 

  return (  
    <div className="quizzes-container">
      {quizCompleted ? (
         <QNA questionsAndAnswers={questionsAndAnswers} /> 
      ) : (
        <>
          <Item.Meta>
            <Message size="huge" floating>
              <b>{`${questionIndex + 1}/${data.length}`}.  {data[questionIndex].question}</b>
            </Message>
            <br />
            <Item.Description>
              <h3>Please choose one of the following answers:</h3>
            </Item.Description>
            <Divider />
            <Menu vertical fluid size="massive">
              {data[questionIndex].options.map((option, i) => {
                const letter = getLetter(i);

                return (
                  <Menu.Item
                    key={i}
                    active={userResponses[questionIndex] === option}
                    onClick={() => handleItemClick(option)}
                  >
                    <b style={{ marginRight: "8px" }}>{letter}</b>
                    {option}
                  </Menu.Item>
                );
              })}
            </Menu>
          </Item.Meta>
          <Divider />
          <Item.Extra>
            {questionIndex > 0 && (
              <Button
                primary
                content="Previous"
                onClick={handlePrevious}
                floated="left"
                size="big"
                icon="left chevron"
                labelPosition="left"
              />
            )}
            <Button
              primary
              content={questionIndex === data.length - 1 ? "Finish" : "Next"}
              onClick={
                questionIndex === data.length - 1 ? handleFinish : handleNext
              }
              floated="right"
              size="big"
              icon={
                questionIndex === data.length - 1 ? "check" : "right chevron"
              }
              labelPosition="right"
              disabled={userResponses[questionIndex] === null}
            />
          </Item.Extra>
        </>
      )}

      <Modal open={isFinishModalOpen} onClose={closeFinishModal}>
        <Modal.Header>Finish Quiz</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to finish the quiz?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary content="No" onClick={closeFinishModal} />

          <Button
            primary
            content="Yes"
            onClick={() => {
              closeFinishModal();
              handleFinish();
            }}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
}
