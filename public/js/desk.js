// Referencias HTML
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblEarrings = document.querySelector('#lblEarrings');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('desk')) {
    window.location = 'index.html';
    throw new Error('Desk is required!');
}

const desk = searchParams.get('desk');
lblDesk.innerText = desk;

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAttend.disabled = false;
});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});

socket.on('pending-tickets', (earrings) => {

    if (earrings === 0) {
        lblEarrings.style.display = 'none';
    } else {
        lblEarrings.style.display = '';
        lblEarrings.innerText = earrings;
    }
});

btnAttend.addEventListener('click', () => {

    socket.emit('attend-ticket', { desk }, ({ ok, ticket, msg }) => {

        if (!ok) {
            lblTicket.innerText = 'Nobody.';
            return divAlert.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.number;
    });
    // socket.emit( 'attend-ticket', null, ( ticket ) => {
    //     lblNew-ticket.innerText = ticket;
    // });
});
