interface MyTicketsDummy {
    id: number;
    event: string;
    ticket_type: string;
    date: string;
    location: string;
    total_price: number;
    status: string;
}

export const MY_TICKETS_DUMMY: MyTicketsDummy[] = [
    {
        id: 1,
        event: 'Pesta Rakyat',
        ticket_type: 'VIP',
        date: '2025-02-01',
        location: 'Jakarta',
        total_price: 100000,
        status: 'success'
    },
    {
        id: 2,
        event: 'Music Night',
        ticket_type: 'Regular',
        date: '2025-02-02',
        location: 'Online',
        total_price: 75000,
        status: 'pending'
    },
    {
        id: 3,
        event: 'Event 3',
        ticket_type: 'VIP',
        date: '2025-02-03',
        location: 'Bandung',
        total_price: 150000,
        status: 'failed'
    },
    {
        id: 4,
        event: 'Tech Conference',
        ticket_type: 'Regular',
        date: '2025-02-04',
        location: 'Surabaya',
        total_price: 50000,
        status: 'success'
    },
    {
        id: 5,
        event: 'Art Exhibition',
        ticket_type: 'VIP',
        date: '2025-02-05',
        location: 'Yogyakarta',
        total_price: 120000,
        status: 'pending'
    },
    {
        id: 6,
        event: 'Food Festival',
        ticket_type: 'Regular',
        date: '2025-02-06',
        location: 'Bali',
        total_price: 80000,
        status: 'success'
    },
    {
        id: 7,
        event: 'Startup Meetup',
        ticket_type: 'VIP',
        date: '2025-02-07',
        location: 'Jakarta',
        total_price: 110000,
        status: 'failed'
    },
    {
        id: 8,
        event: 'Gaming Convention',
        ticket_type: 'Regular',
        date: '2025-02-08',
        location: 'Online',
        total_price: 60000,
        status: 'success'
    },
    {
        id: 9,
        event: 'Book Fair',
        ticket_type: 'VIP',
        date: '2025-02-09',
        location: 'Bandung',
        total_price: 90000,
        status: 'pending'
    }
]