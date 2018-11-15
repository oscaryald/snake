class Snake{
    constructor(){
        this.snakee = {
            x: 0,
            y: 0,
            currRow: '',
            tail:[],
            head: 0,
            move: 'ArrowRight',
        }
        this.eat = {
            rowIndex: 0,
            cellIndex: 0
        }
        this.isEating = false;
        this.clickListenerBind = null;
        this.timerMove = null;
    }
    
    init(){
      this.renderField();
      this.clearSnake();
      this.renderSnake(3);
      this.setEat();
      this.move();
    }
    
    renderField(){
      const field = document.querySelector('.field');
      field.innerHTML = '';
      for (let i = 0; i < CELLS; i++) {
          if( i % 11 === 0 || i === 0) {
            field.innerHTML += `<ul class="row"></ul>`;
          }
          const lastUl = field.querySelectorAll('.row:last-child')[0];
          lastUl.innerHTML += `<li class="cell list-item"></li>`;
      }
    }

    clearSnake() {
        this.snakee = {
            x: 0,
            y: 0,
            currRow: '',
            tail: [],
            head: 0,
            move: 'ArrowRight',
        }
        document.removeEventListener('keydown', this.clickListenerBind);
        clearInterval(this.timerMove);
        this.viewPoints(0)
    }

    renderSnake(num){
        for (let i = 0; i < num; i++){
            const currRow = document.querySelectorAll('.row')[0]
            currRow.querySelectorAll('.cell')[i].classList.add('data-s');
            this.snakee.x = 0;
            this.snakee.y = i;
            this.snakee.tail.push({x: this.snakee.x, y:i})
        }
    }

    move() {
        this.clickListenerBind = this.changeDirection.bind(this);
        this.timerMove = setInterval(() => {
            this.moveSnake(this.snakee.move)
        }, TIMER)
        document.addEventListener('keyup', this.clickListenerBind);
    }

    changeDirection(e) {
        if (!this.canMove(e)) {
            return;
        }
        if (e.code === 'ArrowRight') {
            this.snakee.move = 'ArrowRight';
        } else if (e.code === 'ArrowLeft') {
            this.snakee.move = 'ArrowLeft';
        } else if (e.code === 'ArrowDown') {
            this.snakee.move = 'ArrowDown';
        } else if (e.code === 'ArrowUp') {
            this.snakee.move = 'ArrowUp';
        }
    }

    moveSnake(snakeMove = 'ArrowRight') {

        if(this.isEndField()) {
            this.showDialog();
            return;
        }

        if(!this.eating()){
            this.deleteLastElement();
        }

        this.head = this.snakee.tail.length - 1;

        if (snakeMove === 'ArrowRight') {
            this.snakee.y = this.snakee.tail[this.head].y + 1;
            this.snakee.move = 'ArrowRight';
            this.addFirstElement();
        } else if (snakeMove === 'ArrowLeft') {
            this.snakee.y = this.snakee.tail[this.head].y - 1;
            this.snakee.move = 'ArrowLeft';
            this.addFirstElement();
        } else if(snakeMove === 'ArrowDown') {
            this.snakee.x = this.snakee.tail[this.head].x + 1;
            this.snakee.move = 'ArrowDown';
            this.addFirstElement();
        } else if(snakeMove === 'ArrowUp') {
           this.snakee.x = this.snakee.tail[this.head].x - 1;
           this.snakee.move = 'ArrowUp';
           this.addFirstElement();
        }

    }

    canMove(e) {
        if (this.snakee.move === 'ArrowRight' && e.code === 'ArrowLeft') {
            return false;
        } else if (this.snakee.move === 'ArrowLeft' && e.code === 'ArrowRight') {
            return false;
        } else if (this.snakee.move === 'ArrowDown' && e.code === 'ArrowUp') {
            return false;
        } else if (this.snakee.move === 'ArrowUp' && e.code === 'ArrowDown') {
            return false;
        }
        return true;
    }

    deleteLastElement() {
        if (this.snakee.tail.length) {
            this.snakee.currRow = document.querySelectorAll('.row')[this.snakee.tail[0].x]
            this.snakee.currRow.querySelectorAll('.cell')[this.snakee.tail[0].y].classList.remove('data-s');
            this.snakee.tail = this.snakee.tail.slice(1);
        }
    }

    addFirstElement() {
        const currRow = document.querySelectorAll('.row')[this.snakee.x];
        if(!currRow){
            this.showDialog();
            return;
        }
        const currCell = currRow.querySelectorAll('.cell')[this.snakee.y];
        if(currCell && currCell.classList.contains('data-s')) {
            this.showDialog();
            return;
        }
        
        currCell && currCell.classList.add('data-s');
        this.snakee.tail.push({x: this.snakee.x, y: this.snakee.y});
    }

    isEndField() {
        const lengthY = document.querySelector('.row').querySelectorAll('.cell').length - 1;
        const lengthX = document.querySelectorAll('.row').length;

        return this.snakee.y > lengthY 
               || this.snakee.y < 0
               || this.snakee.x > lengthX 
               || this.snakee.x < 0;
    }

    showDialog() {
        const result = confirm('you loose! try again?');
        if (result) {
            this.init();
        } else {
            this.renderField();
            this.clearSnake();
            this.renderSnake(3);
        }
        return false;
    }

    setEat() {
        const eatPosition = Math.floor(Math.random(0, 99) * 99);
        document.querySelectorAll('.cell')[eatPosition].classList.add('eat');

        const rows = [].slice.apply(document.querySelectorAll('.row'));
        const eatRowIndex = rows.findIndex((row) => row.querySelector('.cell.eat'));

        const cell = [].slice.apply(document.querySelectorAll('.row')[eatRowIndex].querySelectorAll('.cell'));
        const eatCellIndex = cell.findIndex((cell) =>cell.classList.contains('eat'));
        this.eat.rowIndex = eatRowIndex;
        this.eat.cellIndex = eatCellIndex;
    }

    eating(){
        if (!document.querySelector('.data-s.eat')) {
            return false;
        }
        document.querySelector('.data-s.eat').classList.remove('eat');
        this.viewPoints(this.snakee.tail.length - 2);
        this.setEat();
        return true;
    }

    viewPoints(value) {
        const point = document.querySelector('.points')
        point.innerHTML = value;
    }

}
const TIMER = 500;
const CELLS = 99;
const snake = new Snake();
snake.init();