class Quizizz {
  constructor(apiUrl, tokenUrl) {
    this.apiUrl = apiUrl;
    this.tokenUrl = tokenUrl;
    this.token = undefined;
    this.quizizz = [];
    this.correctNumber = 0;
    this.index = 0;
  }

  async setToeken() {
    if (this.tokenUrl !== undefined) {
      const res = await fetch(this.tokenUrl);
      const json = await res.json();
      this.token = json.token;
    }
  }

  async setQuizziz() {
    let url;
    if (this.token) {
      url = `${this.apiUrl}&token=${this.token}`;
    } else {
      url = this.apiUrl;
    }
    const res = await fetch(url);
    const json = await res.json();
    this.quizizz = json.results;
  }

  setCorrectNumber() {
    this.correctNumber++;
  }

  nextQuiz() {
    this.index++;
  }

  getQuzziz() {
    return this.quizizz;
  }

  getCorrectNumber() {
    return this.correctNumber;
  }

  getIndex() {
    return this.index;
  }
}

class Quiz {
  constructor(index, category, difficulty, question, answers, correctAns) {
    this.index = index;
    this.title = title;
    this.category = category;
    this.difficulty = difficulty;
    this.question = question;
    this.answers = answers;
    this.answer = null;
    this.correctAns = correctAns;
  }

  shuffleAnswers() {
    for (let i = this.answers.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = this.answers[i];
      this.answers[i] = this.answers[j];
      this.answers[j] = tmp;
    }
    this.this.answers = this.answers;
  }

  setAnswer(answer) {
    this.answer = answer;
  }

  getCategory() {
    return this.category;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getQuiz() {
    return this.quiz;
  }

  getAnswers() {
    return this.answers;
  }

  checkCorrect() {
    if (this.answer === this.correctAns) {
      return true;
    }
    return false;
  }
}

// rendering
const createResultHtml = (
  quizizzClass,
  titleDom,
  categoryDom,
  difficultyDom
) => {
  const correctNum = quizizzClass.getCorrectNumber();
  titleDom.textContent = `あなたの正当数は${correctNum}`;
  question.textContent = '再度チャレンジしたい場合は以下をクリック！';
  categoryDom.textContent = '';
  difficultyDom.textContent = '';
};

const createQuizHtml = (
  quizizz,
  quizizzClass,
  titleDom,
  categoryDom,
  difficultyDom,
  questionDom,
  answersDom
) => {
  const index = quizizzClass.getIndex();
  const quiz = quizizz[index];
  titleDom.textContent = `問題${quiz.index + 1}`;
  categoryDom.textContent = `[ジャンル]${quiz.category}`;
  difficultyDom.textContent = `[難易度]${quiz.difficulty}`;
  questionDom.textContent = quiz.question;

  quiz.answers.forEach((ans) => {
    const answerDom = document.createElement('button');
    const br = document.createElement('br');
    answerDom.textContent = ans;
    answersDom.appendChild(answerDom);
    answersDom.appendChild(br);

    answerDom.addEventListener(
      'click',
      {
        ans,
        quizizz,
        quizizzClass,
        handleEvent: nextQuizStep,
      },
      false
    );
  });
};

const createHtml = (quizizzClass, quizizz) => {
  const titleDom = document.getElementById('title');
  const categoryDom = document.getElementById('category');
  const difficultyDom = document.getElementById('difficulty');
  const questionDom = document.getElementById('question');
  const answersDom = document.getElementById('answers');
  const homeBtnDom = document.getElementById('home-btn');
  const quizizzNum = quizizzClass.getQuzziz().length;
  const index = quizizzClass.getIndex();

  if (quizizzNum > index) {
    createQuizHtml(
      quizizz,
      quizizzClass,
      titleDom,
      categoryDom,
      difficultyDom,
      questionDom,
      answersDom
    );
  } else {
    createResultHtml(quizizzClass, titleDom, categoryDom, difficultyDom);
    homeBtnDom.hidden = false;
  }
};

// event function

const nextQuizStep = function (e) {
  const index = this.quizizzClass.getIndex();
  const quiz = this.quizizz[index];

  quiz.setAnswer(this.ans);
  isCorrectAnswer = quiz.checkCorrect();

  if (isCorrectAnswer) {
    this.quizizzClass.setCorrectNumber();
  }
  this.quizizzClass.nextQuiz();

  while (answers.lastChild) {
    answers.removeChild(answers.lastChild);
  }

  createHtml(this.quizizzClass, this.quizizz);
};

// click function
const startQuiz = async () => {
  const quizizzClass = new Quizizz(
    'https://opentdb.com/api.php?amount=10',
    'https://opentdb.com/api_token.php?command=request'
  );

  const titleDom = document.getElementById('title');
  const questionDom = document.getElementById('question');
  const startBtn = document.getElementById('start-btn');

  startBtn.hidden = true;
  titleDom.textContent = '取得中';
  questionDom.textContent = '少々お待ちください';

  await quizizzClass.setToeken();
  await quizizzClass.setQuizziz();
  const results = quizizzClass.getQuzziz();
  const quizizz = [];
  results.forEach((d, i) => {
    let answers = d.incorrect_answers;
    answers.push(d.correct_answer);

    const quiz = new Quiz(
      i,
      d.category,
      d.difficulty,
      d.question,
      answers,
      d.correct_answer
    );
    quizizz.push(quiz);
  });

  createHtml(quizizzClass, quizizz);
};

const home = () => {
  const title = document.getElementById('title');
  const question = document.getElementById('question');
  const startBtn = document.getElementById('start-btn');
  const homeBtn = document.getElementById('home-btn');

  startBtn.hidden = false;
  homeBtn.hidden = true;

  title.textContent = 'ようこそ';
  question.textContent = '以下のボタンをクリックしてください。';
};
