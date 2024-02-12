import todoStore, { Filters } from '../store/todo.store';
import  html  from './app.html?raw'
import { renderTodos, renderPending} from './user-cases';


const elementIds = { 
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompletedButton: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId) =>{

    const displayTodos = () =>{
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos(elementIds.TodoList, todos );
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(elementIds.PendingCountLabel)
    }

    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        displayTodos( )
    })();    

    //referencias HTML
    const newDescriptionInput = document.querySelector( elementIds.NewTodoInput );
    const TodoListUL = document.querySelector( elementIds.TodoList );
    const ClearCompletedButton = document.querySelector(elementIds.ClearCompletedButton)
    const filterLIs = document.querySelectorAll( elementIds.TodoFilters)

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

    filterLIs.forEach( element => {
        addEventListener('click', (element) =>{
            filterLIs.forEach( el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch( element.target.text ){
                case 'Todos':
                    todoStore.setFilte( Filters.All)
                break;
                case 'Pendientes':
                    todoStore.setFilte( Filters.Pending)
                break;
                case 'Completados':
                    todoStore.setFilte( Filters.Completed)
                break;
            }

            displayTodos()
        })

    });

}