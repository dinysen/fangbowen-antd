export default [{
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [{
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [{
          name: 'login',
          path: '/user/login',
          component: './User/login',
        }, ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [{
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [{
                path: '/',
                redirect: '/fundinfolist',
              },
              {
                name: 'fund.fundinfo-list',
                icon: 'table',
                path: '/fundinfolist',
                component: './FundInfo',
              },
              {
                name: 'stock.stockinfo-list',
                icon: 'stock',
                path: '/stockinfolist',
                component: './StockInfo',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
