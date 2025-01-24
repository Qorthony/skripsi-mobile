export interface EventTypes {
    id: number;
    name: string;
    date: string;
    description: string;
    image: any;
    location: string;
    city?: string|null;
    event_link?: string|null;
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
    },
];
