# Ahaless
Write serverless application on top of Typescript
### Installation
To install the AhaLess library into an existing project, use the `yarn` CLI 
```bash
yarn add @ahamove/ahaless 
yarn add serverless-webpack @ahamove/serverless-gen-functions -D
```
or the `npm` CLI
```bash
npm install @ahamove/ahaless
npm add serverless-webpack @ahamove/serverless-gen-functions -D
```

### Examples
We have several examples on the website. Here is the first one to get you started

```typescript
// ./src/hello/hello.service.ts

import { injectable } from '@ahamove/ahaless'

@injectable()
export class HelloService {
  async hello() {
    return 'Hello world'
  }
}
```

```typescript
// ./src/hello/hello.handler.ts

import { HelloService } from './hello.service'
import { handler, get, param } from '@ahamove/ahaless'

@handler()
export class HelloHandler {
  constructor(private readonly helloService: HelloService) {
  }

  @get()
  async hello() {
    return this.helloService.hello()
  }
}
```

```typescript
// ./src/hello/hello.module.ts
import { module } from '@ahamove/ahaless'
import { HelloHandler } from './src/hello.handler'

@module({
  handlers: [HelloHandler],
  providers: [HelloService]
})
export class HelloModule {}
```

```typescript
// ./handler.ts
import { module } from '@ahamove/ahaless'
import { HelloModule } from './src/hello/hello.module'

@module({
  imports: [HelloModule],
  root: true,
  exportObject: exports
})
export default class Handler {}
```

### Stay in touch
* Author - lynkxyz
* Company - AhaMove

### License
Ahaless is MIT licensed
