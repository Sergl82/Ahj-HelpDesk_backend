const { Ticket, TicketFull } = require('./Ticket');

module.exports = class TicketCntrl {
  constructor() {
    this.tickets = [];
    this.ticketsDescription = new Map();
    this.getTicketFull = this.getTicketFull.bind(this);
  }

  createTicket({ name, description, status }) {
    let id = this.tickets.length;
    let element = this.tickets.filter((ticket) => ticket.id === Number(id));
    while (element.length !== 0) {
      id += 1;
      // eslint-disable-next-line no-loop-func
      element = this.tickets.filter((ticket) => ticket.id === Number(id));
    }

    const created = new Date();
    // eslint-disable-next-line no-param-reassign
    if (!status) status = false;
    const ticket = new Ticket({
      id, name, status, created,
    });
    this.tickets.push(ticket);
    this.ticketsDescription.set(id, description);
    return this.tickets;
  }

  getTickets() {
    return this.tickets;
  }

  getTicketFull(id) {
    const description = this.ticketsDescription.get(Number(id));
    const { name, status, created } = this.tickets.find((elem) => elem.id === Number(id));
    const ticketFull = new TicketFull({
      id, name, status, created, description,
    });
    return ticketFull;
  }

  changeStatus(id) {
    const ticket = this.tickets.find((elem) => elem.id === Number(id));
    // console.log(id);
    // const ticket = this.tickets[id];
    const { status } = ticket;
    if (status === true) {
      ticket.status = false;
    } else {
      ticket.status = true;
    }
    return ticket.status;
  }

  deleteTicket(id) {
    this.tickets = this.tickets.filter((ticket) => ticket.id !== Number(id));
    this.ticketsDescription.delete(Number(id));
    return true;
  }

  editTicket({ id, name, description }) {
    const ticket = this.tickets.find((elem) => elem.id === Number(id));
    ticket.name = name;
    this.ticketsDescription.set(Number(id), description);
    return this.tickets;
  }
};
