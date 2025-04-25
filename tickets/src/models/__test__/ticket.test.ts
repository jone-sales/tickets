import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'Test Ticket',
        price: 10,
        userId: '123',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 20});
    secondInstance!.set({ price: 30});

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (err) {
        return;
      }
});

it('increments version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'Test Ticket',
        price: 10,
        userId: '123',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
});