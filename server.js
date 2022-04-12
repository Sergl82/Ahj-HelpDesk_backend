// const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const PORT = process.env.PORT || 7070;

const TicketCntrl = require('./src/TicketsCntrl');

const ticketCntrl = new TicketCntrl();

ticketCntrl.createTicket({
  name: 'Поменять краску в принтере',
  status: true,
  description: 'Принтер HP, картр. на складе',
});

ticketCntrl.createTicket({
  name: 'Пeреустановить Windows',
  status: false,
  description: 'ПК-874659283',
});

//= > CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

// => Body Parsers
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async (ctx) => {
  if (ctx.request.method === 'GET') ({ method } = ctx.request.query);
  else if (ctx.request.method === 'POST') ({ method } = ctx.request.body);

  switch (method) {
    case 'allTickets':
      ctx.response.body = ticketCntrl.getTickets();
      return;
    case 'ticketById':
      ctx.response.body = ticketCntrl.getTicketFull(ctx.request.query.id);
      return;
    case 'createTicket':
      ctx.response.body = ticketCntrl.createTicket(ctx.request.body);
      return;
    case 'changeStatus':
      ctx.response.body = ticketCntrl.changeStatus(ctx.request.body.id);
      return;
    case 'deleteTicket':
      ctx.response.body = ticketCntrl.deleteTicket(ctx.request.body.id);
      return;
    case 'editTicket':
      ctx.response.body = ticketCntrl.editTicket(ctx.request.body);
      return;

    default:
      ctx.response.status = 404;
  }
});

app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));
