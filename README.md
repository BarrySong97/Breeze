# Breeze

[![1684741395094.png](https://pic.peo.pw/a/2023/05/22/646b1d41cc796.png)](https://pic.peo.pw/a/2023/05/22/646b1d41cc796.png)

Breeze is a simple app to track your habit.

[Local Version (Data Stored Locally)](https://brz.netlify.app/)

[Cloud Version (Data Stored on Server)](http://www.breezelite.cn/)

it provides 3 types of views for you to check on your habit period.

## Week view

[![p9NMSMT.png](https://s1.ax1x.com/2023/05/05/p9NMSMT.png)](https://imgse.com/i/p9NMSMT)

## Month view

Clicking on the date icon in the weekly view will bring up the monthly view.

[![p9NMMee.png](https://s1.ax1x.com/2023/05/05/p9NMMee.png)](https://imgse.com/i/p9NMMee)

## Year view

Clicking on the habit itself will open the yearly view.

[![1684741924723.png](https://pic.peo.pw/a/2023/05/22/646b1f364e4dd.png)](https://pic.peo.pw/a/2023/05/22/646b1f364e4dd.png)

Both the weekly and yearly views allow for check-ins (simply click on the corresponding date to check in), with the yearly view serving as a way to display the data for the entire year.

In the yearly view, you can see...

- Start date of the check-in

- Maximum consecutive check-in days (longest streak)

- Current streak of consecutive check-in days

- Total number of check-in days (sum of all signed-in days)

And two crucial charts:

- Line graph
  [![1684738134876.png](https://pic.peo.pw/a/2023/05/22/646b105a54a56.png)](https://pic.peo.pw/a/2023/05/22/646b105a54a56.png)
- Heatmap
  [![1684738125250.png](https://pic.peo.pw/a/2023/05/22/646b1059e7b36.png)](https://pic.peo.pw/a/2023/05/22/646b1059e7b36.png)

# How to develop

There are two branches

- main 
  - work with [backend](https://github.com/BarrySong97/Breeze-nest)
  - store data on server
- local
  - store data in browser IndexDB by using [dexie](https://dexie.orG)

## setup

install

```bash
pnpm i
```

start up

```bash
pnpm run dev
```

build
```bash
pnpm run build
```

generating backend api files from swagger json by using [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen)

```javascript
pnpm run api:generate

// "api:generate": "openapi --input http://localhost:3000/api-json --output ./src/api --exportCore false"
```

## .env

On main branch, we support Google login.

so, you have to create your own google oauth2 crendentials.

Then fill in **VITE_GOOGLE_CLIENT_ID** and **VITE_GOOGLE_CALLBACK_URL** in .env

see detials in .env.example

 knowing more about .env in vite.

see [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)


## deploy

### main

We use jenkins to deploy.

So there is a jenkins file and dokckerfile.

### local

You could simply use Vercel or Netlify to deploy.



# Road Map

- [x] store on IndexDB(branch local)
- [x] Backend https://github.com/BarrySong97/Breeze-nest
- [ ] flutter
  - [x] android https://github.com/BarrySong97/butter
  - [ ] ios
