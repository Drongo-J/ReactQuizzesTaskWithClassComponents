import React, { Component } from "react";
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

export default class Quizzes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionIndex: 0,
      userResponses: Array(questions.length).fill(null),
      isFinishModalOpen: false,
      quizCompleted: false,
      questionsAndAnswers: [],
    };
  }

  openFinishModal = () => {
    this.setState({ isFinishModalOpen: true });
  };

  closeFinishModal = () => {
    this.setState({ isFinishModalOpen: false });
  };

  handleItemClick = (answer) => {
    const { questionIndex, userResponses } = this.state;
    const updatedUserResponses = [...userResponses];
    updatedUserResponses[questionIndex] = answer;
    this.setState({ userResponses: updatedUserResponses });
  };

  handleNext = () => {
    const { questionIndex, userResponses } = this.state;
    if (userResponses[questionIndex] !== null) {
      if (questionIndex < questions.length - 1) {
        this.setState({ questionIndex: questionIndex + 1 });
      } else {
        this.openFinishModal();
      }
    }
  };

  handleFinish = () => {
    const { userResponses } = this.state;
    const { score, results } = checkResults(userResponses, questions);

    console.log("Quiz completed!");
    console.log(`Score: ${score}/${questions.length}`);
    console.log("Results:", results);

    this.setState({
      quizCompleted: true,
      questionsAndAnswers: results,
    });
  };

  handlePrevious = () => {
    const { questionIndex } = this.state;
    if (questionIndex > 0) {
      this.setState({ questionIndex: questionIndex - 1 });
    }
  };

  render() {
    const {
      questionIndex,
      userResponses,
      isFinishModalOpen,
      quizCompleted,
      questionsAndAnswers,
    } = this.state;

    return (
      <div className="quizzes-container">
        {quizCompleted ? (
          <QNA questionsAndAnswers={questionsAndAnswers} />
        ) : (
          <>
            <Item.Meta>
              <Message size="huge" floating>
                <b>{`${questionIndex + 1}/${questions.length}`}.  {questions[questionIndex].question}</b>
              </Message>
              <br />
              <Item.Description>
                <h3>Please choose one of the following answers:</h3>
              </Item.Description>
              <Divider />
              <Menu vertical fluid size="massive">
                {questions[questionIndex].options.map((option, i) => {
                  const letter = getLetter(i);

                  return (
                    <Menu.Item
                      key={i}
                      active={userResponses[questionIndex] === option}
                      onClick={() => this.handleItemClick(option)}
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
                  onClick={this.handlePrevious}
                  floated="left"
                  size="big"
                  icon="left chevron"
                  labelPosition="left"
                />
              )}
              <Button
                primary
                content={questionIndex === questions.length - 1 ? "Finish" : "Next"}
                onClick={
                  questionIndex === questions.length - 1
                    ? this.handleFinish
                    : this.handleNext
                }
                floated="right"
                size="big"
                icon={
                  questionIndex === questions.length - 1 ? "check" : "right chevron"
                }
                labelPosition="right"
                disabled={userResponses[questionIndex] === null}
              />
            </Item.Extra>
          </>
        )}

        <Modal open={isFinishModalOpen} onClose={this.closeFinishModal}>
          <Modal.Header>Finish Quiz</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to finish the quiz?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button secondary content="No" onClick={this.closeFinishModal} />

            <Button
              primary
              content="Yes"
              onClick={() => {
                this.closeFinishModal();
                this.handleFinish();
              }}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}


