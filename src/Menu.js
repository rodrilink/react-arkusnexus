const Menu = [
    {
        heading: 'Main Navigation',
        translate: 'sidebar.heading.HEADER'
    },
    {
        name: 'Dashboard',
        icon: 'icon-speedometer',
        path: '/contacts',
        translate: 'sidebar.nav.DASHBOARD',
        label: { value: 3, color: 'success' }
    },
    {
        name: 'Contacts',
        icon: 'icon-cup',
        translate: 'sidebar.nav.extra.EXTRA',
        submenu: [
            {
                name: 'Contact Details',
                path: '/contacts/1'
            },
            {
                name: 'Contacts',
                path: '/contacts'
            }
        ]
    }
];

export default Menu;