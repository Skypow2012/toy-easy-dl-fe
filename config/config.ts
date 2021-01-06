// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV, PUBLIC_PATH ='/toy-easy-dl-fe/' } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  publicPath: PUBLIC_PATH,
  base: PUBLIC_PATH,
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/model/my',
            },
            {
              path: '/model',
              name: 'model',
              icon: 'dashboard',
              routes: [{
                name: 'my',
                path: '/model/my',
                component: './model/my',
              }, {
                name: 'create',
                path: '/model/create',
                component: './model/create',
              },{
                name: 'viewCreate',
                path: '/data/viewCreate',
                component: './data/viewCreate',
              }, 
              // {
              //   name: 'train',
              //   path: '/model/train',
              //   component: './model/train',
              // },
              {
                name: 'infer',
                path: '/model/infer',
                component: './model/infer',
                hideInMenu: true,
              },
              {
                name: 'paramInfer',
                path: '/model/paramInfer',
                component: './model/paramInfer',
                hideInMenu: true,
                // 不展示顶栏
                headerRender: false,
                // 不展示页脚
                footerRender: false,
                // 不展示菜单
                menuRender: false,
                // 不展示菜单顶栏
                menuHeaderRender: false,
              },
              {
                name: 'push',
                path: '/model/push',
                component: './model/push',
              },]
            },
            {
              path: '/data',
              name: 'data',
              icon: 'form',
              routes: [{
                name: 'show',
                path: '/data/show',
                component: './data/show',
              }, {
              //   name: 'tag-manage',
              //   path: '/data/tag/manage',
              //   // component: './data/tag/manage',
              // }, {
                name: 'tag-online',
                path: '/data/tag/online',
                component: './data/tag/online',
              }, {
                name: 'cloud',
                path: '/data/cloud',
                // component: './data/cloud',
              }]
            },
            {
              path: '/deployment',
              name: 'deployment',
              icon: 'CheckCircleOutlined',
              routes: [{
                name: 'local',
                path: '/deployment/local',
                // component: './deployment/local',
              }]
            },
            {
              path: '/ai-market',
              name: 'ai-market',
              icon: 'RobotOutlined',
              routes: [{
                name: 'my',
                path: '/ai-market/my',
                // component: './ai/my',
              }, {
                name: 'sell',
                path: '/ai-market/sell',
                // component: './ai/sell',
              }]
            },
            {
              name: 'account',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  path: '/',
                  redirect: '/account/center',
                },
                {
                  name: 'settings',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],
            },
            {
              name: 'editor',
              icon: 'highlight',
              path: '/editor',
              routes: [
                {
                  path: '/',
                  redirect: '/editor/flow',
                },
                {
                  name: 'mind',
                  icon: 'smile',
                  path: '/editor/mind',
                  component: './editor/mind',
                },
                {
                  name: 'structure',
                  icon: 'smile',
                  path: '/editor/structure',
                  component: './editor/structure',
                },
              ],
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  exportStatic: {},
  esbuild: {},
});
