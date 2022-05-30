import { sleep, check, group } from 'k6';
import { Options } from 'k6/options';
import http from 'k6/http';

export let options:Options = {
  // vus: 10,
  // duration: '30s',
  ext: {
    loadimpact: {
      projectID: 3587948,
      // Test runs with the same name groups test runs together
      name: "First test"
    }
  },
  stages: [
    { duration: '6s', target: 50 },
    { duration: '3s', target: 25 },
    { duration: '1s', target: 10 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
};

export default () => {
  const main = http.get('https://test-api.k6.io', { tags: { name: 'main' } });

  group('visit main page',  () =>  {
    check(main, {
      'status is 200': () => main.status === 200,
    });

    sleep(1);
  });
  

  // const style = http.get('https://test.k6.io/style.css', { tags: { name: 'style' }});

  // check(style, {
  //   'status is 200': () => style.status === 200,
  // });

  // const responses = http.batch([
  //   ['GET', 'https://test.k6.io', null, { tags: { ctype: 'html' } }],
  //   ['GET', 'https://test.k6.io/style.css', null, { tags: { ctype: 'css' } }],
  //   ['GET', 'https://test.k6.io/images/logo.png', null, { tags: { ctype: 'images' } }],
  // ]);
  // check(responses[0], {
  //   'main page status was 200': (res) => res.status === 200,
  // });
};
