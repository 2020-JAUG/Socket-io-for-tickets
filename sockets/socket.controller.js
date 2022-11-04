const TicketControl = require('../model/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    //Cuando un nuevo cliente se conecta se disparan todos estos eventos
    socket.emit('last-ticket', ticketControl.last);
    socket.emit('current-status', ticketControl.lastFour);
    socket.emit('pending-tickets', ticketControl.tickets.length);

    socket.on('next-ticket', (payload, callback) => {

        const next = ticketControl.nextTicket();
        callback(next);
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);
    });

    socket.on('attend-ticket', ({ desk }, callback) => {

        if (!desk) {
            return callback({
                ok: false,
                msg: 'Desk is required!'
            });
        }

        const ticket = ticketControl.attentionTicket(desk);

        socket.broadcast.emit('current-status', ticketControl.lastFour);
        socket.emit('pending-tickets', ticketControl.tickets.length);
        socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'No tickets pending!'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
    });
}

module.exports = {
    socketController,
    //ticketControl
}