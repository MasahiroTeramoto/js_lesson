class TravisQuiz {
  constructor() {
    this.index = 0;
    this.correctNumber = 0;
    this.arr = [];
    this.answers = [];
    this.correctAns;
    this.token;
  }

  async getToken() {
    const res = await fetch(
      'https://opentdb.com/api_token.php?command=request'
    );
    const json = await res.json();
    this.token = json.token;
  }

  async getTravisQuiz() {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=10&token=${this.token}`
    );
    const json = await res.json();
    this.arr = json.results;
  }

  createResultHtml(title, genre, difficulty, quiz) {
    title.textContent = `あなたの正当数は${this.correctNumber}`;
    quiz.textContent = '再度チャレンジしたい場合は以下をクリック！';
    genre.textContent = '';
    difficulty.textContent = '';
  }

  createQuizHtml(title, genre, difficulty, quiz, answers) {
    this.correctAns = this.arr[this.index].correct_answer;
    this.answers = this.arr[this.index].incorrect_answers;
    this.answers.push(this.correctAns);
    const TravisQuizClass = this;

    this.answers = this.shuffleAnswers(this.answers);

    title.textContent = `問題${this.index + 1}`;
    genre.textContent = `[ジャンル]${this.arr[this.index].category}`;
    difficulty.textContent = `[難易度]${this.arr[this.index].difficulty}`;
    quiz.textContent = this.arr[this.index].question;

    this.answers.forEach((ans) => {
      const answer = document.createElement('button');
      const br = document.createElement('br');
      answer.textContent = ans;
      answers.appendChild(answer);
      answers.appendChild(br);

      answer.addEventListener(
        'click',
        {
          ans,
          TravisQuizClass,
          handleEvent: this.nextQuiz,
        },
        false
      );
    });
  }

  createHtml() {
    const title = document.getElementById('title');
    const genre = document.getElementById('genre');
    const difficulty = document.getElementById('difficulty');
    const quiz = document.getElementById('quiz');
    const answers = document.getElementById('answers');
    const homeBtn = document.getElementById('home-btn');

    if (this.arr.length > this.index) {
      this.createQuizHtml(title, genre, difficulty, quiz, answers);
    } else {
      this.createResultHtml(title, genre, difficulty, quiz);
      homeBtn.hidden = false;
    }
  }

  shuffleAnswers(answers) {
    for (let i = answers.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = answers[i];
      answers[i] = answers[j];
      answers[j] = tmp;
    }
    return answers;
  }

  nextQuiz() {
    const answers = document.getElementById('answers');

    while (answers.lastChild) {
      answers.removeChild(answers.lastChild);
    }

    if (this.ans === this.TravisQuizClass.correctAns) {
      this.TravisQuizClass.correctNumber++;
    }

    this.TravisQuizClass.index++;
    this.TravisQuizClass.createHtml();
  }
}

const home = () => {
  const title = document.getElementById('title');
  const quiz = document.getElementById('quiz');
  const startBtn = document.getElementById('start-btn');
  const homeBtn = document.getElementById('home-btn');

  startBtn.hidden = false;
  homeBtn.hidden = true;

  title.textContent = 'ようこそ';
  quiz.textContent = '以下のボタンをクリックしてください。';
};

const startQuiz = async () => {
  const travis = new TravisQuiz();

  const title = document.getElementById('title');
  const quiz = document.getElementById('quiz');
  const startBtn = document.getElementById('start-btn');

  startBtn.hidden = true;
  title.textContent = '取得中';
  quiz.textContent = '少々お待ちください';

  await travis.getToken();
  await travis.getTravisQuiz();
  travis.createHtml();
};
