function checkResults(userResponses, data) {
  let score = 0;
  const results = [];

  userResponses.forEach((userResponse, index) => {
    const question = data[index];
    const correctAnswer = question.correct_answer;

    const isCorrect = userResponse === correctAnswer;

    results.push({
      question: question.question,
      userResponse,
      correctAnswer,
      isCorrect: isCorrect,
      point: isCorrect ? 1 : 0, // Assign 1 point for correct answers, 0 for incorrect
    });

    if (isCorrect) {
      score++;
    }
  });

  return { score, results };
}

export default checkResults;  