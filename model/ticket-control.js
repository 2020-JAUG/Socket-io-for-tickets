const path = require('path');
const fs = require('fs');
const Ticket = require('./ticket');

class TicketControl {

    constructor() {

        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.lastFour = [];

        this.init();
    }

    /**
     * Cuando llame al toJson de la clase TicketControl generara este objeto
     */
    get toJson() {

        return {

            last: this.last,
            today: this.today,
            tickets: this.tickets,
            lastFour: this.lastFour
        }
    }

    init() {

        const { today, last, lastFour, tickets } = require('../db/data.json');

        if (today === this.today) {

            this.tickets = tickets;
            this.last = last;
            this.lastFour = lastFour;
        } else {
            this.saveDB();
        }
    }

    saveDB() {

        //Accedemos a la DB
        const dbPath = path.join(__dirname, '../db/data.json');
        //Grabamos los datos en nuestra DB
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    nextTicket() {

        this.last += 1;

        const ticket = new Ticket(this.last, null);
        //this.tickets.push( new Ticket(this.last, null) );

        this.tickets.push(ticket);

        this.saveDB();
        return 'Ticket ' + ticket.number;
    }

    attentionTicket(desk) {

        if (this.tickets.length === 0) { return null; }

        const ticket = this.tickets.shift();  //this.tickets[0];

        ticket.desk = desk;

        this.lastFour.unshift(ticket);

        if (this.lastFour.length > 4) {

            this.lastFour.splice(-1, 1);
        }

        this.saveDB();

        return ticket;
    }
}

module.exports = TicketControl;