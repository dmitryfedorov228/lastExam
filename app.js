

const API_URL = 'http://localhost:3500' 

//! вытаскиваю html теги 

const inputs = document.querySelectorAll('input')
const addBtn = document.querySelector('#form_btn_add')
const list = document.querySelector('.book_list')

//! STATE
let formData = {
    bookName: '',
     bookAuthor : ''
}
 
let bookList = [] 


//! EVENTS 

inputs.forEach(input => {
    input.addEventListener('input', ({target: {value, name}}) => {
        formData[name] = value
        
    })
    
    
}); 
addBtn.addEventListener('click', (event) => {
    event.preventDefault()
    const newBook = {
        name: formData.bookName,
        author: formData.bookAuthor,
        isCompleted: false
    }
    createBook(newBook)
    
})


document.addEventListener('click', (event) => {
    if (event.target.classList.contains('checkRead')) {
        const targetId = +event.target.id
        completeBook(bookList.find(book => book.id === targetId))
    }
})

document.addEventListener('click' , (event) => {
    if(event.target.classList.contains('delete_btn')) {
        const targetId = +event.target.id
        deleteBook(targetId)
    }
} )

//! REQUEST FN
getBooks()


async function getBooks () {
    const url = `${API_URL}/books`
    const books = await makeRequest(url)
    bookList = books
    render()
}

async function createBook (book) {  
    const url = `${API_URL}/books`
    const addedBook = await makeRequest(url, 'POST', book)
    bookList = [...bookList, addedBook]
    console.log(bookList);
    render()
    clearForm()


}

async function deleteBook (bookId) {
    const url = `${API_URL}/books/${bookId}`
    await makeRequest(url, 'DELETE')
    bookList = bookList.filter(book => book.id !== +bookId)
    render()

}

async function completeBook (book) {
    const url = `${API_URL}/books/${book.id}`
    const changedBook = await makeRequest(url, 'PATCH', {isCompleted : !book.isCompleted})
}


//* CRUD


//! READ 
async function render() { 
    if(!bookList.length) {
        list.innerHTML = 'Книг нет'
        return
    }

    list.innerHTML = ''

    bookList.forEach(book => {
        const li = document.createElement('li')
        li.classList.add('book_list_item')

        if(book.isCompleted) {
            li.classList.add('is_completed')
        }


        li.innerHTML = `
        <span> Название:${book.name},</span>
        <span> Автор: ${book.name}</span>
        <div class="form-check form-switch">
  <input class="form-check-input checkRead"  type="checkbox" id="${book.id}">
  <label class="form-check-label" for="flexSwitchCheckDefault">Прочитано</label>
</div>
       
        <div class="actions_wrap">
        
            <button class="edit_btn btn btn-success" id="${book.id}">Изменить</button>
            <button class="delete_btn btn btn-danger" id="${book.id}">Удалить</button>
        </div>
    `

    list.append(li)


    })


}
 







//? HELPERS


async function makeRequest (url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type' : 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        })
      
        return await  response.json()
    } catch (error) {
        alert(' случилась error', 'error')
    }
}

function clearForm () {
    inputs.forEach(input => {
        input.value = ''
    });
}