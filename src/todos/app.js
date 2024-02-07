import todoStore from '../store/todo.store';
import  html  from './app.html?raw'
import { renderTodos } from './user-cases';


const elementIds = { 
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompletedButton: '.clear-completed'

}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId) =>{

    const displayTodos = () =>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(elementIds.TodoList, todos )
    }

    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos()
    })();    

    //referencias HTML

    const newDescriptionInput = document.querySelector( elementIds.NewTodoInput );
    const TodoListUL = document.querySelector( elementIds.TodoList );
    const ClearCompletedButton = document.querySelector(elementIds.ClearCompletedButton)

    //listeners
    newDescriptionInput.addEventListener( 'keyup', ( event ) =>{
        if( event.keyCode !==13 ) return;
        if( event.target.value.trim().length === 0) return;

        todoStore.addTodo( event.target.value);
        displayTodos()
        event.target.value = ""
    });

    TodoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo( element.getAttribute('data-id') );
        displayTodos();
    });

    TodoListUL.addEventListener('click', (event) =>{
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');
        if( !element || !isDestroyElement ) return;

        todoStore.deleteTodo( element.getAttribute('data-id'));
        displayTodos();
    })

    ClearCompletedButton.addEventListener('click',() =>{
        todoStore.deleteCompleted();
        displayTodos()

    } )

}