import React, { useReducer, useState, useEffect } from 'react'
import "../components/todolist.css";
import {FaTrashAlt, FaEdit} from "react-icons/fa";
import ModalContent from './ModalContent';

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TODO":
            const newTodos = [...state.todos, action.payload];
            return {
                ...state,
                todos: newTodos,
                isModalOpen: true,
                modalContent: "Task Added",
                type: "success",
            };
        case "DELETE_TODO":
            const newList = state.todos.filter((item) => item.id !== action.payload);
            return {
                ...state,
                todos: newList,
                isModalOpen: true,
                modalContent: "Task Deleted",
                type: "danger",
            }
        case "EDIT_TODO":
            const editTask = state.todos.map((item) => item.id === action.payload.id ?  {...item, taskItem: action.payload.taskItem} : item); 
            return {
                ...state,
                todos: editTask
            }
        case "TOGGLE_TODO":
            const toggleTask = state.todos.map((item) => item.id === action.payload ? {...item, completed: !item.completed} : item);
            return {
                ...state,
                todos: toggleTask,
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                isModalOpen: false
            };
        case "CLEAR_TASKS":
            return {
                ...state,
                todos: [],
                isModalOpen: true,
                modalContent: "Cleared All Tasks",
                type: "danger"
            }
        case "NO_VALUE":
            return {
                ...state,
                isModalOpen: true,
                modalContent: "Please Add Value",
                type: "danger"
            }
        default:
            break;
    }
}
const getLocalStorage = () => {
    let list = localStorage.getItem("list");
    if (list) {
        return JSON.parse(localStorage.getItem("list"))
    } else {
        return []
    }
}


const defaultState = {
    todos: getLocalStorage(),
    isModalOpen: false,
    modalContent: "",
    type: ""
}


const ToDoList = () => {
    const [state, dispatch] = useReducer(reducer, defaultState)
    const [taskItem, setTaskItem] = useState("");
    const [isEditing, setIsEditing] = useState(null);


    const taskSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            dispatch({type: "EDIT_TODO", payload: {id: isEditing.id, taskItem: taskItem}});
            setIsEditing(null);
            setTaskItem("");
        } else if (!taskItem) {
            dispatch({type: "NO_VALUE"});
        }
        else {
            handleAdd();
        }
    }
    useEffect(() => {
        localStorage.setItem("list", JSON.stringify(state.todos))
    }, [state.todos])

    const handleAdd = () => {
        const newTodo = {id: new Date().getTime().toString(), taskItem: taskItem, completed: false};
        dispatch({type: "ADD_TODO", payload: newTodo});
        setTaskItem("")
    }
    const handleDelete = (id) => {
        dispatch ({type: "DELETE_TODO", payload: id})
    }
    const handleEdit = (task) => {
        setTaskItem(task.taskItem);
        setIsEditing(task);
    }
    const handleToggle = (id) => {
        dispatch({type: "TOGGLE_TODO", payload: id})

    }
    const closeModal = () => {
        dispatch({type: "CLOSE_MODAL"})
    }
    return (
        <section className='to-do-list'>
            <div className="background">
                <div className="to-do-container">
                    <div className="title">
                        <span>My To Do List</span>
                    </div>
                    
                    <div className='modal-content'>
                        {state.isModalOpen &&<span><ModalContent modalContent={state.modalContent} closeModal={closeModal} type={state.type} tasks={state.todos}/></span>}
                    </div>
                    
                    <div className='to-do-form'>
                        <form action="#" onSubmit={taskSubmit}>
                            <input type="text" value={taskItem} onChange={(e) => setTaskItem(e.target.value)} placeholder='Enter Task' />
                            <button type='submit'>{isEditing ? "Save": "Add Task"} </button>
                        </form>
                    </div>
                    <div className="task-list">
                        {state.todos.length <= 0 && <div>There are no tasks displayed</div>}
                        <div className="task-container">
                            {state.todos.map((task) => {
                                return (
                                    <div className='task-item' key={task.id}>
                                        <div className='task-text'>
                                            <input type="checkbox"                                            
                                            onChange={() => handleToggle(task.id)}
                                            />
                                            <span
                                            className={task.completed ? "line-through" : ""}>{task.taskItem}</span>
                                        </div>
                                        <div className='task-buttons'>
                                            <span className='task-edit' onClick={() => handleEdit(task)}
                                            ><FaEdit/></span>
                                            <span className='task-delete' onClick={() => handleDelete(task.id)}
                                            ><FaTrashAlt/></span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        {state.todos.length > 0 && <button onClick={() => dispatch({type: "CLEAR_TASKS"})} className='clear-tasks'>Clear Tasks</button>} 
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ToDoList
