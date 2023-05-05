//Находим элементы на странице
const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

//Рендерим задачи из Local Storage
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.forEach((task) => renderTask(task))
}

checkEmptyList()

//Добавление задачи
form.addEventListener('submit', addTask)

//Удаление задачи
tasksList.addEventListener('click', deleteTask)

//Отмечаем задачу заверешенной
tasksList.addEventListener('click', doneTask)

//Функции
function addTask(event) {
  //Отменяем отправку формы
  event.preventDefault()

  //Добавляем в разметку то, что ввели в инпут
  const taskText = taskInput.value

  //Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  }

  //Добавляем задачу в массив с задачами
  tasks.push(newTask)

  //Добавляем задачу в хранилище браузера LocalStorage
  saveToLocalStorage()

  //Рендерим задачу на странице
  renderTask(newTask)

  //Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = ''
  taskInput.focus()

  checkEmptyList()
}

function deleteTask(event) {
  //Проверяем если клик был НЕ по "кнопке удалить задачу"
  if (event.target.dataset.action !== 'delete') return

  const parentNode = event.target.closest('.list-group-item')

  //Определяем ID задачи
  const id = Number(parentNode.id)

  //Удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id)

  saveToLocalStorage()

  //Удаляем задачу из разметки
  parentNode.remove()
  checkEmptyList()
}

function doneTask(event) {
  //Проверяем, что клик был НЕ по галке
  if (event.target.dataset.action !== 'done') return

  //Находим элемент через метод
  const parentNode = event.target.closest('.list-group-item')

  //Изменяем свойство task на done
  const id = Number(parentNode.id)
  const task = tasks.find((task) => task.id === id)
  task.done = !task.done

  saveToLocalStorage()

  const taskTitle = parentNode.querySelector('.task-title')
  taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
            <img src="./img/00056289.jpg" alt="Empty" width="200" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>`

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
  }

  if (tasks.length > 0) {
    const emptyListEL = document.querySelector('#emptyList')
    emptyListEL ? emptyListEL.remove() : null
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
  //Формируем css класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

  //Формируем разметку для задачи из поля ввода
  const taskHTML = `
				<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`

  //Добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
