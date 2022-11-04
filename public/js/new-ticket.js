// Referencias HTML
const lblNewTicket = document.querySelector('#lblNewTicket');
const createBtn = document.querySelector('button');

//Iniciamos la variable de socket.io
const socket = io();

socket.on('connect', () => {
    createBtn.disabled = false;
});

socket.on('disconnect', () => {
    createBtn.disabled = true;
});

socket.on('last-ticket', (last) => {
    lblNewTicket.innerText = 'Ticket ' + last;
});

createBtn.addEventListener('click', () => {

    socket.emit('next-ticket', null, (ticket) => {
        lblNewTicket.innerText = ticket;
    });
});