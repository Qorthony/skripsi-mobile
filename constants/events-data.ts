export interface TicketTypes {
    id: number;
    type: string;
    price: number;
    description: string;
}
export interface EventTypes {
    id: number;
    name: string;
    date: string;
    description: string;
    image: any;
    location: string;
    city?: string|null;
    event_link?: string|null;
    tickets?: TicketTypes[];
}

export const DUMMY_POSTER = require('@/assets/images/dummy_poster.png');

export const EVENTS_DATA: EventTypes[] = [
    {
        id: 1,
        name: 'Pesta Rakyat',
        description: 'Deskripsi event 1',
        image: DUMMY_POSTER,
        date: '2025-02-01',
        location: 'offline',
        city: 'Jakarta',
        event_link: null,
        tickets: [
            { id: 1, type: 'VIP', price: 100000, description: 'VIP ticket for Pesta Rakyat' },
            { id: 2, type: 'Regular', price: 50000, description: 'Regular ticket for Pesta Rakyat' },
            { id: 21, type: 'Student', price: 25000, description: 'Student ticket for Pesta Rakyat' },
            { id: 22, type: 'Senior', price: 25000, description: 'Senior ticket for Pesta Rakyat' }
        ]
    },
    {
        id: 2,
        name: 'Music Night',
        description: 'Deskripsi event 2',
        image: DUMMY_POSTER,
        date: '2025-02-02',
        location: 'online',
        city: null,
        event_link: 'https://example.com/event2',
        tickets: [
            { id: 3, type: 'VIP', price: 150000, description: 'VIP ticket for Music Night' },
            { id: 4, type: 'Regular', price: 75000, description: 'Regular ticket for Music Night' }
        ]
    },
    {
        id: 3,
        name: 'Event 3',
        description: 'Deskripsi event 3',
        image: DUMMY_POSTER,
        date: '2025-02-03',
        location: 'offline',
        city: 'Bandung',
        event_link: null,
        tickets: [
            { id: 5, type: 'VIP', price: 120000, description: 'VIP ticket for Event 3' },
            { id: 6, type: 'Regular', price: 60000, description: 'Regular ticket for Event 3' }
        ]
    },
    {
        id: 4,
        name: 'Event 4',
        description: 'Deskripsi event 4',
        image: DUMMY_POSTER,
        date: '2025-02-04',
        location: 'online',
        city: null,
        event_link: 'https://example.com/event4',
        tickets: [
            { id: 7, type: 'VIP', price: 130000, description: 'VIP ticket for Event 4' },
            { id: 8, type: 'Regular', price: 65000, description: 'Regular ticket for Event 4' }
        ]
    },
    {
        id: 5,
        name: 'Event 5',
        description: 'Deskripsi event 5',
        image: DUMMY_POSTER,
        date: '2025-02-05',
        location: 'offline',
        city: 'Surabaya',
        event_link: null,
        tickets: [
            { id: 9, type: 'VIP', price: 110000, description: 'VIP ticket for Event 5' },
            { id: 10, type: 'Regular', price: 55000, description: 'Regular ticket for Event 5' }
        ]
    },
    {
        id: 6,
        name: 'Event 6',
        description: 'Deskripsi event 6',
        image: DUMMY_POSTER,
        date: '2025-02-06',
        location: 'online',
        city: null,
        event_link: 'https://example.com/event6',
        tickets: [
            { id: 11, type: 'VIP', price: 140000, description: 'VIP ticket for Event 6' },
            { id: 12, type: 'Regular', price: 70000, description: 'Regular ticket for Event 6' }
        ]
    },
    {
        id: 7,
        name: 'Event 7',
        description: 'Deskripsi event 7',
        image: DUMMY_POSTER,
        date: '2025-02-07',
        location: 'offline',
        city: 'Yogyakarta',
        event_link: null,
        tickets: [
            { id: 13, type: 'VIP', price: 115000, description: 'VIP ticket for Event 7' },
            { id: 14, type: 'Regular', price: 57500, description: 'Regular ticket for Event 7' }
        ]
    },
    {
        id: 8,
        name: 'Event 8',
        description: 'Deskripsi event 8',
        image: DUMMY_POSTER,
        date: '2025-02-08',
        location: 'online',
        city: null,
        event_link: 'https://example.com/event8',
        tickets: [
            { id: 15, type: 'VIP', price: 125000, description: 'VIP ticket for Event 8' },
            { id: 16, type: 'Regular', price: 62500, description: 'Regular ticket for Event 8' }
        ]
    },
    {
        id: 9,
        name: 'Event 9',
        description: 'Deskripsi event 9',
        image: DUMMY_POSTER,
        date: '2025-02-09',
        location: 'offline',
        city: 'Medan',
        event_link: null,
        tickets: [
            { id: 17, type: 'VIP', price: 135000, description: 'VIP ticket for Event 9' },
            { id: 18, type: 'Regular', price: 67500, description: 'Regular ticket for Event 9' }
        ]
    },
    {
        id: 10,
        name: 'Event 10',
        description: 'Deskripsi event 10',
        image: DUMMY_POSTER,
        date: '2025-02-10',
        location: 'online',
        city: null,
        event_link: 'https://example.com/event10',
        tickets: [
            { id: 19, type: 'VIP', price: 145000, description: 'VIP ticket for Event 10' },
            { id: 20, type: 'Regular', price: 72500, description: 'Regular ticket for Event 10' }
        ]
    },
];
